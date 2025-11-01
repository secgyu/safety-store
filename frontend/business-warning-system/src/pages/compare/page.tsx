import { TrendingDown, TrendingUp } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

import { AppHeader } from "@/components/app-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useBenchmark } from "@/lib/api";

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

  // API 호출 - 벤치마크 데이터 (지역은 성동구로 고정)
  const { data: benchmarkData, isLoading: isBenchmarkLoading } = useBenchmark(actualIndustry, undefined);

  // 대분류 변경 시 세부업종 초기화
  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    setSelectedSubIndustry("__all__"); // 세부업종 초기화
  };

  const formatNumber = (value: number) => {
    return value.toLocaleString("ko-KR");
  };

  if (isBenchmarkLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <AppHeader />
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="text-center py-12">데이터 로딩 중...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
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
                      <TrendingUp className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
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
                      <TrendingDown className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
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
