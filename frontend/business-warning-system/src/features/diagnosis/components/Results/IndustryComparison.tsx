import { Lightbulb } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";

interface BenchmarkMetrics {
  revenue: { average: number };
  customers: { average: number };
}

interface IndustryComparisonProps {
  myRiskScore: number;
  averageRiskScore: number;
  revenueRatio?: number;
  benchmarkMetrics: BenchmarkMetrics;
}

export function IndustryComparison({
  myRiskScore,
  averageRiskScore,
  revenueRatio,
  benchmarkMetrics,
}: IndustryComparisonProps) {
  return (
    <div className="mb-10">
      <h2 className="text-3xl font-bold mb-8">업종 평균과 비교</h2>
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>내 가게 vs 업종 평균</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            {/* 안전점수 비교 */}
            <div>
              <h3 className="font-semibold text-lg mb-4 text-center">안전점수</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart
                  data={[
                    { name: "내 가게", value: myRiskScore, type: "mine" },
                    { name: "업종 평균", value: averageRiskScore, type: "average" },
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
                    formatter={(value: number) => [`${value.toFixed(1)}점`, "안전점수"]}
                  />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                    {[
                      { name: "내 가게", value: myRiskScore, type: "mine" },
                      { name: "업종 평균", value: averageRiskScore, type: "average" },
                    ].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.type === "mine" ? "#3b82f6" : "#94a3b8"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <p className="text-center text-sm text-muted-foreground mt-2">
                {myRiskScore > averageRiskScore ? (
                  <span className="text-green-600 font-semibold">
                    업종 평균보다 {(myRiskScore - averageRiskScore).toFixed(1)}점 높음 (더 안전)
                  </span>
                ) : (
                  <span className="text-orange-600 font-semibold">
                    업종 평균보다 {(averageRiskScore - myRiskScore).toFixed(1)}점 낮음 (주의 필요)
                  </span>
                )}
              </p>
            </div>

            {/* 매출 비교 */}
            <div>
              <h3 className="font-semibold text-lg mb-4 text-center">월 평균 매출</h3>
              {revenueRatio && benchmarkMetrics ? (
                <>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart
                      data={[
                        {
                          name: "내 가게",
                          value: benchmarkMetrics.revenue.average * (revenueRatio / 100),
                          type: "mine",
                        },
                        {
                          name: "업종 평균",
                          value: benchmarkMetrics.revenue.average,
                          type: "average",
                        },
                      ]}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="name" tick={{ fill: "#6b7280", fontSize: 12 }} />
                      <YAxis
                        tick={{ fill: "#6b7280", fontSize: 12 }}
                        tickFormatter={(value: number) => `₩${(value / 1000000).toFixed(0)}M`}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "white",
                          border: "1px solid #e5e7eb",
                          borderRadius: "8px",
                        }}
                        formatter={(value: number) => [`₩${value.toLocaleString()}`, "매출액"]}
                      />
                      <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                        {[
                          {
                            name: "내 가게",
                            value: benchmarkMetrics.revenue.average * (revenueRatio / 100),
                            type: "mine",
                          },
                          {
                            name: "업종 평균",
                            value: benchmarkMetrics.revenue.average,
                            type: "average",
                          },
                        ].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.type === "mine" ? "#3b82f6" : "#94a3b8"} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                  <p className="text-center text-sm text-muted-foreground mt-2">
                    {revenueRatio > 100 ? (
                      <span className="text-green-600 font-semibold">
                        업종 평균보다 {(revenueRatio - 100).toFixed(1)}% 높음
                      </span>
                    ) : (
                      <span className="text-orange-600 font-semibold">
                        업종 평균보다 {(100 - revenueRatio).toFixed(1)}% 낮음
                      </span>
                    )}
                  </p>
                </>
              ) : (
                <div className="text-center py-8">
                  <div className="space-y-4">
                    <div className="bg-blue-50 rounded-lg p-4">
                      <p className="text-sm text-muted-foreground mb-1">업종 평균</p>
                      <p className="text-2xl font-bold text-blue-600">
                        ₩{benchmarkMetrics?.revenue.average.toLocaleString()}
                      </p>
                    </div>
                    <p className="text-sm text-muted-foreground">내 가게의 매출 데이터가 없습니다.</p>
                  </div>
                </div>
              )}
            </div>

            {/* 고객 수 비교 */}
            <div>
              <h3 className="font-semibold text-lg mb-4 text-center">월 평균 고객 수</h3>
              <div className="text-center py-8">
                <div className="space-y-4">
                  <div className="bg-purple-50 rounded-lg p-4">
                    <p className="text-sm text-muted-foreground mb-1">업종 평균</p>
                    <p className="text-2xl font-bold text-purple-600">
                      {benchmarkMetrics.customers.average.toLocaleString()}명
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground">꾸준한 고객 유지가 사업 안정성의 핵심입니다.</p>
                </div>
              </div>
            </div>
          </div>

          {/* 인사이트 */}
          <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
            <div className="flex items-start gap-3">
              <Lightbulb className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-blue-600" />
                  업종 비교 인사이트
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {myRiskScore > averageRiskScore ? (
                    <>
                      현재 위험도가 업종 평균보다 높습니다. <strong>매출 안정화</strong>와 <strong>고객 유지</strong>{" "}
                      전략에 집중하여 위험도를 낮춰보세요. 아래 맞춤 개선 제안을 참고하세요.
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
  );
}

