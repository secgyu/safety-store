import { useMemo } from "react";

import type { components } from "@/shared/types/api-generated";

import { useScatterData } from "../api/benchmarkApi";

type ApiScatterPoint = components["schemas"]["ScatterPoint"];

interface ScatterPoint {
  가게명: string;
  가게코드: string;
  매출백분위: number;
  위험도: number;
  고객백분위: number;
}

interface ProcessedScatterData {
  scatterData: ScatterPoint[];
  scatterDataRaw:
  | {
    totalCount: number;
    avgRevenue: number;
    avgCustomers: number;
    avgRisk: number;
    points: ScatterPoint[];
  }
  | null;
  isLoading: boolean;
}

export function useScatterPlot(industryCode: string, limit: number = 500): ProcessedScatterData {
  const { data: rawData, isLoading } = useScatterData(industryCode, limit);

  const processedData = useMemo(() => {
    if (!rawData?.points?.length) {
      return {
        scatterData: [],
        scatterDataRaw: null,
      };
    }

    const points = rawData.points as ApiScatterPoint[];

    const calculatePercentile = (value: number, min: number, max: number) => {
      if (!Number.isFinite(value)) return 0;
      if (max <= min) return 50;
      const ratio = (value - min) / (max - min);
      const percentile = (1 - ratio) * 100;
      return Math.max(0, Math.min(100, Math.round(percentile)));
    };

    const revenues = points.map((point) => point.revenue);
    const customers = points.map((point) => point.customers);

    const minRevenue = Math.min(...revenues);
    const maxRevenue = Math.max(...revenues);
    const minCustomers = Math.min(...customers);
    const maxCustomers = Math.max(...customers);

    const scatterData: ScatterPoint[] = points.map((point) => {
      const 매출백분위 = calculatePercentile(point.revenue, minRevenue, maxRevenue);
      const 고객백분위 = calculatePercentile(point.customers, minCustomers, maxCustomers);

      return {
        가게명: point.merchantName ?? "이름 없음",
        가게코드: point.merchantId,
        매출백분위,
        위험도: Math.round(point.riskScore),
        고객백분위,
      };
    });

    const avgRevenue =
      scatterData.reduce((sum, d) => sum + d.매출백분위, 0) / scatterData.length;
    const avgCustomers =
      scatterData.reduce((sum, d) => sum + d.고객백분위, 0) / scatterData.length;
    const avgRisk =
      scatterData.reduce((sum, d) => sum + d.위험도, 0) / scatterData.length;

    const scatterDataRaw = {
      totalCount: rawData.totalCount ?? scatterData.length,
      avgRevenue: Math.round(avgRevenue),
      avgCustomers: Math.round(avgCustomers),
      avgRisk: Math.round(avgRisk * 10) / 10,
      points: scatterData,
    };

    return {
      scatterData,
      scatterDataRaw,
    };
  }, [rawData]);

  return {
    ...processedData,
    isLoading,
  };
}

