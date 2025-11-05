import { useMemo } from "react";

import { useScatterData } from "../api/benchmarkApi";

interface ScatterPoint {
  가게명: string;
  가게코드: string;
  매출백분위: number;
  위험도: number;
  고객백분위: number;
}

interface ProcessedScatterData {
  scatterData: ScatterPoint[];
  scatterDataRaw: {
    totalCount: number;
    avgRevenue: number;
    avgCustomers: number;
    avgRisk: number;
    points: ScatterPoint[];
  } | null;
  isLoading: boolean;
}

export function useScatterPlot(industryCode: string, limit: number = 500): ProcessedScatterData {
  const { data: rawData, isLoading } = useScatterData(industryCode, limit);

  const processedData = useMemo(() => {
    if (!rawData || !rawData.points || rawData.points.length === 0) {
      return {
        scatterData: [],
        scatterDataRaw: null,
      };
    }

    // 산점도 데이터 변환
    const scatterData: ScatterPoint[] = rawData.points.map((point) => ({
      가게명: point.business_name || "이름 없음",
      가게코드: point.business_id,
      매출백분위: Math.round(point.revenue_percentile * 100),
      위험도: Math.round(point.risk_score),
      고객백분위: Math.round(point.customer_percentile * 100),
    }));

    // 평균값 계산
    const avgRevenue =
      scatterData.reduce((sum, d) => sum + d.매출백분위, 0) / (scatterData.length || 1);
    const avgCustomers =
      scatterData.reduce((sum, d) => sum + d.고객백분위, 0) / (scatterData.length || 1);
    const avgRisk = scatterData.reduce((sum, d) => sum + d.위험도, 0) / (scatterData.length || 1);

    return {
      scatterData,
      scatterDataRaw: {
        totalCount: rawData.total_count || scatterData.length,
        avgRevenue: Math.round(avgRevenue),
        avgCustomers: Math.round(avgCustomers),
        avgRisk: Math.round(avgRisk * 10) / 10,
        points: scatterData,
      },
    };
  }, [rawData]);

  return {
    ...processedData,
    isLoading,
  };
}

