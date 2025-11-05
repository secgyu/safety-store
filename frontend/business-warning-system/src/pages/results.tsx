import { AlertCircle } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

import { useBenchmark } from "@/features/benchmark";
import { useDiagnosisHistory } from "@/features/diagnosis";
import {
  ActionButtons,
  IndustryComparison,
  IndustryPosition,
  RadarAnalysis,
  RecommendationsList,
  ResultHeader,
  RiskDetailCards,
  TimeSeriesTrend,
} from "@/features/diagnosis/components/Results";
import { usePDFExport } from "@/features/diagnosis/hooks/usePDFExport";
import { useResultData } from "@/features/diagnosis/hooks/useResultData";
import { getScoreDescription } from "@/features/diagnosis/utils/scoreDescriptions";
import { AppHeader } from "@/shared/components/layout/AppHeader";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";

type AlertLevel = "GREEN" | "YELLOW" | "ORANGE" | "RED";

function getAlertInfo(alert: AlertLevel) {
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
}

export default function ResultsPage() {
  const [industryCode] = useState<string>("restaurant");

  // Custom hooks
  const { loading, resultData, diagnosisInfo, encodedMct } = useResultData();
  const { exportPDF } = usePDFExport();

  // 업종 평균 데이터 가져오기
  const { data: benchmarkData } = useBenchmark(industryCode, undefined);

  // 진단 이력 데이터 가져오기 (시계열 차트용)
  const { data: historyData } = useDiagnosisHistory(encodedMct);

  // PDF 다운로드 핸들러
  const handleDownloadPDF = async () => {
    if (!resultData || !diagnosisInfo) return;

    await exportPDF({
      resultData,
      diagnosisInfo,
      industryCode,
      benchmarkData,
      historyData,
    });
  };

  // 로딩 상태
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

  // 데이터 없음
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

  return (
    <>
      <AppHeader />
      <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-white to-purple-50/30">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          {/* 헤더 - 위험도 게이지 */}
          <ResultHeader riskScore={resultData.p_final} alertLevel={resultData.alert} alertInfo={alertInfo} />

          {/* 상세 분석 카드 */}
          <RiskDetailCards riskComponents={resultData.risk_components} getScoreDescription={getScoreDescription} />

          {/* 레이더 차트 분석 */}
          {benchmarkData && (
            <RadarAnalysis
              riskComponents={resultData.risk_components}
              averageRiskScore={benchmarkData.averageRiskScore}
            />
          )}

          {/* 월별 위험도 추세 */}
          {historyData && historyData.diagnoses && <TimeSeriesTrend diagnoses={historyData.diagnoses} />}

          {/* 업종 내 내 위치 */}
          {benchmarkData && (
            <IndustryPosition myRiskScore={resultData.p_final} averageRiskScore={benchmarkData.averageRiskScore} />
          )}

          {/* 업종 평균과 비교 */}
          {benchmarkData && (
            <IndustryComparison
              myRiskScore={resultData.p_final}
              averageRiskScore={benchmarkData.averageRiskScore}
              revenueRatio={resultData.revenue_ratio}
              benchmarkMetrics={benchmarkData.metrics}
            />
          )}

          {/* 맞춤 개선 제안 */}
          <RecommendationsList recommendations={resultData.recommendations} />

          {/* 액션 버튼들 */}
          <ActionButtons onDownloadPDF={handleDownloadPDF} />
        </div>
      </div>
    </>
  );
}
