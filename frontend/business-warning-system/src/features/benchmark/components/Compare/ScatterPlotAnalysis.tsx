import { BarChart3, Lightbulb, MapPin, Star } from "lucide-react";
import { CartesianGrid, ResponsiveContainer, Scatter, ScatterChart, Tooltip, XAxis, YAxis, ZAxis } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";

interface ScatterPoint {
  가게명: string;
  가게코드: string;
  매출백분위: number;
  위험도: number;
  고객백분위: number;
}

interface ScatterDataRaw {
  totalCount: number;
  avgRevenue: number;
  avgCustomers: number;
  avgRisk: number;
  points: ScatterPoint[];
}

interface ScatterPlotAnalysisProps {
  scatterData: ScatterPoint[];
  scatterDataRaw: ScatterDataRaw | null;
  isLoading: boolean;
  industryLabel: string;
}

// 산점도 커스텀 Tooltip
const ScatterTooltip = ({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{
    payload: ScatterPoint;
  }>;
}) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;

    const getLevel = (percentile: number) => {
      if (percentile < 10) return "최상위권";
      if (percentile < 25) return "상위권";
      if (percentile < 50) return "중상위권";
      if (percentile < 75) return "중하위권";
      return "하위권";
    };

    return (
      <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-bold text-lg mb-1">{data.가게명}</p>
        <p className="text-xs text-muted-foreground mb-3">ID: {data.가게코드}</p>
        <div className="space-y-1">
          <p className="text-sm">
            매출: <span className="font-semibold text-blue-600">{getLevel(data.매출백분위)}</span>
            <span className="text-xs text-muted-foreground ml-1">(상위 {data.매출백분위}%)</span>
          </p>
          <p className="text-sm">위험도: {data.위험도.toFixed(1)}%</p>
          <p className="text-sm">
            고객 수: <span className="font-semibold">{getLevel(data.고객백분위)}</span>
            <span className="text-xs text-muted-foreground ml-1">(상위 {data.고객백분위}%)</span>
          </p>
        </div>
        <p className="text-xs text-muted-foreground mt-2 pt-2 border-t">
          * 백분위가 낮을수록 해당 업종 내 상위권입니다
        </p>
      </div>
    );
  }
  return null;
};

export function ScatterPlotAnalysis({
  scatterData,
  scatterDataRaw,
  isLoading,
  industryLabel,
}: ScatterPlotAnalysisProps) {
  console.log(scatterData.map((item) => item.위험도));
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="h-5 w-5 text-yellow-500" />
          <span>산점도 - 매출과 위험도 관계 분석</span>
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-2">
          선택한 업종의 <strong>개별 가게들</strong>의 매출과 위험도 분포를 확인하세요. 총{" "}
          <strong className="text-blue-600">{scatterDataRaw?.totalCount || 0}개</strong> 가게 중{" "}
          <strong className="text-blue-600">{scatterData.length}개</strong> 표시 중
        </p>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center h-[500px]">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">데이터 로딩 중...</p>
            </div>
          </div>
        ) : scatterData.length === 0 ? (
          <div className="flex justify-center items-center h-[500px]">
            <p className="text-muted-foreground">해당 업종의 데이터가 없습니다.</p>
          </div>
        ) : (
          <>
            <ResponsiveContainer width="100%" height={500}>
              <ScatterChart margin={{ top: 20, right: 30, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  type="number"
                  dataKey="매출백분위"
                  name="매출 수준"
                  domain={[0, 100]}
                  label={{ value: "매출 백분위 (낮을수록 업종 내 상위)", position: "bottom", offset: 0 }}
                  tickFormatter={(value) => `${value}%`}
                />
                <YAxis
                  type="number"
                  dataKey="위험도"
                  name="위험도"
                  unit="%"
                  label={{ value: "위험도 (%)", angle: -90, position: "insideLeft" }}
                />
                <ZAxis type="number" dataKey="고객백분위" range={[50, 500]} name="고객 수준" />
                <Tooltip content={<ScatterTooltip />} cursor={{ strokeDasharray: "3 3" }} />

                {/* 평균선 추가 */}
                {scatterDataRaw && (
                  <>
                    {/* 세로 평균선: 평균 매출 백분위 */}
                    <line
                      x1={Math.round(scatterDataRaw.avgRevenue)}
                      y1="0%"
                      x2={Math.round(scatterDataRaw.avgRevenue)}
                      y2="100%"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                    />
                    {/* 가로 평균선: 평균 위험도 */}
                    <line
                      x1="0%"
                      y1={scatterDataRaw.avgRisk}
                      x2="100%"
                      y2={scatterDataRaw.avgRisk}
                      stroke="#ef4444"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                    />
                  </>
                )}

                <Scatter name={`${industryLabel} 가게들`} data={scatterData} fill="#3b82f6" fillOpacity={0.6} />
              </ScatterChart>
            </ResponsiveContainer>

            {/* 통계 정보 */}
            {scatterDataRaw && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-blue-600" />
                  업종 통계
                </h4>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">평균 매출 수준:</span>
                    <p className="font-semibold text-lg text-blue-600">상위 {Math.round(scatterDataRaw.avgRevenue)}%</p>
                    <p className="text-xs text-muted-foreground">
                      {Math.round(scatterDataRaw.avgRevenue) < 25
                        ? "상위권"
                        : Math.round(scatterDataRaw.avgRevenue) < 50
                        ? "중상위권"
                        : Math.round(scatterDataRaw.avgRevenue) < 75
                        ? "중하위권"
                        : "하위권"}
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">평균 고객 수준:</span>
                    <p className="font-semibold text-lg text-purple-600">
                      상위 {Math.round(scatterDataRaw.avgCustomers)}%
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">평균 위험도:</span>
                    <p className="font-semibold text-lg text-red-600">{scatterDataRaw.avgRisk.toFixed(1)}%</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-3 pt-3 border-t">
                  💡 백분위는 업종 내 순위를 나타냅니다. 0%에 가까울수록 상위권(높은 매출), 100%에 가까울수록
                  하위권입니다.
                </p>
              </div>
            )}
          </>
        )}

        {/* 산점도 해석 가이드 */}
        <div className="mt-6 grid md:grid-cols-2 gap-4">
          {/* 좌측: 사분면 설명 */}
          <div className="p-5 bg-linear-to-br from-green-50 to-blue-50 rounded-lg border border-green-200">
            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-green-600" />
              <span>최적 구간 (상위 매출 + 저위험)</span>
            </h3>
            <p className="text-sm text-muted-foreground mb-3">
              왼쪽 아래 영역에 위치한 가게가 가장 이상적입니다. 업종 내 상위권 매출과 낮은 위험도를 동시에 달성했습니다.
            </p>
            <div className="space-y-2 text-sm">
              <p className="font-semibold text-green-600">
                ✓{" "}
                {
                  scatterData.filter(
                    (d) =>
                      d.매출백분위 < 50 && // 상위 50%
                      d.위험도 < (scatterDataRaw?.avgRisk || 50)
                  ).length
                }
                개 가게
              </p>
              <p className="text-xs text-muted-foreground">(상위 50% 매출 & 평균 이하 위험도)</p>
            </div>
          </div>

          {/* 우측: 주의 구간 */}
          <div className="p-5 bg-linear-to-br from-red-50 to-orange-50 rounded-lg border border-red-200">
            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
              <span>⚠️</span>
              <span>주의 구간 (하위 매출 + 고위험)</span>
            </h3>
            <p className="text-sm text-muted-foreground mb-3">
              오른쪽 위 영역에 위치한 가게는 매출이 낮고 위험도가 높습니다. 특별한 관리와 개선이 필요합니다.
            </p>
            <div className="space-y-2 text-sm">
              <p className="font-semibold text-red-600">
                !{" "}
                {
                  scatterData.filter(
                    (d) =>
                      d.매출백분위 > 50 && // 하위 50%
                      d.위험도 > (scatterDataRaw?.avgRisk || 50)
                  ).length
                }
                개 가게
              </p>
              <p className="text-xs text-muted-foreground">(하위 50% 매출 & 평균 이상 위험도)</p>
            </div>
          </div>
        </div>

        {/* 종합 분석 */}
        <div className="mt-6 p-6 bg-linear-to-r from-indigo-50 to-purple-50 rounded-lg">
          <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-purple-600" />
            <span>산점도 분석 인사이트</span>
          </h3>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p className="flex items-start gap-2">
              <span className="text-indigo-600 font-bold">•</span>
              <span>
                <span className="font-semibold text-foreground">X축 (매출 백분위):</span>
                왼쪽으로 갈수록 업종 내 상위권 매출입니다. 0%는 최상위, 100%는 최하위를 의미합니다.
              </span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-indigo-600 font-bold">•</span>
              <span>
                <span className="font-semibold text-foreground">Y축 (위험도):</span>
                위로 갈수록 폐업 위험도가 높습니다.
              </span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-indigo-600 font-bold">•</span>
              <span>
                <span className="font-semibold text-foreground">버블 크기:</span>
                고객 수 수준을 나타냅니다. 큰 버블일수록 업종 내 상위권 고객 수입니다.
              </span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-indigo-600 font-bold">•</span>
              <span>
                <span className="font-semibold text-foreground">창업 추천:</span>
                왼쪽 아래 영역(상위 매출 + 저위험)이 상대적으로 안정적이고 수익성이 높습니다.
              </span>
            </p>
            <p className="mt-4 text-xs">
              * 데이터는 성동구 최근 6개월 실제 데이터 기반 업종 내 상대적 순위입니다. 개별 매장의 성과는 위치, 운영
              방식에 따라 다를 수 있습니다.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
