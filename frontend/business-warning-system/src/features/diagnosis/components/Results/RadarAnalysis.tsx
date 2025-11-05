import { BarChart3, Lightbulb } from "lucide-react";
import { Legend, PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, Tooltip } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";

interface RiskComponents {
  sales_risk: number;
  customer_risk: number;
  market_risk: number;
}

interface RadarAnalysisProps {
  riskComponents: RiskComponents;
  averageRiskScore: number;
}

export function RadarAnalysis({ riskComponents, averageRiskScore }: RadarAnalysisProps) {
  const radarData = [
    {
      category: "매출 안정성",
      myScore: riskComponents.sales_risk,
      average: averageRiskScore,
      fullMark: 100,
    },
    {
      category: "고객 유지력",
      myScore: riskComponents.customer_risk,
      average: averageRiskScore,
      fullMark: 100,
    },
    {
      category: "시장 경쟁력",
      myScore: riskComponents.market_risk,
      average: averageRiskScore,
      fullMark: 100,
    },
  ];

  const minRisk = Math.min(riskComponents.sales_risk, riskComponents.customer_risk, riskComponents.market_risk);
  const weakestArea =
    minRisk === riskComponents.sales_risk
      ? "매출 안정성이 가장 취약합니다. 매출 증대 방안을 우선 검토하세요."
      : minRisk === riskComponents.customer_risk
      ? "고객 유지력이 가장 취약합니다. 고객 만족도 개선에 집중하세요."
      : "시장 경쟁력이 가장 취약합니다. 차별화 전략을 수립하세요.";

  return (
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
            <div
              id="radar-chart-for-pdf"
              style={{ width: "600px", height: "400px", margin: "0 auto", backgroundColor: "#ffffff" }}
            >
              <RadarChart width={600} height={400} data={radarData}>
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
                <Legend wrapperStyle={{ paddingTop: "20px" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                  formatter={(value: number) => value.toFixed(1)}
                />
              </RadarChart>
            </div>

            {/* 해석 및 인사이트 */}
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                  위험 요소 분석
                </h3>
                <div className="space-y-4">
                  {/* 매출 안정성 */}
                  <div className="p-4 rounded-lg bg-gradient-to-r from-blue-50 to-blue-100">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-blue-900">매출 안정성</span>
                      <span className="text-2xl font-bold text-blue-600">{riskComponents.sales_risk.toFixed(1)}</span>
                    </div>
                    <p className="text-sm text-blue-800">
                      {riskComponents.sales_risk > 70
                        ? "매출이 매우 안정적입니다! 현재 전략을 유지하세요."
                        : riskComponents.sales_risk > 50
                        ? "매출이 양호합니다. 꾸준한 관리가 필요합니다."
                        : "매출 개선이 필요합니다. 매출 증대 전략을 검토하세요."}
                    </p>
                  </div>

                  {/* 고객 유지력 */}
                  <div className="p-4 rounded-lg bg-gradient-to-r from-purple-50 to-purple-100">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-purple-900">고객 유지력</span>
                      <span className="text-2xl font-bold text-purple-600">
                        {riskComponents.customer_risk.toFixed(1)}
                      </span>
                    </div>
                    <p className="text-sm text-purple-800">
                      {riskComponents.customer_risk > 70
                        ? "고객 충성도가 높습니다! 우수합니다."
                        : riskComponents.customer_risk > 50
                        ? "고객 유지가 양호합니다. 재방문율을 높여보세요."
                        : "고객 이탈 방지가 필요합니다. 고객 관리에 집중하세요."}
                    </p>
                  </div>

                  {/* 시장 경쟁력 */}
                  <div className="p-4 rounded-lg bg-gradient-to-r from-green-50 to-green-100">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-green-900">시장 경쟁력</span>
                      <span className="text-2xl font-bold text-green-600">{riskComponents.market_risk.toFixed(1)}</span>
                    </div>
                    <p className="text-sm text-green-800">
                      {riskComponents.market_risk > 70
                        ? "시장에서 강한 경쟁력을 가지고 있습니다!"
                        : riskComponents.market_risk > 50
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
                    <h4 className="font-semibold text-orange-900 mb-1 flex items-center gap-2">
                      <Lightbulb className="h-4 w-4" />
                      종합 평가
                    </h4>
                    <p className="text-sm text-orange-800">{weakestArea}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
