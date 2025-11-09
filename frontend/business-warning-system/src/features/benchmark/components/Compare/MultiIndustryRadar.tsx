import { BarChart3, Lightbulb, Star } from "lucide-react";
import { Legend, PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, Tooltip } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";

interface RadarData {
  지표: string;
  음식점: number;
  카페: number;
  패스트푸드: number;
  주점: number;
  소매: number;
}

interface MultiIndustryRadarProps {
  radarChartData: RadarData[];
}

export function MultiIndustryRadar({ radarChartData, multiIndustryData }: MultiIndustryRadarProps) {
  console.log(radarChartData);
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="h-5 w-5 text-yellow-500" />
          <span>업종별 종합 프로필 비교</span>
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-2">
          5개 업종의 매출, 안전도, 고객수, 수익성, 고객단가를 한눈에 비교해보세요
        </p>
      </CardHeader>
      <CardContent>
        {/* 레이더 차트 */}
        <div className="w-full h-[500px] flex items-center justify-center">
          <RadarChart width={600} height={500} data={radarChartData}>
            <PolarGrid stroke="#e5e7eb" />
            <PolarAngleAxis dataKey="지표" tick={{ fill: "#6b7280", fontSize: 14 }} />
            <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: "#9ca3af", fontSize: 12 }} />
            <Radar name="음식점" dataKey="음식점" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} strokeWidth={2} />
            <Radar name="카페" dataKey="카페" stroke="#10b981" fill="#10b981" fillOpacity={0.2} strokeWidth={2} />
            <Radar
              name="패스트푸드"
              dataKey="패스트푸드"
              stroke="#f59e0b"
              fill="#f59e0b"
              fillOpacity={0.2}
              strokeWidth={2}
            />
            <Radar name="주점" dataKey="주점" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.2} strokeWidth={2} />
            <Radar name="소매" dataKey="소매" stroke="#ef4444" fill="#ef4444" fillOpacity={0.2} strokeWidth={2} />
            <Legend wrapperStyle={{ paddingTop: "20px" }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                padding: "12px",
              }}
              formatter={(value: number) => [`${value}점`, ""]}
            />
          </RadarChart>
        </div>

        {/* 레이더 차트 해석 가이드 */}
        <div className="mt-6 grid md:grid-cols-2 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-blue-600" />
              차트 읽는 방법
            </h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• 바깥쪽으로 갈수록 해당 지표가 우수함</li>
              <li>• 면적이 클수록 종합적으로 뛰어난 업종</li>
              <li>• 각 축은 0-100점으로 정규화됨</li>
              <li>• 안전도는 높을수록 폐업 위험이 낮음</li>
            </ul>
          </div>

          <div className="p-4 bg-green-50 rounded-lg">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-green-600" />각 지표 설명
            </h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>
                • <span className="font-semibold">매출:</span> 월평균 매출액 (상대적 비교)
              </li>
              <li>
                • <span className="font-semibold">안전도:</span> 높을수록 폐업 위험 낮음
              </li>
              <li>
                • <span className="font-semibold">고객수:</span> 월평균 방문 고객 수
              </li>
              <li>
                • <span className="font-semibold">수익성:</span> (매출-비용)/매출 비율
              </li>
              <li>
                • <span className="font-semibold">고객단가:</span> 고객 1명당 평균 소비 금액
              </li>
            </ul>
          </div>
        </div>

        {/* 업종별 강점 분석 */}
        <div className="mt-6 p-6 bg-linear-to-r from-purple-50 to-blue-50 rounded-lg">
          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <Star className="h-5 w-5 text-purple-600" />
            <span>업종별 강점 분석</span>
          </h3>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="p-3 bg-white rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="font-semibold text-blue-900">음식점</span>
              </div>
              <p className="text-muted-foreground">
                {radarChartData[0].음식점 >= 80
                  ? "매출 최상위권"
                  : radarChartData[1].음식점 >= 80
                  ? "높은 안전도"
                  : radarChartData[2].음식점 >= 80
                  ? "고객 수 우수"
                  : "균형잡힌 운영"}
              </p>
            </div>

            <div className="p-3 bg-white rounded-lg border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="font-semibold text-green-900">카페</span>
              </div>
              <p className="text-muted-foreground">
                {radarChartData[4].카페 >= 80
                  ? "높은 고객단가"
                  : radarChartData[1].카페 >= 80
                  ? "안정적 운영"
                  : radarChartData[3].카페 >= 80
                  ? "높은 수익성"
                  : "안정적 업종"}
              </p>
            </div>

            <div className="p-3 bg-white rounded-lg border border-orange-200">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                <span className="font-semibold text-orange-900">패스트푸드</span>
              </div>
              <p className="text-muted-foreground">
                {radarChartData[2].패스트푸드 >= 80
                  ? "높은 고객 수"
                  : radarChartData[0].패스트푸드 >= 80
                  ? "강한 매출력"
                  : "대중적 선호"}
              </p>
            </div>

            <div className="p-3 bg-white rounded-lg border border-purple-200">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                <span className="font-semibold text-purple-900">주점</span>
              </div>
              <p className="text-muted-foreground">
                {radarChartData[3].주점 >= 80
                  ? "최고 수익성"
                  : radarChartData[0].주점 >= 80
                  ? "높은 매출"
                  : "틈새 시장"}
              </p>
            </div>

            <div className="p-3 bg-white rounded-lg border border-red-200">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="font-semibold text-red-900">소매</span>
              </div>
              <p className="text-muted-foreground">
                {radarChartData[1].소매 >= 80
                  ? "안정적 운영"
                  : radarChartData[4].소매 >= 80
                  ? "높은 고객단가"
                  : "꾸준한 수요"}
              </p>
            </div>

            <div className="p-3 bg-white rounded-lg border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="h-4 w-4 text-yellow-600" />
                <span className="font-semibold">추천</span>
              </div>
              <p className="text-muted-foreground text-xs">
                초보 창업자는 안전도가 높은 업종, 경험자는 수익성이 높은 업종을 선택하세요
              </p>
            </div>
          </div>
        </div>

        {/* 종합 인사이트 */}
        <div className="mt-6 p-6 bg-linear-to-r from-blue-50 to-purple-50 rounded-lg">
          <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-blue-600" />
            <span>종합 인사이트</span>
          </h3>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>
              • <span className="font-semibold text-foreground">가장 균형잡힌 업종:</span>{" "}
              {(() => {
                const industries = ["음식점", "카페", "패스트푸드", "주점", "소매"] as const;
                const scores = radarChartData.reduce((acc, curr) => {
                  industries.forEach((ind) => {
                    acc[ind] = (acc[ind] || 0) + (curr[ind] as number);
                  });
                  return acc;
                }, {} as Record<string, number>);
                const entries = Object.entries(scores);
                const maxScore = Math.max(...entries.map(([, score]) => score));
                return entries.find(([, score]) => score === maxScore)?.[0] || "음식점";
              })()}{" "}
              (모든 지표에서 고른 점수)
            </p>
            <p>
              • <span className="font-semibold text-foreground">최고 매출:</span>{" "}
              {
                Object.entries({
                  음식점: radarChartData[0].음식점,
                  카페: radarChartData[0].카페,
                  패스트푸드: radarChartData[0].패스트푸드,
                  주점: radarChartData[0].주점,
                  소매: radarChartData[0].소매,
                }).sort(([, a], [, b]) => (b as number) - (a as number))[0][0]
              }
            </p>
            <p>
              • <span className="font-semibold text-foreground">최고 안전도:</span>{" "}
              {
                Object.entries({
                  음식점: radarChartData[1].음식점,
                  카페: radarChartData[1].카페,
                  패스트푸드: radarChartData[1].패스트푸드,
                  주점: radarChartData[1].주점,
                  소매: radarChartData[1].소매,
                }).sort(([, a], [, b]) => (b as number) - (a as number))[0][0]
              }
            </p>
            <p className="mt-4 text-xs">
              * 데이터는 성동구 내 각 업종의 평균값을 기준으로 정규화되었습니다. 실제 매장의 성과는 위치, 규모, 운영
              방식에 따라 달라질 수 있습니다.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
