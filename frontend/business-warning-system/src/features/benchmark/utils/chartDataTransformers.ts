/**
 * 차트 데이터 변환 유틸리티
 */

interface BenchmarkMetrics {
  revenue: { average: number };
  customers: { average: number };
  expenses: { average: number };
}

interface MultiIndustryChartData {
  name: string;
  안전점수: number;
  매출: number;
  고객수: number;
  비용: number;
}

/**
 * 다중 업종 비교 차트 데이터 생성
 */
export function createMultiIndustryChartData(
  restaurantData?: { averageRiskScore: number; metrics: BenchmarkMetrics },
  cafeData?: { averageRiskScore: number; metrics: BenchmarkMetrics },
  fastfoodData?: { averageRiskScore: number; metrics: BenchmarkMetrics },
  pubData?: { averageRiskScore: number; metrics: BenchmarkMetrics },
  retailData?: { averageRiskScore: number; metrics: BenchmarkMetrics }
): MultiIndustryChartData[] {
  return [
    {
      name: "음식점",
      안전점수: restaurantData?.averageRiskScore || 0,
      매출: Math.round((restaurantData?.metrics?.revenue?.average || 0) / 10000),
      고객수: restaurantData?.metrics?.customers?.average || 0,
      비용: Math.round((restaurantData?.metrics?.expenses?.average || 0) / 10000),
    },
    {
      name: "카페",
      안전점수: cafeData?.averageRiskScore || 0,
      매출: Math.round((cafeData?.metrics?.revenue?.average || 0) / 10000),
      고객수: cafeData?.metrics?.customers?.average || 0,
      비용: Math.round((cafeData?.metrics?.expenses?.average || 0) / 10000),
    },
    {
      name: "패스트푸드",
      안전점수: fastfoodData?.averageRiskScore || 0,
      매출: Math.round((fastfoodData?.metrics?.revenue?.average || 0) / 10000),
      고객수: fastfoodData?.metrics?.customers?.average || 0,
      비용: Math.round((fastfoodData?.metrics?.expenses?.average || 0) / 10000),
    },
    {
      name: "주점",
      안전점수: pubData?.averageRiskScore || 0,
      매출: Math.round((pubData?.metrics?.revenue?.average || 0) / 10000),
      고객수: pubData?.metrics?.customers?.average || 0,
      비용: Math.round((pubData?.metrics?.expenses?.average || 0) / 10000),
    },
    {
      name: "소매",
      안전점수: retailData?.averageRiskScore || 0,
      매출: Math.round((retailData?.metrics?.revenue?.average || 0) / 10000),
      고객수: retailData?.metrics?.customers?.average || 0,
      비용: Math.round((retailData?.metrics?.expenses?.average || 0) / 10000),
    },
  ];
}

/**
 * 숫자를 백분위 형식으로 변환 (0-100%)
 */
export function toPercentile(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value * 100)));
}

/**
 * 금액을 만원 단위로 변환
 */
export function toManWon(value: number): number {
  return Math.round(value / 10000);
}

/**
 * 백분위 값에 따른 레벨 문자열 반환
 */
export function getPercentileLevel(percentile: number): string {
  if (percentile < 10) return "최상위권";
  if (percentile < 25) return "상위권";
  if (percentile < 50) return "중상위권";
  if (percentile < 75) return "중하위권";
  return "하위권";
}

/**
 * 위험도 점수에 따른 색상 반환
 */
export function getRiskColor(riskScore: number): string {
  if (riskScore < 30) return "text-green-600";
  if (riskScore < 50) return "text-blue-600";
  if (riskScore < 70) return "text-orange-600";
  return "text-red-600";
}

/**
 * 위험도 점수에 따른 레벨 반환
 */
export function getRiskLevel(riskScore: number): string {
  if (riskScore < 30) return "매우 안전";
  if (riskScore < 50) return "안전";
  if (riskScore < 70) return "주의";
  return "위험";
}

