import { AlertTriangle, Building, DollarSign, TrendingDown, TrendingUp, Users } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";

interface BenchmarkInfoProps {
  industryLabel: string;
  totalBusinesses: number;
  avgRevenue: number;
  avgCustomers: number;
  avgRiskScore: number;
  closedLastMonth: number;
}

export function BenchmarkInfo({
  industryLabel,
  totalBusinesses,
  avgRevenue,
  avgCustomers,
  avgRiskScore,
  closedLastMonth,
}: BenchmarkInfoProps) {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building className="h-5 w-5 text-blue-600" />
          <span>{industryLabel} 업종 벤치마크 정보</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* 총 사업체 수 */}
          <div className="p-4 bg-blue-50 rounded-lg text-center">
            <Building className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground mb-1">총 사업체 수</p>
            <p className="text-2xl font-bold text-blue-600">{totalBusinesses.toLocaleString()}개</p>
          </div>

          {/* 평균 매출 */}
          <div className="p-4 bg-green-50 rounded-lg text-center">
            <DollarSign className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground mb-1">월평균 매출</p>
            <p className="text-2xl font-bold text-green-600">₩{(avgRevenue / 10000).toFixed(0)}만</p>
          </div>

          {/* 평균 고객 수 */}
          <div className="p-4 bg-purple-50 rounded-lg text-center">
            <Users className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground mb-1">월평균 고객수</p>
            <p className="text-2xl font-bold text-purple-600">{avgCustomers.toLocaleString()}명</p>
          </div>

          {/* 평균 위험도 */}
          <div className="p-4 bg-red-50 rounded-lg text-center">
            <AlertTriangle className="h-8 w-8 text-red-600 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground mb-1">평균 위험도</p>
            <p className="text-2xl font-bold text-red-600">{avgRiskScore.toFixed(1)}%</p>
          </div>
        </div>

        {/* 추가 통계 */}
        <div className="mt-6 p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <TrendingDown className="h-8 w-8 text-red-600" />
              <div>
                <p className="text-sm text-muted-foreground">지난달 폐업 수</p>
                <p className="text-2xl font-bold text-red-600">{closedLastMonth.toLocaleString()}개</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">폐업률</p>
                <p className="text-2xl font-bold text-blue-600">
                  {((closedLastMonth / totalBusinesses) * 100).toFixed(2)}%
                </p>
              </div>
            </div>
          </div>

          <p className="mt-4 text-xs text-muted-foreground">
            * 폐업 데이터는 최근 1개월 기준이며, 계절적 요인과 경기 상황에 따라 변동될 수 있습니다.
          </p>
        </div>

        {/* 인사이트 */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-semibold mb-2 text-blue-900">💡 업종 특성 인사이트</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>
              • 평균 고객 단가: <span className="font-semibold">₩{Math.round(avgRevenue / avgCustomers).toLocaleString()}원</span>
            </li>
            <li>
              • 운영 난이도:{" "}
              {avgRiskScore > 60 ? (
                <span className="font-semibold text-red-600">높음 (주의 필요)</span>
              ) : avgRiskScore > 40 ? (
                <span className="font-semibold text-orange-600">중간 (보통)</span>
              ) : (
                <span className="font-semibold text-green-600">낮음 (안정적)</span>
              )}
            </li>
            <li>
              • 시장 경쟁도:{" "}
              {totalBusinesses > 1000 ? (
                <span className="font-semibold text-red-600">매우 높음 (레드오션)</span>
              ) : totalBusinesses > 500 ? (
                <span className="font-semibold text-orange-600">높음</span>
              ) : (
                <span className="font-semibold text-green-600">보통</span>
              )}
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

