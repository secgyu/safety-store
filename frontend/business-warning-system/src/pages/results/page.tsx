import { AlertCircle, BarChart3, Bell, Download, Lightbulb, MessageCircle, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from "recharts";

import { ActionCard } from "@/components/action-card";
import { AppHeader } from "@/components/app-header";
import { RiskCard } from "@/components/risk-card";
import { RiskGauge } from "@/components/risk-gauge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { generatePDFReport } from "@/lib/pdf-generator";
import { useBenchmark, useDiagnosisHistory } from "@/lib/api";

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
  const [industryCode, setIndustryCode] = useState<string>("restaurant");
  const [encodedMct, setEncodedMct] = useState<string>("");

  // 업종 평균 데이터 가져오기
  const { data: benchmarkData } = useBenchmark(industryCode, undefined);

  // 진단 이력 데이터 가져오기 (시계열 차트용)
  const { data: historyData } = useDiagnosisHistory(encodedMct);

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
      
      // encoded_mct 설정 (이력 조회용)
      if (parsedInfo.encoded_mct) {
        setEncodedMct(parsedInfo.encoded_mct);
      }

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

          {/* 레이더 차트 - 위험 요소 분석 */}
          <div className="mb-10">
            <h2 className="text-3xl font-bold mb-8">위험 요소 분석</h2>
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>3가지 위험 요소 상세 비교</CardTitle>
                <p className="text-sm text-muted-foreground mt-2">
                  매출, 고객, 시장 위험도를 시각화하여 어느 부분에 집중해야 하는지 확인하세요
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  {/* 레이더 차트 */}
                  <div>
                    <ResponsiveContainer width="100%" height={400}>
                      <RadarChart
                        data={[
                          {
                            category: "매출 안정성",
                            myScore: resultData.risk_components.sales_risk,
                            average: benchmarkData?.averageRiskScore || 0,
                            fullMark: 100,
                          },
                          {
                            category: "고객 유지력",
                            myScore: resultData.risk_components.customer_risk,
                            average: benchmarkData?.averageRiskScore || 0,
                            fullMark: 100,
                          },
                          {
                            category: "시장 경쟁력",
                            myScore: resultData.risk_components.market_risk,
                            average: benchmarkData?.averageRiskScore || 0,
                            fullMark: 100,
                          },
                        ]}
                      >
                        <PolarGrid stroke="#e5e7eb" />
                        <PolarAngleAxis dataKey="category" tick={{ fill: "#6b7280", fontSize: 13 }} />
                        <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: "#6b7280", fontSize: 11 }} />
                        <Radar
                          name="내 가게"
                          dataKey="myScore"
                          stroke="#3b82f6"
                          fill="#3b82f6"
                          fillOpacity={0.5}
                          strokeWidth={2}
                        />
                        <Radar
                          name="업종 평균"
                          dataKey="average"
                          stroke="#94a3b8"
                          fill="#94a3b8"
                          fillOpacity={0.25}
                          strokeWidth={2}
                        />
                        <Legend
                          wrapperStyle={{
                            paddingTop: "20px",
                          }}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "white",
                            border: "1px solid #e5e7eb",
                            borderRadius: "8px",
                          }}
                          formatter={(value: number) => value.toFixed(1)}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* 해석 및 인사이트 */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold text-lg mb-4">📊 위험 요소 분석</h3>
                      <div className="space-y-4">
                        {/* 매출 안정성 */}
                        <div className="p-4 rounded-lg bg-gradient-to-r from-blue-50 to-blue-100">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-semibold text-blue-900">매출 안정성</span>
                            <span className="text-2xl font-bold text-blue-600">
                              {resultData.risk_components.sales_risk.toFixed(1)}
                            </span>
                          </div>
                          <p className="text-sm text-blue-800">
                            {resultData.risk_components.sales_risk > 70
                              ? "매출이 매우 안정적입니다! 현재 전략을 유지하세요."
                              : resultData.risk_components.sales_risk > 50
                              ? "매출이 양호합니다. 꾸준한 관리가 필요합니다."
                              : "매출 개선이 필요합니다. 매출 증대 전략을 검토하세요."}
                          </p>
                        </div>

                        {/* 고객 유지력 */}
                        <div className="p-4 rounded-lg bg-gradient-to-r from-purple-50 to-purple-100">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-semibold text-purple-900">고객 유지력</span>
                            <span className="text-2xl font-bold text-purple-600">
                              {resultData.risk_components.customer_risk.toFixed(1)}
                            </span>
                          </div>
                          <p className="text-sm text-purple-800">
                            {resultData.risk_components.customer_risk > 70
                              ? "고객 충성도가 높습니다! 우수합니다."
                              : resultData.risk_components.customer_risk > 50
                              ? "고객 유지가 양호합니다. 재방문율을 높여보세요."
                              : "고객 이탈 방지가 필요합니다. 고객 관리에 집중하세요."}
                          </p>
                        </div>

                        {/* 시장 경쟁력 */}
                        <div className="p-4 rounded-lg bg-gradient-to-r from-green-50 to-green-100">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-semibold text-green-900">시장 경쟁력</span>
                            <span className="text-2xl font-bold text-green-600">
                              {resultData.risk_components.market_risk.toFixed(1)}
                            </span>
                          </div>
                          <p className="text-sm text-green-800">
                            {resultData.risk_components.market_risk > 70
                              ? "시장에서 강한 경쟁력을 가지고 있습니다!"
                              : resultData.risk_components.market_risk > 50
                              ? "시장 내 입지가 양호합니다. 차별화를 강화하세요."
                              : "경쟁이 치열합니다. 차별화 전략이 필요합니다."}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* 종합 평가 */}
                    <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-orange-200">
                      <div className="flex gap-3">
                        <Lightbulb className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-orange-900 mb-1">💡 종합 평가</h4>
                          <p className="text-sm text-orange-800">
                            {Math.min(
                              resultData.risk_components.sales_risk,
                              resultData.risk_components.customer_risk,
                              resultData.risk_components.market_risk
                            ) === resultData.risk_components.sales_risk
                              ? "매출 안정성이 가장 취약합니다. 매출 증대 방안을 우선 검토하세요."
                              : Math.min(
                                  resultData.risk_components.sales_risk,
                                  resultData.risk_components.customer_risk,
                                  resultData.risk_components.market_risk
                                ) === resultData.risk_components.customer_risk
                              ? "고객 유지력이 가장 취약합니다. 고객 만족도 개선에 집중하세요."
                              : "시장 경쟁력이 가장 취약합니다. 차별화 전략을 수립하세요."}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 시계열 라인 차트 - 월별 위험도 추세 */}
          {historyData && historyData.diagnoses && historyData.diagnoses.length > 1 && (
            <div className="mb-10">
              <h2 className="text-3xl font-bold mb-8">월별 위험도 추세</h2>
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>시간에 따른 위험도 변화</CardTitle>
                  <p className="text-sm text-muted-foreground mt-2">
                    최근 {historyData.diagnoses.length}개월간의 위험도 추세를 확인하세요
                  </p>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={350}>
                    <LineChart
                      data={historyData.diagnoses
                        .slice()
                        .reverse()
                        .map((d) => ({
                          month: d.taYm ? d.taYm.substring(0, 7) : "",
                          overall: d.overallScore,
                          sales: d.components.sales.score,
                          customer: d.components.customer.score,
                          market: d.components.market.score,
                        }))}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="month" tick={{ fill: "#6b7280", fontSize: 12 }} />
                      <YAxis
                        tick={{ fill: "#6b7280", fontSize: 12 }}
                        label={{ value: "점수", angle: -90, position: "insideLeft" }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "white",
                          border: "1px solid #e5e7eb",
                          borderRadius: "8px",
                        }}
                        formatter={(value: number) => value.toFixed(1)}
                      />
                      <Legend wrapperStyle={{ paddingTop: "20px" }} />
                      <Line
                        type="monotone"
                        dataKey="overall"
                        stroke="#8b5cf6"
                        strokeWidth={3}
                        name="전체 위험도"
                        dot={{ r: 5 }}
                        activeDot={{ r: 7 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="sales"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        name="매출 안정성"
                        dot={{ r: 4 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="customer"
                        stroke="#ec4899"
                        strokeWidth={2}
                        name="고객 유지력"
                        dot={{ r: 4 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="market"
                        stroke="#10b981"
                        strokeWidth={2}
                        name="시장 경쟁력"
                        dot={{ r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>

                  {/* 추세 분석 */}
                  <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg">
                    <div className="flex gap-3">
                      <TrendingUp className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-purple-900 mb-1">📈 추세 분석</h4>
                        <p className="text-sm text-purple-800">
                          {(() => {
                            const firstScore = historyData.diagnoses[historyData.diagnoses.length - 1].overallScore;
                            const lastScore = historyData.diagnoses[0].overallScore;
                            const trend = lastScore - firstScore;

                            if (trend > 5) {
                              return "위험도가 지속적으로 개선되고 있습니다! 현재의 전략을 유지하세요. 🎉";
                            } else if (trend > 0) {
                              return "위험도가 소폭 개선되고 있습니다. 꾸준히 관리하면 더 나아질 것입니다.";
                            } else if (trend > -5) {
                              return "위험도가 소폭 악화되고 있습니다. 개선 방안을 검토해보세요.";
                            } else {
                              return "위험도가 크게 악화되고 있습니다. 즉시 개선 조치가 필요합니다. ⚠️";
                            }
                          })()}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* 백분위 게이지 - 업종 내 내 위치 */}
          {benchmarkData && (
            <div className="mb-10">
              <h2 className="text-3xl font-bold mb-8">업종 내 내 위치</h2>
              <Card className="glass-card bg-gradient-to-br from-indigo-50 to-purple-50">
                <CardContent className="pt-8 pb-8">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-2">같은 업종 내 상대적 순위</p>
                    <div className="relative">
                      {/* 백분위 게이지 */}
                      <div className="flex justify-center items-center mb-6">
                        <div className="relative w-64 h-64">
                          <svg viewBox="0 0 200 120" className="w-full h-full">
                            {/* 배경 호 */}
                            <path
                              d="M 20 100 A 80 80 0 0 1 180 100"
                              fill="none"
                              stroke="#e5e7eb"
                              strokeWidth="20"
                              strokeLinecap="round"
                            />
                            {/* 진행 호 - 백분위 기반 */}
                            <path
                              d="M 20 100 A 80 80 0 0 1 180 100"
                              fill="none"
                              stroke={
                                (() => {
                                  const myRisk = resultData.p_final;
                                  const avgRisk = benchmarkData.averageRiskScore;
                                  
                                  // 평균 대비 상대적 위치 계산 (0-100, 50이 평균)
                                  const relativePosition = Math.min(100, Math.max(0, 50 + ((avgRisk - myRisk) / avgRisk) * 50));
                                  
                                  if (relativePosition >= 70) return "#10b981"; // 초록 - 매우 안전
                                  if (relativePosition >= 55) return "#3b82f6"; // 파랑 - 안전
                                  if (relativePosition >= 45) return "#f59e0b"; // 주황 - 평균 근처
                                  if (relativePosition >= 30) return "#f97316"; // 진한 주황 - 주의
                                  return "#ef4444"; // 빨강 - 위험
                                })()
                              }
                              strokeWidth="20"
                              strokeLinecap="round"
                              strokeDasharray={`${
                                (() => {
                                  const myRisk = resultData.p_final;
                                  const avgRisk = benchmarkData.averageRiskScore;
                                  
                                  // 평균 대비 상대적 위치 계산 (0-100, 50이 평균)
                                  const relativePosition = Math.min(100, Math.max(0, 50 + ((avgRisk - myRisk) / avgRisk) * 50));
                                  
                                  // 게이지 채우기: relativePosition을 0-251 범위로 변환
                                  return (relativePosition * 2.51).toFixed(2);
                                })()
                              } 251`}
                            />
                            {/* 중앙 텍스트 */}
                            <text x="100" y="85" textAnchor="middle" className="text-5xl font-bold" fill="#1f2937">
                              {(() => {
                                const myRisk = resultData.p_final;
                                const avgRisk = benchmarkData.averageRiskScore;
                                
                                // 평균 대비 상대적 위치 계산 (0-100, 50이 평균)
                                const relativePosition = Math.min(100, Math.max(0, 50 + ((avgRisk - myRisk) / avgRisk) * 50));
                                
                                // 상위/하위 표시 (50을 기준으로)
                                if (relativePosition >= 50) {
                                  // 평균보다 좋음 = 상위
                                  const topPercent = Math.round(100 - relativePosition);
                                  return `상위 ${topPercent}%`;
                                } else {
                                  // 평균보다 나쁨 = 하위
                                  const bottomPercent = Math.round(relativePosition);
                                  return `하위 ${bottomPercent}%`;
                                }
                              })()}
                            </text>
                          </svg>
                        </div>
                      </div>

                      {/* 설명 */}
                      <div className="mb-6">
                        <p className="text-lg font-semibold text-foreground mb-2">
                          {(() => {
                            const myRisk = resultData.p_final;
                            const avgRisk = benchmarkData.averageRiskScore;
                            const relativePosition = Math.min(100, Math.max(0, 50 + ((avgRisk - myRisk) / avgRisk) * 50));
                            
                            if (relativePosition >= 70) return "🎉 매우 안전한 상태입니다!";
                            if (relativePosition >= 55) return "✅ 안전한 상태입니다";
                            if (relativePosition >= 45) return "👍 평균 수준입니다";
                            if (relativePosition >= 30) return "⚠️ 주의가 필요합니다";
                            return "🚨 개선이 시급합니다";
                          })()}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          내 위험도: <strong>{resultData.p_final.toFixed(1)}%</strong> | 
                          업종 평균: <strong>{benchmarkData.averageRiskScore.toFixed(1)}%</strong>
                          {resultData.p_final < benchmarkData.averageRiskScore ? (
                            <span className="text-green-600 font-semibold ml-2">
                              (평균보다 {Math.abs(resultData.p_final - benchmarkData.averageRiskScore).toFixed(1)}%p 낮음 ✓)
                            </span>
                          ) : (
                            <span className="text-orange-600 font-semibold ml-2">
                              (평균보다 {Math.abs(resultData.p_final - benchmarkData.averageRiskScore).toFixed(1)}%p 높음)
                            </span>
                          )}
                        </p>
                      </div>

                      {/* 범위 표시 */}
                      <div className="flex justify-between items-center px-4 text-xs text-muted-foreground">
                        <div className="text-center">
                          <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-1"></div>
                          <span>안전</span>
                        </div>
                        <div className="text-center">
                          <div className="w-3 h-3 bg-blue-500 rounded-full mx-auto mb-1"></div>
                          <span>양호</span>
                        </div>
                        <div className="text-center">
                          <div className="w-3 h-3 bg-orange-500 rounded-full mx-auto mb-1"></div>
                          <span>주의</span>
                        </div>
                        <div className="text-center">
                          <div className="w-3 h-3 bg-red-500 rounded-full mx-auto mb-1"></div>
                          <span>위험</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* 업종 비교 그래프 */}
          {benchmarkData && (
            <div className="mb-10">
              <h2 className="text-3xl font-bold mb-8">업종 평균과 비교</h2>
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>내 가게 vs 업종 평균</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-6">
                    {/* 위험도 비교 */}
                    <div>
                      <h3 className="font-semibold text-lg mb-4 text-center">위험도</h3>
                      <ResponsiveContainer width="100%" height={250}>
                        <BarChart
                          data={[
                            { name: "내 가게", value: resultData.p_final, type: "mine" },
                            { name: "업종 평균", value: benchmarkData.averageRiskScore, type: "average" },
                          ]}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                          <XAxis dataKey="name" tick={{ fill: "#6b7280", fontSize: 12 }} />
                          <YAxis tick={{ fill: "#6b7280", fontSize: 12 }} />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "white",
                              border: "1px solid #e5e7eb",
                              borderRadius: "8px",
                            }}
                            formatter={(value: number) => [`${value.toFixed(1)}%`, "위험도"]}
                          />
                          <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                            {[
                              { name: "내 가게", value: resultData.p_final, type: "mine" },
                              { name: "업종 평균", value: benchmarkData.averageRiskScore, type: "average" },
                            ].map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.type === "mine" ? "#3b82f6" : "#94a3b8"} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                      <p className="text-center text-sm text-muted-foreground mt-2">
                        {resultData.p_final > benchmarkData.averageRiskScore ? (
                          <span className="text-orange-600 font-semibold">
                            업종 평균보다 {(resultData.p_final - benchmarkData.averageRiskScore).toFixed(1)}%p 높음
                          </span>
                        ) : (
                          <span className="text-green-600 font-semibold">
                            업종 평균보다 {(benchmarkData.averageRiskScore - resultData.p_final).toFixed(1)}%p 낮음
                          </span>
                        )}
                      </p>
                    </div>

                    {/* 매출 비교 - 가상 데이터 (실제로는 API에서) */}
                    <div>
                      <h3 className="font-semibold text-lg mb-4 text-center">월 평균 매출</h3>
                      <div className="text-center py-8">
                        <div className="space-y-4">
                          <div className="bg-blue-50 rounded-lg p-4">
                            <p className="text-sm text-muted-foreground mb-1">업종 평균</p>
                            <p className="text-2xl font-bold text-blue-600">
                              ₩{benchmarkData.metrics.revenue.average.toLocaleString()}
                            </p>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            실제 매출 데이터는 진단 시 입력한 정보를 기반으로 합니다.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* 고객 수 비교 */}
                    <div>
                      <h3 className="font-semibold text-lg mb-4 text-center">월 평균 고객 수</h3>
                      <div className="text-center py-8">
                        <div className="space-y-4">
                          <div className="bg-purple-50 rounded-lg p-4">
                            <p className="text-sm text-muted-foreground mb-1">업종 평균</p>
                            <p className="text-2xl font-bold text-purple-600">
                              {benchmarkData.metrics.customers.average.toLocaleString()}명
                            </p>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            꾸준한 고객 유지가 사업 안정성의 핵심입니다.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 인사이트 */}
                  <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Lightbulb className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="font-semibold text-lg mb-2">💡 업종 비교 인사이트</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {resultData.p_final > benchmarkData.averageRiskScore ? (
                            <>
                              현재 위험도가 업종 평균보다 높습니다. <strong>매출 안정화</strong>와{" "}
                              <strong>고객 유지</strong> 전략에 집중하여 위험도를 낮춰보세요. 아래 맞춤 개선 제안을
                              참고하세요.
                            </>
                          ) : (
                            <>
                              업종 평균보다 안정적인 상태입니다! 현재의 운영 방식을 유지하면서{" "}
                              <strong>지속적인 모니터링</strong>으로 안정성을 더욱 강화하세요.
                            </>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

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
