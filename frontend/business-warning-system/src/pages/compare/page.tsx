import { Minus, TrendingDown, TrendingUp } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { AppHeader } from "@/components/app-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const industries = [
  { value: "restaurant", label: "음식점" },
  { value: "cafe", label: "카페" },
  { value: "retail", label: "소매업" },
  { value: "service", label: "서비스업" },
  { value: "beauty", label: "미용업" },
  { value: "academy", label: "학원" },
];

const regions = [
  { value: "seongsu1", label: "성수1가" },
  { value: "seongsu2", label: "성수2가" },
  { value: "wangsimni", label: "왕십리" },
  { value: "haengdang", label: "행당동" },
  { value: "eungbong", label: "응봉동" },
  { value: "geumho", label: "금호동" },
  { value: "oksu", label: "옥수동" },
];
export default function ComparePage() {
  const [selectedIndustry, setSelectedIndustry] = useState("restaurant");
  const [selectedRegion, setSelectedRegion] = useState("seongsu1");

  // Mock data - replace with actual API call
  const comparisonData = [
    { name: "내 가게", value: 25, isUser: true },
    { name: "업종 평균", value: 20, isUser: false },
    { name: "지역 평균", value: 22, isUser: false },
    { name: "전국 평균", value: 18, isUser: false },
  ];

  const detailedMetrics = [
    {
      metric: "매출 증가율",
      userValue: -5,
      industryAvg: -3,
      unit: "%",
    },
    {
      metric: "고객 유지율",
      userValue: 65,
      industryAvg: 70,
      unit: "%",
    },
    {
      metric: "월 평균 매출",
      userValue: 5000000,
      industryAvg: 5500000,
      unit: "원",
    },
    {
      metric: "월 평균 고객 수",
      userValue: 300,
      industryAvg: 350,
      unit: "명",
    },
  ];

  const insights = [
    {
      title: "매출 추세",
      description: "같은 지역 음식점 평균보다 5% 낮습니다",
      trend: "down" as const,
    },
    {
      title: "고객 유지율",
      description: "업종 평균보다 5%p 낮아 개선이 필요합니다",
      trend: "down" as const,
    },
    {
      title: "시장 위치",
      description: "상위 55% 수준으로 평균보다 약간 높습니다",
      trend: "neutral" as const,
    },
  ];

  const formatNumber = (value: number) => {
    return value.toLocaleString("ko-KR");
  };

  const getTrendIcon = (trend: "up" | "down" | "neutral") => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-5 w-5 text-success" />;
      case "down":
        return <TrendingDown className="h-5 w-5 text-danger" />;
      case "neutral":
        return <Minus className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getComparison = (userValue: number, avgValue: number) => {
    const diff = userValue - avgValue;
    const percentage = ((diff / avgValue) * 100).toFixed(1);
    if (diff > 0) {
      return { text: `${percentage}% 높음`, color: "text-success" };
    } else if (diff < 0) {
      return { text: `${Math.abs(Number(percentage))}% 낮음`, color: "text-danger" };
    }
    return { text: "동일", color: "text-muted-foreground" };
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
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
                <label className="text-sm font-medium mb-2 block">업종 선택</label>
                <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
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
                <label className="text-sm font-medium mb-2 block">지역 선택</label>
                <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                  <SelectTrigger className="h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {regions.map((region) => (
                      <SelectItem key={region.value} value={region.value}>
                        {region.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Comparison Chart */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>위험도 비교</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={comparisonData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" tick={{ fill: "#6b7280" }} />
                <YAxis tick={{ fill: "#6b7280" }} label={{ value: "위험도 (%)", angle: -90, position: "insideLeft" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                  formatter={(value: number) => [`${value}%`, "위험도"]}
                />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {comparisonData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.isUser ? "#3b82f6" : "#94a3b8"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">내 가게</span>는 성동구 업종 평균보다{" "}
                <span className="font-semibold text-warning">5%p 높은</span> 위험도를 보이고 있습니다.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Metrics */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>상세 지표 비교</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {detailedMetrics.map((metric, index) => {
                const comparison = getComparison(metric.userValue, metric.industryAvg);
                return (
                  <div key={index} className="border-b last:border-0 pb-6 last:pb-0">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-lg">{metric.metric}</h3>
                      <span className={`text-sm font-medium ${comparison.color}`}>{comparison.text}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-blue-50 rounded-lg p-4">
                        <p className="text-sm text-muted-foreground mb-1">내 가게</p>
                        <p className="text-2xl font-bold text-primary">
                          {metric.unit === "원"
                            ? `₩${formatNumber(metric.userValue)}`
                            : `${metric.userValue}${metric.unit}`}
                        </p>
                      </div>
                      <div className="bg-muted rounded-lg p-4">
                        <p className="text-sm text-muted-foreground mb-1">업종 평균</p>
                        <p className="text-2xl font-bold text-foreground">
                          {metric.unit === "원"
                            ? `₩${formatNumber(metric.industryAvg)}`
                            : `${metric.industryAvg}${metric.unit}`}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Insights */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>인사이트</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {insights.map((insight, index) => (
                <div key={index} className="flex gap-4 p-4 bg-muted/50 rounded-lg">
                  <div className="flex-shrink-0 mt-1">{getTrendIcon(insight.trend)}</div>
                  <div>
                    <h4 className="font-semibold mb-1">{insight.title}</h4>
                    <p className="text-sm text-muted-foreground">{insight.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Percentile Info */}
        <Card className="mb-8 bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
          <CardContent className="pt-6 pb-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">전체 순위</p>
              <p className="text-4xl font-bold text-primary mb-2">상위 55%</p>
              <p className="text-muted-foreground">
                성동구 같은 업종 중 <span className="font-semibold">평균보다 약간 높은</span> 위험도입니다
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg">
            <Link to="/diagnose">다시 진단하기</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="bg-transparent">
            <Link to="/results">내 결과 보기</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
