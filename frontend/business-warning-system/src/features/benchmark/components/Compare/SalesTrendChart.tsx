import { DollarSign, Lightbulb, Star, TrendingUp } from "lucide-react";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";

interface TrendData {
  월: string;
  내가게_매출: number;
  업종평균_매출: number;
  내가게_고객: number;
  업종평균_고객: number;
}

interface SalesTrendChartProps {
  trendData: TrendData[];
}

export function SalesTrendChart({ trendData }: SalesTrendChartProps) {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="h-5 w-5 text-yellow-500" />
          <span>매출/고객 트렌드 비교</span>
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-2">내 가게와 업종 평균의 월별 추이를 비교해보세요</p>
      </CardHeader>
      <CardContent>
        {/* 매출 트렌드 */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-green-600" />
            월별 매출 추이 비교
          </h3>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={trendData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="월" />
              <YAxis label={{ value: "매출 (만원)", angle: -90, position: "insideLeft" }} />
              <Tooltip
                formatter={(value: number) => `${value.toLocaleString()}만원`}
                contentStyle={{ backgroundColor: "white", border: "1px solid #ccc", borderRadius: "8px" }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="내가게_매출"
                stroke="#3b82f6"
                strokeWidth={3}
                name="내 가게 매출"
                dot={{ r: 5 }}
                activeDot={{ r: 7 }}
              />
              <Line
                type="monotone"
                dataKey="업종평균_매출"
                stroke="#94a3b8"
                strokeWidth={2}
                strokeDasharray="5 5"
                name="업종 평균 매출"
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>

          {/* 매출 트렌드 인사이트 */}
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-start gap-3">
              <TrendingUp className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
              <div>
                <h4 className="font-semibold text-sm mb-1 text-blue-900">매출 트렌드 분석</h4>
                <p className="text-sm text-blue-800">
                  최근 2개월간 내 가게의 매출이 업종 평균을 상회하며 성장세를 보이고 있습니다. 6월과 7월에는 업종 평균 대비
                  각각 5%, 8% 높은 매출을 기록했습니다.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 고객 수 트렌드 */}
        <div>
          <h3 className="text-lg font-semibold mb-4">👥 월별 고객 수 추이 비교</h3>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={trendData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="월" />
              <YAxis label={{ value: "고객 수 (명)", angle: -90, position: "insideLeft" }} />
              <Tooltip
                formatter={(value: number) => `${value.toLocaleString()}명`}
                contentStyle={{ backgroundColor: "white", border: "1px solid #ccc", borderRadius: "8px" }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="내가게_고객"
                stroke="#8b5cf6"
                strokeWidth={3}
                name="내 가게 고객"
                dot={{ r: 5 }}
                activeDot={{ r: 7 }}
              />
              <Line
                type="monotone"
                dataKey="업종평균_고객"
                stroke="#94a3b8"
                strokeWidth={2}
                strokeDasharray="5 5"
                name="업종 평균 고객"
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>

          {/* 고객 수 트렌드 인사이트 */}
          <div className="mt-4 p-4 bg-purple-50 rounded-lg">
            <div className="flex items-start gap-3">
              <TrendingUp className="h-5 w-5 text-purple-600 mt-0.5 shrink-0" />
              <div>
                <h4 className="font-semibold text-sm mb-1 text-purple-900">고객 수 트렌드 분석</h4>
                <p className="text-sm text-purple-800">
                  1-2월 비수기를 거쳐 3월부터 꾸준한 회복세를 보이고 있습니다. 7월 현재 고객 수는 업종 평균 대비 8% 높은
                  수준으로, 고객 유치 전략이 효과적으로 작동하고 있습니다.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 종합 인사이트 */}
        <div className="mt-8 p-6 bg-linear-to-r from-green-50 to-blue-50 rounded-lg">
          <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-yellow-600" />
            <span>종합 트렌드 인사이트</span>
          </h3>
          <div className="space-y-2 text-sm">
            <p className="flex items-start gap-2">
              <span className="text-green-600 font-bold">✓</span>
              <span>
                <span className="font-semibold text-foreground">성장 추세:</span> 매출과 고객 수 모두 업종 평균을 상회하며 상승
                곡선을 그리고 있습니다.
              </span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-green-600 font-bold">✓</span>
              <span>
                <span className="font-semibold text-foreground">계절성 대응:</span> 1-2월 비수기에도 업종 평균과 유사한 하락폭을
                보여 안정적인 운영을 하고 있습니다.
              </span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">→</span>
              <span>
                <span className="font-semibold text-foreground">권장사항:</span> 현재의 성장세를 유지하되, 재방문율을 높이는
                로열티 프로그램 도입을 고려해보세요.
              </span>
            </p>
            <p className="mt-4 text-xs text-muted-foreground">
              * 내 가게 데이터는 시뮬레이션 데이터입니다. 실제 데이터 연동을 위해서는 진단 페이지에서 정보를
              입력해주세요.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

