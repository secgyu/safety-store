import html2canvas from "html2canvas";

import { useToast } from "@/shared/hooks/use-toast";
import { generatePDFReport } from "@/shared/services/pdf/pdfGenerator";

import type { DiagnosisInfo,ResultData } from "./useResultData";

interface BenchmarkData {
  averageRiskScore: number;
  metrics: {
    revenue: { average: number };
    customers: { average: number };
  };
}

interface HistoryData {
  diagnoses: Array<{
    overallScore: number;
    components: {
      customer: { score: number };
    };
  }>;
}

interface PDFExportOptions {
  resultData: ResultData;
  diagnosisInfo: DiagnosisInfo;
  industryCode: string;
  benchmarkData?: BenchmarkData;
  historyData?: HistoryData;
}

export function usePDFExport() {
  const { toast } = useToast();

  const exportPDF = async ({
    resultData,
    diagnosisInfo,
    industryCode,
    benchmarkData,
    historyData,
  }: PDFExportOptions) => {
    try {
      toast({
        title: "PDF 생성 중",
        description: "차트를 캡처하고 있습니다...",
      });

      // 레이더 차트 캡처
      let radarChartImage: string | undefined;
      const radarChartElement = document.getElementById("radar-chart-for-pdf");

      if (radarChartElement) {
        try {
          // 차트가 완전히 렌더링될 때까지 대기
          await new Promise((resolve) => setTimeout(resolve, 800));

          const canvas = await html2canvas(radarChartElement, {
            scale: 2,
            backgroundColor: "#ffffff",
            useCORS: true,
            logging: false,
          });

          radarChartImage = canvas.toDataURL("image/png");
          console.log("✅ 레이더 차트 캡처 성공!");
        } catch (chartError) {
          console.error("❌ 레이더 차트 캡처 실패:", chartError);
        }
      } else {
        console.warn("⚠️ 레이더 차트 요소를 찾을 수 없습니다");
      }

      toast({
        title: "PDF 생성 중",
        description: "데이터를 처리하고 있습니다...",
      });

      // 업종 평균 데이터에서 실제 값 가져오기
      const avgRevenue = benchmarkData?.metrics?.revenue?.average || 0;
      const avgCustomers = benchmarkData?.metrics?.customers?.average || 1;
      const customerSpending = avgRevenue > 0 && avgCustomers > 0 ? Math.round(avgRevenue / avgCustomers) : 0;

      // 성장률 계산
      let revenueGrowth: number | undefined;
      let customerGrowth: number | undefined;

      if (historyData && historyData.diagnoses && historyData.diagnoses.length >= 2) {
        const oldest = historyData.diagnoses[historyData.diagnoses.length - 1];
        const newest = historyData.diagnoses[0];

        if (oldest.overallScore > 0) {
          revenueGrowth = ((newest.overallScore - oldest.overallScore) / oldest.overallScore) * 100;
        }

        if (oldest.components?.customer?.score && newest.components?.customer?.score) {
          customerGrowth =
            ((newest.components.customer.score - oldest.components.customer.score) / oldest.components.customer.score) *
            100;
        }
      }

      // 업종 비교 데이터 계산
      const industryAvgRisk = benchmarkData?.averageRiskScore || 50;
      const relativePosition = Math.min(
        100,
        Math.max(0, 50 + ((industryAvgRisk - resultData.p_final) / industryAvgRisk) * 50)
      );

      const myRevenue = Math.round((avgRevenue * (resultData.revenue_ratio || 100)) / 100);
      const revenueDiff = avgRevenue > 0 ? ((myRevenue - avgRevenue) / avgRevenue) * 100 : 0;

      const myCustomers = Math.round(avgCustomers);
      const customerDiff = 0;

      await generatePDFReport({
        businessName: diagnosisInfo?.business_name || "내 가게",
        industry: industryCode || "정보 없음",
        diagnosisDate: new Date().toLocaleDateString("ko-KR"),
        overallRisk: resultData.p_final,
        riskLevel: resultData.alert,
        salesRisk: resultData.risk_components.sales_risk,
        customerRisk: resultData.risk_components.customer_risk,
        marketRisk: resultData.risk_components.market_risk,
        revenue: Math.round(avgRevenue),
        customerCount: Math.round(avgCustomers),
        operatingMonths: historyData?.diagnoses?.length || 0,
        recommendations: resultData.recommendations.map((rec) => ({
          title: rec.title,
          description: rec.description,
          priority: rec.priority.toUpperCase(),
        })),
        detailedMetrics: {
          avgRevenue: Math.round(avgRevenue),
          avgCustomers: Math.round(avgCustomers),
          customerSpending: customerSpending,
          revenueGrowth: revenueGrowth,
          customerGrowth: customerGrowth,
        },
        benchmarkData: benchmarkData
          ? {
              industryName: industryCode || "업종",
              averageRiskScore: industryAvgRisk,
              myPosition: relativePosition,
              revenueComparison: {
                mine: myRevenue,
                average: Math.round(avgRevenue),
                differencePercent: revenueDiff,
              },
              customerComparison: {
                mine: myCustomers,
                average: Math.round(avgCustomers),
                differencePercent: customerDiff,
              },
            }
          : undefined,
        chartImages: radarChartImage
          ? {
              radarChart: radarChartImage,
            }
          : undefined,
      });

      console.log("PDF 생성 완료 - 차트 이미지 포함 여부:", !!radarChartImage);

      toast({
        title: "다운로드 완료",
        description: "PDF 리포트가 다운로드되었습니다.",
      });
    } catch (error) {
      console.error("PDF generation error:", error);
      toast({
        title: "오류",
        description: "PDF 생성 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  return { exportPDF };
}

