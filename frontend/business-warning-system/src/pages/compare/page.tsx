import { TrendingDown, TrendingUp } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";

import { AppHeader } from "@/components/app-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useBenchmark, useScatterData } from "@/lib/api";

const industries = [
  { value: "restaurant", label: "음식점 (한식/양식/일식/중식 등)" },
  { value: "cafe", label: "카페/베이커리" },
  { value: "fastfood", label: "패스트푸드/치킨" },
  { value: "pub", label: "주점/술집" },
  { value: "retail", label: "식자재/편의점" },
  { value: "other", label: "기타" },
];

// 대분류별 세부 업종
const subIndustries: Record<string, Array<{ value: string; label: string }>> = {
  restaurant: [
    { value: "한식-육류/고기", label: "한식 - 육류/고기" },
    { value: "백반/가정식", label: "백반/가정식" },
    { value: "한식-단품요리일반", label: "한식 - 단품요리" },
    { value: "한식-해물/생선", label: "한식 - 해물/생선" },
    { value: "한식-국수/만두", label: "한식 - 국수/만두" },
    { value: "한식-국밥/설렁탕", label: "한식 - 국밥/설렁탕" },
    { value: "한식-찌개/전골", label: "한식 - 찌개/전골" },
    { value: "한식-냉면", label: "한식 - 냉면" },
    { value: "한식뷔페", label: "한식뷔페" },
    { value: "한식-감자탕", label: "한식 - 감자탕" },
    { value: "한식-죽", label: "한식 - 죽" },
    { value: "한정식", label: "한정식" },
    { value: "양식", label: "양식" },
    { value: "일식당", label: "일식당" },
    { value: "일식-덮밥/돈가스", label: "일식 - 덮밥/돈가스" },
    { value: "일식-우동/소바/라면", label: "일식 - 우동/소바/라면" },
    { value: "일식-초밥/롤", label: "일식 - 초밥/롤" },
    { value: "중식당", label: "중식당" },
    { value: "중식-훠궈/마라탕", label: "중식 - 훠궈/마라탕" },
    { value: "동남아/인도음식", label: "동남아/인도음식" },
    { value: "분식", label: "분식" },
    { value: "스테이크", label: "스테이크" },
  ],
  cafe: [
    { value: "카페", label: "카페" },
    { value: "커피전문점", label: "커피전문점" },
    { value: "베이커리", label: "베이커리" },
    { value: "아이스크림/빙수", label: "아이스크림/빙수" },
    { value: "도너츠", label: "도너츠" },
    { value: "마카롱", label: "마카롱" },
    { value: "테마카페", label: "테마카페" },
    { value: "와플/크로플", label: "와플/크로플" },
  ],
  fastfood: [
    { value: "치킨", label: "치킨" },
    { value: "피자", label: "피자" },
    { value: "햄버거", label: "햄버거" },
    { value: "샌드위치/토스트", label: "샌드위치/토스트" },
  ],
  pub: [
    { value: "호프/맥주", label: "호프/맥주" },
    { value: "요리주점", label: "요리주점" },
    { value: "일반 유흥주점", label: "일반 유흥주점" },
    { value: "이자카야", label: "이자카야" },
    { value: "와인바", label: "와인바" },
    { value: "포장마차", label: "포장마차" },
  ],
  retail: [
    { value: "축산물", label: "축산물" },
    { value: "식료품", label: "식료품" },
    { value: "농산물", label: "농산물" },
    { value: "청과물", label: "청과물" },
    { value: "수산물", label: "수산물" },
    { value: "주류", label: "주류" },
    { value: "반찬", label: "반찬" },
    { value: "떡/한과", label: "떡/한과" },
    { value: "건강식품", label: "건강식품" },
  ],
  other: [{ value: "식품 제조", label: "식품 제조" }],
};

export default function ComparePage() {
  const [selectedCategory, setSelectedCategory] = useState("restaurant");
  const [selectedSubIndustry, setSelectedSubIndustry] = useState<string>("__all__");

  // 실제 조회할 업종: 세부업종이 선택되면 그것을, 아니면 대분류 사용
  const actualIndustry = selectedSubIndustry === "__all__" ? selectedCategory : selectedSubIndustry;

  // API 호출 - 현재 선택된 업종의 벤치마크 데이터
  const { data: benchmarkData, isLoading: isBenchmarkLoading } = useBenchmark(actualIndustry, undefined);

  // 모든 대분류 업종의 벤치마크 데이터 가져오기 (다중 업종 비교용)
  const { data: restaurantData } = useBenchmark("restaurant", undefined);
  const { data: cafeData } = useBenchmark("cafe", undefined);
  const { data: fastfoodData } = useBenchmark("fastfood", undefined);
  const { data: pubData } = useBenchmark("pub", undefined);
  const { data: retailData } = useBenchmark("retail", undefined);
  const { data: _otherData } = useBenchmark("other", undefined);

  // 실제 산점도 데이터 가져오기 (선택한 업종의 모든 개별 가게)
  const { data: scatterDataRaw, isLoading: isScatterLoading } = useScatterData(actualIndustry, 500);

  // 다중 업종 비교 차트 데이터 준비
  const multiIndustryChartData = useMemo(() => {
    return [
      {
        name: "음식점",
        위험도: restaurantData?.averageRiskScore || 0,
        매출: Math.round((restaurantData?.metrics?.revenue?.average || 0) / 10000), // 만원 단위
        고객수: restaurantData?.metrics?.customers?.average || 0,
        비용: Math.round((restaurantData?.metrics?.expenses?.average || 0) / 10000),
      },
      {
        name: "카페",
        위험도: cafeData?.averageRiskScore || 0,
        매출: Math.round((cafeData?.metrics?.revenue?.average || 0) / 10000),
        고객수: cafeData?.metrics?.customers?.average || 0,
        비용: Math.round((cafeData?.metrics?.expenses?.average || 0) / 10000),
      },
      {
        name: "패스트푸드",
        위험도: fastfoodData?.averageRiskScore || 0,
        매출: Math.round((fastfoodData?.metrics?.revenue?.average || 0) / 10000),
        고객수: fastfoodData?.metrics?.customers?.average || 0,
        비용: Math.round((fastfoodData?.metrics?.expenses?.average || 0) / 10000),
      },
      {
        name: "주점",
        위험도: pubData?.averageRiskScore || 0,
        매출: Math.round((pubData?.metrics?.revenue?.average || 0) / 10000),
        고객수: pubData?.metrics?.customers?.average || 0,
        비용: Math.round((pubData?.metrics?.expenses?.average || 0) / 10000),
      },
      {
        name: "소매",
        위험도: retailData?.averageRiskScore || 0,
        매출: Math.round((retailData?.metrics?.revenue?.average || 0) / 10000),
        고객수: retailData?.metrics?.customers?.average || 0,
        비용: Math.round((retailData?.metrics?.expenses?.average || 0) / 10000),
      },
    ];
  }, [restaurantData, cafeData, fastfoodData, pubData, retailData]);

  // 매출/고객 트렌드 데이터 (월별) - 샘플 데이터 생성
  const trendData = useMemo(() => {
    const baseRevenue = benchmarkData?.metrics?.revenue?.average || 45000000;
    const baseCustomers = benchmarkData?.metrics?.customers?.average || 850;

    return [
      {
        월: "23년 12월",
        내가게_매출: Math.round((baseRevenue * 0.85) / 10000),
        업종평균_매출: Math.round((baseRevenue * 0.88) / 10000),
        내가게_고객: Math.round(baseCustomers * 0.82),
        업종평균_고객: Math.round(baseCustomers * 0.85),
      },
      {
        월: "24년 1월",
        내가게_매출: Math.round((baseRevenue * 0.8) / 10000),
        업종평균_매출: Math.round((baseRevenue * 0.83) / 10000),
        내가게_고객: Math.round(baseCustomers * 0.78),
        업종평균_고객: Math.round(baseCustomers * 0.81),
      },
      {
        월: "24년 2월",
        내가게_매출: Math.round((baseRevenue * 0.78) / 10000),
        업종평균_매출: Math.round((baseRevenue * 0.81) / 10000),
        내가게_고객: Math.round(baseCustomers * 0.75),
        업종평균_고객: Math.round(baseCustomers * 0.78),
      },
      {
        월: "24년 3월",
        내가게_매출: Math.round((baseRevenue * 0.88) / 10000),
        업종평균_매출: Math.round((baseRevenue * 0.9) / 10000),
        내가게_고객: Math.round(baseCustomers * 0.85),
        업종평균_고객: Math.round(baseCustomers * 0.87),
      },
      {
        월: "24년 4월",
        내가게_매출: Math.round((baseRevenue * 0.92) / 10000),
        업종평균_매출: Math.round((baseRevenue * 0.94) / 10000),
        내가게_고객: Math.round(baseCustomers * 0.9),
        업종평균_고객: Math.round(baseCustomers * 0.92),
      },
      {
        월: "24년 5월",
        내가게_매출: Math.round((baseRevenue * 0.98) / 10000),
        업종평균_매출: Math.round((baseRevenue * 0.98) / 10000),
        내가게_고객: Math.round(baseCustomers * 0.96),
        업종평균_고객: Math.round(baseCustomers * 0.96),
      },
      {
        월: "24년 6월",
        내가게_매출: Math.round((baseRevenue * 1.05) / 10000),
        업종평균_매출: Math.round((baseRevenue * 1.0) / 10000),
        내가게_고객: Math.round(baseCustomers * 1.02),
        업종평균_고객: Math.round(baseCustomers * 0.98),
      },
      {
        월: "24년 7월",
        내가게_매출: Math.round((baseRevenue * 1.1) / 10000),
        업종평균_매출: Math.round((baseRevenue * 1.02) / 10000),
        내가게_고객: Math.round(baseCustomers * 1.08),
        업종평균_고객: Math.round(baseCustomers * 1.0),
      },
    ];
  }, [benchmarkData]);

  // 산점도 데이터 (매출 vs 위험도) - 실제 API 데이터 사용
  const scatterData = useMemo(() => {
    if (!scatterDataRaw || !scatterDataRaw.points) return [];

    return scatterDataRaw.points.map((point: any) => ({
      name: point.merchantId || point.merchant_id,
      매출: Math.round(point.revenue / 10000), // 만원 단위
      위험도: point.riskScore || point.risk_score,
      고객수: point.customers,
    }));
  }, [scatterDataRaw]);

  // 대분류 변경 시 세부업종 초기화
  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    setSelectedSubIndustry("__all__"); // 세부업종 초기화
  };

  const formatNumber = (value: number) => {
    return value.toLocaleString("ko-KR");
  };

  // 차트 Tooltip 커스텀
  const CustomTooltip = ({
    active,
    payload,
    label,
  }: {
    active?: boolean;
    payload?: Array<{ name: string; value: number; color: string }>;
    label?: string;
  }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-bold mb-2">{label}</p>
          {payload.map((entry: { name: string; value: number; color: string }, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}:{" "}
              {entry.name === "매출" || entry.name === "비용"
                ? `${entry.value.toLocaleString()}만원`
                : entry.name === "위험도"
                ? `${entry.value}%`
                : `${entry.value.toLocaleString()}명`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // 산점도 커스텀 Tooltip
  const ScatterTooltip = ({
    active,
    payload,
  }: {
    active?: boolean;
    payload?: Array<{ payload: { name: string; 매출: number; 위험도: number; 고객수: number } }>;
  }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-bold mb-2">{data.name}</p>
          <p className="text-sm">매출: {data.매출.toLocaleString()}만원</p>
          <p className="text-sm">위험도: {data.위험도}%</p>
          <p className="text-sm">고객 수: {data.고객수.toLocaleString()}명</p>
        </div>
      );
    }
    return null;
  };

  if (isBenchmarkLoading) {
    return (
      <div className="min-h-screen bg-linear-to-b from-blue-50 to-white">
        <AppHeader />
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="text-center py-12">데이터 로딩 중...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-blue-50 to-white">
      <AppHeader />

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">업종 비교 분석</h1>
          <p className="text-lg text-muted-foreground">우리 가게를 같은 업종, 지역의 다른 사업장과 비교해보세요</p>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardContent className="pt-6 pb-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">업종 대분류</label>
                <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                  <SelectTrigger className="h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {industries.map((industry) => (
                      <SelectItem key={industry.value} value={industry.value}>
                        {industry.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">
                  세부 업종 <span className="text-muted-foreground text-xs">(선택사항)</span>
                </label>
                <Select value={selectedSubIndustry} onValueChange={setSelectedSubIndustry}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="전체 (대분류 평균)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__all__">전체 (대분류 평균)</SelectItem>
                    {subIndustries[selectedCategory]?.map((subIndustry) => (
                      <SelectItem key={subIndustry.value} value={subIndustry.value}>
                        {subIndustry.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="mt-3 text-sm text-muted-foreground">
              <span className="font-medium">📍 대상 지역:</span> 성동구 전체
            </div>
          </CardContent>
        </Card>

        {/* 매출/고객 트렌드 라인 차트 */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span>⭐</span>
              <span>매출/고객 트렌드 비교</span>
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-2">내 가게와 업종 평균의 월별 추이를 비교해보세요</p>
          </CardHeader>
          <CardContent>
            {/* 매출 트렌드 */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">💰 월별 매출 추이 비교</h3>
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
                      최근 2개월간 내 가게의 매출이 업종 평균을 상회하며 성장세를 보이고 있습니다. 6월과 7월에는 업종
                      평균 대비 각각 5%, 8% 높은 매출을 기록했습니다.
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
                      1-2월 비수기를 거쳐 3월부터 꾸준한 회복세를 보이고 있습니다. 7월 현재 고객 수는 업종 평균 대비 8%
                      높은 수준으로, 고객 유치 전략이 효과적으로 작동하고 있습니다.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 종합 인사이트 */}
            <div className="mt-8 p-6 bg-linear-to-r from-green-50 to-blue-50 rounded-lg">
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <span>💡</span>
                <span>종합 트렌드 인사이트</span>
              </h3>
              <div className="space-y-2 text-sm">
                <p className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>
                    <span className="font-semibold text-foreground">성장 추세:</span> 매출과 고객 수 모두 업종 평균을
                    상회하며 상승 곡선을 그리고 있습니다.
                  </span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>
                    <span className="font-semibold text-foreground">계절성 대응:</span> 1-2월 비수기에도 업종 평균과
                    유사한 하락폭을 보여 안정적인 운영을 하고 있습니다.
                  </span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">→</span>
                  <span>
                    <span className="font-semibold text-foreground">권장사항:</span> 현재의 성장세를 유지하되,
                    재방문율을 높이는 로열티 프로그램 도입을 고려해보세요.
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

        {/* 산점도 - 매출 vs 위험도 관계 */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span>⭐</span>
              <span>산점도 - 매출과 위험도 관계 분석</span>
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-2">
              선택한 업종의 <strong>개별 가게들</strong>의 매출과 위험도 분포를 확인하세요. 총{" "}
              <strong className="text-blue-600">{scatterDataRaw?.totalCount || 0}개</strong> 가게 중{" "}
              <strong className="text-blue-600">{scatterData.length}개</strong> 표시 중
            </p>
          </CardHeader>
          <CardContent>
            {isScatterLoading ? (
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
                      dataKey="매출"
                      name="매출"
                      unit="만원"
                      label={{ value: "월평균 매출 (만원)", position: "bottom", offset: 0 }}
                    />
                    <YAxis
                      type="number"
                      dataKey="위험도"
                      name="위험도"
                      unit="%"
                      label={{ value: "위험도 (%)", angle: -90, position: "insideLeft" }}
                    />
                    <ZAxis type="number" dataKey="고객수" range={[50, 500]} name="고객수" />
                    <Tooltip content={<ScatterTooltip />} cursor={{ strokeDasharray: "3 3" }} />

                    {/* 평균선 추가 */}
                    {scatterDataRaw && (
                      <>
                        <line
                          x1={Math.round(scatterDataRaw.avgRevenue / 10000)}
                          y1="0%"
                          x2={Math.round(scatterDataRaw.avgRevenue / 10000)}
                          y2="100%"
                          stroke="#ef4444"
                          strokeWidth={2}
                          strokeDasharray="5 5"
                        />
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

                    {/* 모든 개별 가게 데이터 */}
                    <Scatter
                      name={`${industries.find((i) => i.value === selectedCategory)?.label || "업종"} 가게들`}
                      data={scatterData}
                      fill="#3b82f6"
                      fillOpacity={0.6}
                    />
                  </ScatterChart>
                </ResponsiveContainer>

                {/* 통계 정보 */}
                {scatterDataRaw && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold mb-2">📊 {actualIndustry} 업종 통계</h4>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">평균 매출:</span>
                        <p className="font-semibold text-lg">
                          {Math.round(scatterDataRaw.avgRevenue / 10000).toLocaleString()}만원
                        </p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">평균 고객 수:</span>
                        <p className="font-semibold text-lg">
                          {Math.round(scatterDataRaw.avgCustomers).toLocaleString()}명
                        </p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">평균 위험도:</span>
                        <p className="font-semibold text-lg">{scatterDataRaw.avgRisk.toFixed(1)}%</p>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* 산점도 해석 가이드 */}
            <div className="mt-6 grid md:grid-cols-2 gap-4">
              {/* 좌측: 사분면 설명 */}
              <div className="p-5 bg-linear-to-br from-green-50 to-blue-50 rounded-lg border border-green-200">
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <span>📍</span>
                  <span>최적 구간 (고매출 저위험)</span>
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  오른쪽 아래 영역에 위치한 가게가 가장 이상적입니다. 높은 매출과 낮은 위험도를 동시에 달성했습니다.
                </p>
                <div className="space-y-2 text-sm">
                  <p className="font-semibold text-green-600">
                    ✓{" "}
                    {
                      scatterData.filter(
                        (d) =>
                          d.매출 > (scatterDataRaw?.avgRevenue || 0) / 10000 &&
                          d.위험도 < (scatterDataRaw?.avgRisk || 50)
                      ).length
                    }
                    개 가게
                  </p>
                  <p className="text-xs text-muted-foreground">(평균 이상 매출 & 평균 이하 위험도)</p>
                </div>
              </div>

              {/* 우측: 주의 구간 */}
              <div className="p-5 bg-linear-to-br from-red-50 to-orange-50 rounded-lg border border-red-200">
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <span>⚠️</span>
                  <span>주의 구간 (저매출 고위험)</span>
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  왼쪽 위 영역에 위치한 가게는 매출 대비 위험도가 높습니다. 특별한 관리와 개선이 필요합니다.
                </p>
                <div className="space-y-2 text-sm">
                  <p className="font-semibold text-red-600">
                    !{" "}
                    {
                      scatterData.filter(
                        (d) =>
                          d.매출 < (scatterDataRaw?.avgRevenue || 0) / 10000 &&
                          d.위험도 > (scatterDataRaw?.avgRisk || 50)
                      ).length
                    }
                    개 가게
                  </p>
                  <p className="text-xs text-muted-foreground">(평균 이하 매출 & 평균 이상 위험도)</p>
                </div>
              </div>
            </div>

            {/* 종합 분석 */}
            <div className="mt-6 p-6 bg-linear-to-r from-indigo-50 to-purple-50 rounded-lg">
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <span>💡</span>
                <span>산점도 분석 인사이트</span>
              </h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p className="flex items-start gap-2">
                  <span className="text-indigo-600 font-bold">•</span>
                  <span>
                    <span className="font-semibold text-foreground">버블 크기:</span> 고객 수를 나타냅니다. 큰
                    버블일수록 더 많은 고객이 방문합니다.
                  </span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-indigo-600 font-bold">•</span>
                  <span>
                    <span className="font-semibold text-foreground">X축 (매출):</span> 오른쪽으로 갈수록 매출이 높은
                    업종입니다.
                  </span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-indigo-600 font-bold">•</span>
                  <span>
                    <span className="font-semibold text-foreground">Y축 (위험도):</span> 위로 갈수록 폐업 위험도가 높은
                    업종입니다.
                  </span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-indigo-600 font-bold">•</span>
                  <span>
                    <span className="font-semibold text-foreground">창업 추천:</span> 오른쪽 아래 영역의 업종들이
                    상대적으로 안정적이고 수익성이 높습니다.
                  </span>
                </p>
                <p className="mt-4 text-xs">
                  * 데이터는 성동구 최근 6개월 실제 데이터를 기반으로 합니다. 개별 매장의 성과는 위치, 운영 방식에 따라
                  다를 수 있습니다.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 다중 업종 비교 막대 차트 */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span>⭐</span>
              <span>다중 업종 비교 - 업종별 주요 지표</span>
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-2">
              성동구 내 주요 업종들의 위험도, 매출, 고객 수, 비용을 한눈에 비교해보세요
            </p>
          </CardHeader>
          <CardContent>
            {/* 위험도 비교 차트 */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">📊 업종별 평균 위험도</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={multiIndustryChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis label={{ value: "위험도 (%)", angle: -90, position: "insideLeft" }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="위험도" fill="#ef4444" name="위험도" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* 매출 비교 차트 */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">💰 업종별 월 평균 매출</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={multiIndustryChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis label={{ value: "매출 (만원)", angle: -90, position: "insideLeft" }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="매출" fill="#10b981" name="매출" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* 고객 수 비교 차트 */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">👥 업종별 월 평균 고객 수</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={multiIndustryChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis label={{ value: "고객 수 (명)", angle: -90, position: "insideLeft" }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="고객수" fill="#8b5cf6" name="고객수" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* 비용 비교 차트 */}
            <div>
              <h3 className="text-lg font-semibold mb-4">💸 업종별 월 평균 비용</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={multiIndustryChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis label={{ value: "비용 (만원)", angle: -90, position: "insideLeft" }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="비용" fill="#f97316" name="비용" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* 인사이트 요약 */}
            <div className="mt-8 p-6 bg-linear-to-r from-blue-50 to-purple-50 rounded-lg">
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <span>💡</span>
                <span>업종 비교 인사이트</span>
              </h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>
                  • <span className="font-semibold text-foreground">매출이 가장 높은 업종:</span>{" "}
                  {
                    multiIndustryChartData.reduce(
                      (max, item) => (item.매출 > max.매출 ? item : max),
                      multiIndustryChartData[0]
                    )?.name
                  }
                </p>
                <p>
                  • <span className="font-semibold text-foreground">위험도가 가장 높은 업종:</span>{" "}
                  {
                    multiIndustryChartData.reduce(
                      (max, item) => (item.위험도 > max.위험도 ? item : max),
                      multiIndustryChartData[0]
                    )?.name
                  }
                </p>
                <p>
                  • <span className="font-semibold text-foreground">고객 수가 가장 많은 업종:</span>{" "}
                  {
                    multiIndustryChartData.reduce(
                      (max, item) => (item.고객수 > max.고객수 ? item : max),
                      multiIndustryChartData[0]
                    )?.name
                  }
                </p>
                <p className="mt-4 text-xs">
                  * 데이터는 성동구 내 각 업종의 평균값을 기준으로 합니다. 실제 매장의 성과는 위치, 규모, 운영 방식에
                  따라 달라질 수 있습니다.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 벤치마크 정보 표시 */}
        {benchmarkData && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>
                업종 벤치마크 정보
                {selectedSubIndustry !== "__all__" && (
                  <span className="text-sm font-normal text-muted-foreground ml-2">
                    ({subIndustries[selectedCategory]?.find((s) => s.value === selectedSubIndustry)?.label})
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground mb-1">평균 위험도</p>
                  <p className="text-2xl font-bold text-blue-600">{benchmarkData.averageRiskScore}%</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground mb-1">월 평균 매출</p>
                  <p className="text-2xl font-bold text-green-600">
                    ₩{formatNumber(benchmarkData.metrics.revenue.average)}
                  </p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground mb-1">월 평균 고객 수</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {formatNumber(benchmarkData.metrics.customers.average)}명
                  </p>
                </div>
                <div className="bg-orange-50 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground mb-1">평균 비용</p>
                  <p className="text-2xl font-bold text-orange-600">
                    ₩{formatNumber(benchmarkData.metrics.expenses.average)}
                  </p>
                </div>
              </div>

              {/* 인사이트 */}
              <div className="mt-6 space-y-3">
                <h3 className="font-semibold text-lg mb-3">📊 업종 인사이트</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-start gap-3">
                      <TrendingUp className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
                      <div>
                        <h4 className="font-semibold mb-1">매출 추세</h4>
                        <p className="text-sm text-muted-foreground">
                          이 업종의 평균 매출은{" "}
                          <span className="font-semibold text-foreground">
                            월 {formatNumber(benchmarkData.metrics.revenue.average)}원
                          </span>
                          입니다. 수익성을 높이려면 고객 단가 상승 또는 재방문율 개선이 필요합니다.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-start gap-3">
                      <TrendingDown className="h-5 w-5 text-purple-600 mt-0.5 shrink-0" />
                      <div>
                        <h4 className="font-semibold mb-1">고객 현황</h4>
                        <p className="text-sm text-muted-foreground">
                          평균{" "}
                          <span className="font-semibold text-foreground">
                            {formatNumber(benchmarkData.metrics.customers.average)}명
                          </span>
                          의 고객이 방문합니다. 고객 만족도를 높이고 재방문을 유도하는 전략이 중요합니다.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Button asChild size="lg">
            <Link to="/diagnose">진단 시작하기</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="bg-transparent">
            <Link to="/dashboard">대시보드로</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
