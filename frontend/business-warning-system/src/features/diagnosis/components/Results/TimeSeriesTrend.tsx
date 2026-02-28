import { AlertTriangle, PartyPopper, TrendingUp } from "lucide-react";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";

interface DiagnosisRecord {
  taYm?: string | null;
  overallScore: number;
  components: {
    sales: { score: number };
    customer: { score: number };
    market: { score: number };
  };
}

interface TimeSeriesTrendProps {
  diagnoses: DiagnosisRecord[];
}

export function TimeSeriesTrend({ diagnoses }: TimeSeriesTrendProps) {
  if (!diagnoses || diagnoses.length <= 1) {
    return null;
  }

  const chartData = diagnoses
    .slice()
    .reverse()
    .map((d) => ({
      month: d.taYm ? d.taYm.substring(0, 7) : "",
      overall: d.overallScore,
      sales: d.components.sales.score,
      customer: d.components.customer.score,
      market: d.components.market.score,
    }));

  const firstScore = diagnoses[diagnoses.length - 1].overallScore;
  const lastScore = diagnoses[0].overallScore;
  const trend = lastScore - firstScore;

  const trendMessage =
    trend > 5 ? (
      <span className="flex items-center gap-1">
        위험도가 지속적으로 개선되고 있습니다! 현재의 전략을 유지하세요.
        <PartyPopper className="h-4 w-4 text-green-600 inline" />
      </span>
    ) : trend > 0 ? (
      "위험도가 소폭 개선되고 있습니다. 꾸준히 관리하면 더 나아질 것입니다."
    ) : trend > -5 ? (
      "위험도가 소폭 악화되고 있습니다. 개선 방안을 검토해보세요."
    ) : (
      <span className="flex items-center gap-1">
        위험도가 크게 악화되고 있습니다. 즉시 개선 조치가 필요합니다.
        <AlertTriangle className="h-4 w-4 text-orange-600 inline" />
      </span>
    );

  return (
    <div className="mb-10">
      <h2 className="text-3xl font-bold mb-8">월별 위험도 추세</h2>
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>시간에 따른 위험도 변화</CardTitle>
          <p className="text-sm text-muted-foreground mt-2">최근 {diagnoses.length}개월간의 위험도 추세를 확인하세요</p>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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
                <p className="text-sm text-purple-800">{trendMessage}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
