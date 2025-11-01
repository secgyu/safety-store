import { AlertCircle, BarChart3, Bell, Download, Lightbulb, MessageCircle, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { ActionCard } from "@/components/action-card";
import { AppHeader } from "@/components/app-header";
import { RiskCard } from "@/components/risk-card";
import { RiskGauge } from "@/components/risk-gauge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { generatePDFReport } from "@/lib/pdf-generator";

type AlertLevel = "GREEN" | "YELLOW" | "ORANGE" | "RED";

type ResultData = {
  p_final: number;
  alert: AlertLevel;
  risk_components: {
    sales_risk: number;
    customer_risk: number;
    market_risk: number;
  };
  recommendations: Array<{
    title: string;
    description: string;
    priority: "high" | "medium" | "low";
  }>;
};

export default function ResultsPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [resultData, setResultData] = useState<ResultData | null>(null);
  const [diagnosisInfo, setDiagnosisInfo] = useState<any>(null);

  useEffect(() => {
    const diagnosisDataStr = sessionStorage.getItem("diagnosisData");
    const diagnosisResultStr = sessionStorage.getItem("diagnosisResult");

    if (!diagnosisDataStr || !diagnosisResultStr) {
      navigate("/diagnose");
      return;
    }

    try {
      const parsedInfo = JSON.parse(diagnosisDataStr);
      const parsedResult = JSON.parse(diagnosisResultStr);

      setDiagnosisInfo(parsedInfo);

      // API 응답을 ResultData 형식으로 매핑
      const mappedResult: ResultData = {
        p_final: parsedResult.overallScore || parsedResult.p_final || 0,
        alert: parsedResult.riskLevel || parsedResult.alert || "GREEN",
        risk_components: {
          sales_risk: parsedResult.components?.sales?.score || parsedResult.risk_components?.sales_risk || 0,
          customer_risk: parsedResult.components?.customer?.score || parsedResult.risk_components?.customer_risk || 0,
          market_risk: parsedResult.components?.market?.score || parsedResult.risk_components?.market_risk || 0,
        },
        recommendations: parsedResult.recommendations || [],
      };

      setResultData(mappedResult);
      setLoading(false);
    } catch (error) {
      console.error("[v0] Error parsing diagnosis data:", error);
      setLoading(false);
      navigate("/diagnose");
    }
  }, [navigate]);

  const getAlertInfo = (alert: AlertLevel) => {
    switch (alert) {
      case "GREEN":
        return { label: "안전", color: "text-success", description: "건강한 상태입니다" };
      case "YELLOW":
        return { label: "주의", color: "text-warning", description: "관심이 필요합니다" };
      case "ORANGE":
        return { label: "경고", color: "text-alert", description: "개선이 필요합니다" };
      case "RED":
        return { label: "위험", color: "text-danger", description: "즉시 조치가 필요합니다" };
    }
  };

  // 점수에 따른 설명 문구 생성 함수
  const getScoreDescription = (type: "sales" | "customer" | "market", score: number): string => {
    const scoreLevel =
      score >= 90
        ? "excellent"
        : score >= 80
        ? "good"
        : score >= 70
        ? "fair"
        : score >= 60
        ? "average"
        : score >= 50
        ? "caution"
        : score >= 40
        ? "warning"
        : "danger";

    const messages = {
      sales: {
        excellent: "매출이 매우 안정적이고 지속적으로 성장하고 있어요",
        good: "매출이 양호하고 꾸준히 유지되고 있습니다",
        fair: "매출이 평균 수준을 유지하고 있어요",
        average: "매출이 약간 불안정한 모습을 보이고 있습니다",
        caution: "최근 매출이 소폭 감소하는 경향이 있어요",
        warning: "매출이 평균보다 감소했어요. 개선이 필요합니다",
        danger: "매출이 크게 감소했어요. 즉시 조치가 필요합니다",
      },
      customer: {
        excellent: "고객 만족도가 매우 높고 충성 고객이 많아요",
        good: "고객 수가 안정적으로 증가하고 있습니다",
        fair: "고객 수가 평균 수준을 유지하고 있어요",
        average: "고객 수가 정체되어 있습니다",
        caution: "고객 수가 소폭 감소하는 추세입니다",
        warning: "고객 수가 감소하고 있어요. 고객 유지 전략이 필요합니다",
        danger: "고객 이탈이 심각합니다. 긴급 대응이 필요해요",
      },
      market: {
        excellent: "시장 경쟁력이 매우 우수하고 입지가 탁월합니다",
        good: "시장에서 안정적인 위치를 확보하고 있어요",
        fair: "지역 시장에서 평균적인 경쟁력을 보이고 있습니다",
        average: "시장 경쟁이 다소 치열해지고 있어요",
        caution: "지역 시장 경쟁이 증가하고 있습니다",
        warning: "경쟁 심화로 시장 점유율이 감소하고 있어요",
        danger: "시장 경쟁에서 밀리고 있습니다. 차별화 전략이 시급해요",
      },
    };

    return messages[type][scoreLevel];
  };

  if (loading) {
    return (
      <>
        <AppHeader />
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-lg font-medium text-muted-foreground">분석 중입니다...</p>
            <p className="text-sm text-muted-foreground mt-2">잠시만 기다려주세요</p>
          </div>
        </div>
      </>
    );
  }

  if (!resultData) {
    return (
      <>
        <AppHeader />
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
          <Card className="max-w-md">
            <CardContent className="pt-6 text-center">
              <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-bold mb-2">결과를 불러올 수 없습니다</h2>
              <p className="text-muted-foreground mb-6">일시적인 오류가 발생했습니다. 다시 시도해주세요.</p>
              <Button asChild>
                <Link to="/diagnose">다시 진단하기</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  const alertInfo = getAlertInfo(resultData.alert);

  const handleDownloadPDF = async () => {
    if (!resultData || !diagnosisInfo) {
      toast({
        title: "오류",
        description: "다운로드할 데이터가 없습니다.",
        variant: "destructive",
      });
      return;
    }

    try {
      toast({
        title: "PDF 생성 중",
        description: "잠시만 기다려주세요...",
      });

      await generatePDFReport({
        businessName: diagnosisInfo.businessName || "내 가게",
        industry: diagnosisInfo.industry || "정보 없음",
        diagnosisDate: new Date().toLocaleDateString("ko-KR"),
        overallRisk: resultData.p_final,
        riskLevel: resultData.alert,
        salesRisk: resultData.risk_components.sales_risk,
        customerRisk: resultData.risk_components.customer_risk,
        marketRisk: resultData.risk_components.market_risk,
        revenue: diagnosisInfo.revenue || 0,
        customerCount: diagnosisInfo.customerCount || 0,
        operatingMonths: diagnosisInfo.operatingMonths || 0,
        recommendations: resultData.recommendations.map((rec) => ({
          title: rec.title,
          description: rec.description,
          priority: rec.priority.toUpperCase(),
        })),
      });

      toast({
        title: "다운로드 완료",
        description: "PDF 리포트가 다운로드되었습니다.",
      });
    } catch (error) {
      console.error("[v0] PDF generation error:", error);
      toast({
        title: "오류",
        description: "PDF 생성 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <AppHeader />
      <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-white to-purple-50/30">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <Card className="mb-10 glass-card rounded-3xl">
            <CardContent className="pt-10 pb-10">
              <div className="flex flex-col md:flex-row items-center gap-10">
                <div className="flex-shrink-0">
                  <RiskGauge value={resultData.p_final} alert={resultData.alert} size="large" />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                    현재 위험도는 <span className={alertInfo.color}>'{alertInfo.label}'</span> 단계입니다
                  </h1>
                  <p className="text-xl text-muted-foreground mb-6">{alertInfo.description}</p>
                  <p className="text-lg text-muted-foreground">
                    우리 가게는 같은 업종 평균보다{" "}
                    <span className="font-semibold">{resultData.p_final > 20 ? "조금 낮은" : "양호한"}</span> 상태입니다
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="mb-10">
            <h2 className="text-3xl font-bold mb-8">상세 분석</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <RiskCard
                type="sales"
                value={resultData.risk_components.sales_risk}
                description={getScoreDescription("sales", resultData.risk_components.sales_risk)}
              />
              <RiskCard
                type="customer"
                value={resultData.risk_components.customer_risk}
                description={getScoreDescription("customer", resultData.risk_components.customer_risk)}
              />
              <RiskCard
                type="market"
                value={resultData.risk_components.market_risk}
                description={getScoreDescription("market", resultData.risk_components.market_risk)}
              />
            </div>
          </div>

          <div className="mb-10">
            <h2 className="text-3xl font-bold mb-8">맞춤 개선 제안</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resultData.recommendations.map((rec, index) => (
                <ActionCard
                  key={index}
                  title={rec.title}
                  description={rec.description}
                  priority={rec.priority.toUpperCase() as "HIGH" | "MEDIUM" | "LOW"}
                  onLearnMore={() => {
                    console.log("[v0] Learn more clicked:", rec.title);
                  }}
                />
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-4 justify-center mb-10">
            <Button asChild size="lg" className="gap-2 rounded-2xl shadow-lg hover:shadow-xl transition-all">
              <Link to="/action-plan">
                <Lightbulb className="h-5 w-5" />
                개선 계획 수립
              </Link>
            </Button>
            <Button asChild size="lg" className="gap-2 rounded-2xl shadow-lg hover:shadow-xl transition-all">
              <Link to="/consultation">
                <MessageCircle className="h-5 w-5" />
                AI 상담 받기
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="gap-2 glass-hover rounded-2xl bg-transparent">
              <Link to="/notifications">
                <Bell className="h-5 w-5" />
                알림 센터
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="gap-2 glass-hover rounded-2xl bg-transparent"
              onClick={handleDownloadPDF}
            >
              <Download className="h-5 w-5" />
              상세 보고서 다운로드
            </Button>
            <Button asChild size="lg" variant="outline" className="gap-2 glass-hover rounded-2xl bg-transparent">
              <Link to="/compare">
                <BarChart3 className="h-5 w-5" />
                다른 업종과 비교하기
              </Link>
            </Button>
            <Button asChild size="lg" variant="secondary" className="gap-2 rounded-3xl">
              <Link to="/dashboard">
                <TrendingUp className="h-5 w-5" />
                정기 모니터링 설정
              </Link>
            </Button>
          </div>

          <Card className="glass-card rounded-3xl">
            <CardContent className="pt-8 pb-8">
              <div className="flex gap-4">
                <Lightbulb className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg mb-3">진단 결과를 저장하고 싶으신가요?</h3>
                  <p className="text-base text-muted-foreground mb-6">
                    회원가입 후 대시보드에서 과거 진단 기록을 확인하고 추세를 분석할 수 있습니다.
                  </p>
                  <Button asChild variant="default" size="sm" className="rounded-xl">
                    <Link to="/dashboard">대시보드로 이동</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
