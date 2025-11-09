import { useMemo } from "react";

import { getIndustryLabel, getMainCategoryForSub } from "@/features/benchmark/utils/industryConfig";
import { useStatistics } from "@/features/statistics/api/statisticsApi";

import { useBenchmark } from "../api/benchmarkApi";

const INDUSTRY_STATISTICS_ALIAS: Record<string, string[]> = {
  restaurant: ["음식점", "외식", "restaurant"],
  cafe: ["카페", "베이커리", "coffee", "cafe"],
  fastfood: ["패스트푸드", "치킨", "fastfood"],
  pub: ["주점", "술집", "pub", "bar"],
  retail: ["소매", "소매업", "도소매", "식자재", "편의점", "retail"],
  other: ["기타", "other"],
};

const normalizeText = (input?: string | null) =>
  (input || "")
    .replace(/\(.*?\)/g, "")
    .replace(/[^0-9A-Za-z가-힣]/g, "")
    .toLowerCase();

interface TrendData {
  월: string;
  내가게_매출: number;
  업종평균_매출: number;
  내가게_고객: number;
  업종평균_고객: number;
}

interface RadarData {
  지표: string;
  음식점: number;
  카페: number;
  패스트푸드: number;
  주점: number;
  소매: number;
}

export function useCompareData(industryCode: string, fallbackIndustryCode?: string) {
  // 모든 대분류 업종의 벤치마크 데이터 가져오기
  const { data: restaurantData } = useBenchmark("restaurant", undefined);
  const { data: cafeData } = useBenchmark("cafe", undefined);
  const { data: fastfoodData } = useBenchmark("fastfood", undefined);
  const { data: pubData } = useBenchmark("pub", undefined);
  const { data: retailData } = useBenchmark("retail", undefined);

  // 현재 선택된 업종의 데이터
  const { data: currentIndustryData, isLoading } = useBenchmark(industryCode, undefined);
  const { data: statisticsData } = useStatistics();

  const mainCategoryCode = getMainCategoryForSub(industryCode) ?? industryCode;
  const candidateCodes = Array.from(
    new Set(
      [industryCode, mainCategoryCode, fallbackIndustryCode].filter(
        (value): value is string => Boolean(value)
      )
    )
  );

  const candidateStrings = candidateCodes.flatMap((code) => [
    code,
    getIndustryLabel(code),
    ...(INDUSTRY_STATISTICS_ALIAS[code] ?? []),
  ]);

  const normalizedCandidates = new Set(candidateStrings.map((value) => normalizeText(value)));

  const industryStats = statisticsData?.byIndustry?.find((item) =>
    normalizedCandidates.has(normalizeText(item.industry))
  );

  const totalBusinesses = industryStats?.count ?? 0;
  const closureRateRaw = industryStats?.closureRate;
  const closureRate =
    typeof closureRateRaw === "number"
      ? closureRateRaw > 1
        ? closureRateRaw
        : closureRateRaw * 100
      : null;
  const closedLastMonth =
    totalBusinesses > 0 && typeof closureRate === "number"
      ? Math.round((totalBusinesses * closureRate) / 100)
      : null;

  // 트렌드 데이터 생성 (시뮬레이션)
  const trendData = useMemo((): TrendData[] => {
    if (!currentIndustryData) return [];

    const baseRevenue = currentIndustryData.metrics?.revenue?.average || 30000;
    const baseCustomers = currentIndustryData.metrics?.customers?.average || 3000;

    return [
      {
        월: "1월",
        내가게_매출: Math.round(baseRevenue * 0.8),
        업종평균_매출: Math.round(baseRevenue * 0.85),
        내가게_고객: Math.round(baseCustomers * 0.75),
        업종평균_고객: Math.round(baseCustomers * 0.8),
      },
      {
        월: "2월",
        내가게_매출: Math.round(baseRevenue * 0.85),
        업종평균_매출: Math.round(baseRevenue * 0.88),
        내가게_고객: Math.round(baseCustomers * 0.8),
        업종평균_고객: Math.round(baseCustomers * 0.83),
      },
      {
        월: "3월",
        내가게_매출: Math.round(baseRevenue * 0.95),
        업종평균_매출: Math.round(baseRevenue * 0.92),
        내가게_고객: Math.round(baseCustomers * 0.9),
        업종평균_고객: Math.round(baseCustomers * 0.88),
      },
      {
        월: "4월",
        내가게_매출: Math.round(baseRevenue * 0.98),
        업종평균_매출: Math.round(baseRevenue * 0.95),
        내가게_고객: Math.round(baseCustomers * 0.95),
        업종평균_고객: Math.round(baseCustomers * 0.92),
      },
      {
        월: "5월",
        내가게_매출: Math.round(baseRevenue * 1.02),
        업종평균_매출: Math.round(baseRevenue * 0.98),
        내가게_고객: Math.round(baseCustomers * 1.0),
        업종평균_고객: Math.round(baseCustomers * 0.96),
      },
      {
        월: "6월",
        내가게_매출: Math.round(baseRevenue * 1.05),
        업종평균_매출: Math.round(baseRevenue * 1.0),
        내가게_고객: Math.round(baseCustomers * 1.05),
        업종평균_고객: Math.round(baseCustomers * 1.0),
      },
      {
        월: "7월",
        내가게_매출: Math.round(baseRevenue * 1.08),
        업종평균_매출: Math.round(baseRevenue * 1.0),
        내가게_고객: Math.round(baseCustomers * 1.08),
        업종평균_고객: Math.round(baseCustomers * 1.0),
      },
    ];
  }, [currentIndustryData]);

  const normalize = (values: number[]) => {
    const min = Math.min(...values);
    const max = Math.max(...values);
    const avg = values.reduce((acc, v) => acc + v, 0) / values.length;
    if (max === min) return values.map(() => 50); // 모두 같으면 중간값
    return values.map((v) => Math.round(((v - avg) / (max - min)) * 50 + 50));
  };


  // 레이더 차트 데이터 생성
  const getRadarChartData = (): RadarData[] => {
    // 정규화 함수: 주어진 배열에서 최소-최대 범위를 0-100으로 변환

    // 각 지표별 원본 값 수집
    const revenueValues = [
      restaurantData?.metrics?.revenue?.average || 0,
      cafeData?.metrics?.revenue?.average || 0,
      fastfoodData?.metrics?.revenue?.average || 0,
      pubData?.metrics?.revenue?.average || 0,
      retailData?.metrics?.revenue?.average || 0,
    ];

    const safetyValues = [
      restaurantData?.averageRiskScore || 0,
      cafeData?.averageRiskScore || 0,
      fastfoodData?.averageRiskScore || 0,
      pubData?.averageRiskScore || 0,
      retailData?.averageRiskScore || 0,
    ];

    const customerValues = [
      restaurantData?.metrics?.customers?.average || 0,
      cafeData?.metrics?.customers?.average || 0,
      fastfoodData?.metrics?.customers?.average || 0,
      pubData?.metrics?.customers?.average || 0,
      retailData?.metrics?.customers?.average || 0,
    ];

    const expensesValues = [
      restaurantData?.metrics?.expenses?.average || 0,
      cafeData?.metrics?.expenses?.average || 0,
      fastfoodData?.metrics?.expenses?.average || 0,
      pubData?.metrics?.expenses?.average || 0,
      retailData?.metrics?.expenses?.average || 0,
    ];

    // 수익성 계산 (매출 - 비용) / 매출 * 100
    const profitabilityValues = revenueValues.map((rev, idx) => {
      const exp = expensesValues[idx];
      return rev > 0 ? ((rev - exp) / rev) * 100 : 0;
    });

    // 고객 단가 계산
    const customerSpendingValues = revenueValues.map((rev, idx) => {
      const cust = customerValues[idx];
      return cust > 0 ? rev / cust : 0;
    });

    // 정규화
    const normalizedRevenue = normalize(revenueValues);
    const normalizedSafety = normalize(safetyValues);
    const normalizedCustomers = normalize(customerValues);
    const normalizedProfitability = normalize(profitabilityValues);
    const normalizedSpending = normalize(customerSpendingValues);

    return [
      {
        지표: "매출",
        음식점: normalizedRevenue[0],
        카페: normalizedRevenue[1],
        패스트푸드: normalizedRevenue[2],
        주점: normalizedRevenue[3],
        소매: normalizedRevenue[4],
      },
      {
        지표: "안전도",
        음식점: normalizedSafety[0],
        카페: normalizedSafety[1],
        패스트푸드: normalizedSafety[2],
        주점: normalizedSafety[3],
        소매: normalizedSafety[4],
      },
      {
        지표: "고객수",
        음식점: normalizedCustomers[0],
        카페: normalizedCustomers[1],
        패스트푸드: normalizedCustomers[2],
        주점: normalizedCustomers[3],
        소매: normalizedCustomers[4],
      },
      {
        지표: "수익성",
        음식점: normalizedProfitability[0],
        카페: normalizedProfitability[1],
        패스트푸드: normalizedProfitability[2],
        주점: normalizedProfitability[3],
        소매: normalizedProfitability[4],
      },
      {
        지표: "고객단가",
        음식점: normalizedSpending[0],
        카페: normalizedSpending[1],
        패스트푸드: normalizedSpending[2],
        주점: normalizedSpending[3],
        소매: normalizedSpending[4],
      },
    ];
  }

  return {
    trendData,
    radarChartData: getRadarChartData(),
    currentIndustryData,
    isLoading,
    summary: {
      totalBusinesses,
      closureRate,
      closedLastMonth,
    },
    multiIndustryData: {
      restaurant: restaurantData,
      cafe: cafeData,
      fastfood: fastfoodData,
      pub: pubData,
      retail: retailData,
    },
  };
}

