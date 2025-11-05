import { useState } from "react";
import { Link } from "react-router-dom";

import {
  BenchmarkInfo,
  CompareInsights,
  IndustryFilters,
  MultiIndustryRadar,
  SalesTrendChart,
  ScatterPlotAnalysis,
} from "@/features/benchmark/components/Compare";
import { useCompareData } from "@/features/benchmark/hooks/useCompareData";
import { useScatterPlot } from "@/features/benchmark/hooks/useScatterPlot";
import { getIndustryLabel, industries, subIndustries } from "@/features/benchmark/utils/industryConfig";
import { AppHeader } from "@/shared/components/layout/AppHeader";
import { Button } from "@/shared/components/ui/button";

export default function ComparePage() {
  const [selectedCategory, setSelectedCategory] = useState("restaurant");
  const [selectedSubIndustry, setSelectedSubIndustry] = useState("__all__");

  // 실제 조회할 업종: 세부업종이 선택되면 그것을, 아니면 대분류 사용
  const actualIndustry = selectedSubIndustry === "__all__" ? selectedCategory : selectedSubIndustry;
  const industryLabel = getIndustryLabel(actualIndustry);

  // Custom hooks
  const { trendData, radarChartData, currentIndustryData, isLoading } = useCompareData(actualIndustry);
  const { scatterData, scatterDataRaw, isLoading: isScatterLoading } = useScatterPlot(actualIndustry, 500);

  // 카테고리 변경 핸들러
  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    setSelectedSubIndustry("__all__");
  };

  // 세부 업종 변경 핸들러
  const handleSubIndustryChange = (value: string) => {
    setSelectedSubIndustry(value);
  };

  return (
    <>
      <AppHeader />
      <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-white to-purple-50/30">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {/* 페이지 헤더 */}
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              업종별 비교 분석
            </h1>
            <p className="text-lg text-muted-foreground">
              다양한 업종의 데이터를 비교하고 창업에 가장 적합한 업종을 찾아보세요
            </p>
          </div>

          {/* 업종 필터 */}
          <IndustryFilters
            industries={industries}
            subIndustries={subIndustries}
            selectedCategory={selectedCategory}
            selectedSubIndustry={selectedSubIndustry}
            onCategoryChange={handleCategoryChange}
            onSubIndustryChange={handleSubIndustryChange}
          />

          {/* 로딩 상태 */}
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-lg font-medium text-muted-foreground">데이터 로딩 중...</p>
              </div>
            </div>
          ) : currentIndustryData ? (
            <>
              {/* 벤치마크 정보 */}
              <BenchmarkInfo
                industryLabel={industryLabel}
                totalBusinesses={currentIndustryData.metrics?.totalBusinesses || 0}
                avgRevenue={currentIndustryData.metrics?.revenue?.average || 0}
                avgCustomers={currentIndustryData.metrics?.customers?.average || 0}
                avgRiskScore={currentIndustryData.averageRiskScore || 0}
                closedLastMonth={currentIndustryData.metrics?.closedLastMonth || 0}
              />

              {/* 매출/고객 트렌드 차트 */}
              <SalesTrendChart trendData={trendData} />

              {/* 산점도 분석 */}
              <ScatterPlotAnalysis
                scatterData={scatterData}
                scatterDataRaw={scatterDataRaw}
                isLoading={isScatterLoading}
                industryLabel={industryLabel}
              />

              {/* 다중 업종 레이더 차트 */}
              <MultiIndustryRadar radarChartData={radarChartData} />

              {/* AI 인사이트 */}
              <CompareInsights
                industryLabel={industryLabel}
                avgRevenue={currentIndustryData.metrics?.revenue?.average || 0}
                avgRiskScore={currentIndustryData.averageRiskScore || 0}
                avgCustomers={currentIndustryData.metrics?.customers?.average || 0}
              />
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">해당 업종의 데이터가 없습니다.</p>
              <Button asChild>
                <Link to="/diagnose">진단하러 가기</Link>
              </Button>
            </div>
          )}

          {/* 하단 액션 버튼 */}
          <div className="mt-12 text-center">
            <div className="flex flex-wrap gap-4 justify-center">
              <Button asChild size="lg" className="gap-2">
                <Link to="/diagnose">내 가게 진단하기</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="gap-2">
                <Link to="/insights">업종 인사이트 보기</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
