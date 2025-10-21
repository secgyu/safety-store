import { Link } from "@/lib/next-compat";
import { ArrowLeft, TrendingDown, TrendingUp, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function StatisticsPage() {
  const industryStats = [
    { industry: "음식점", closureRate: 28.5, trend: "down", change: -2.3 },
    { industry: "카페/디저트", closureRate: 32.1, trend: "up", change: 1.8 },
    { industry: "소매업", closureRate: 25.7, trend: "down", change: -1.5 },
    { industry: "미용/이용", closureRate: 22.3, trend: "stable", change: 0.2 },
    { industry: "학원/교육", closureRate: 19.8, trend: "down", change: -3.1 },
    { industry: "숙박업", closureRate: 31.4, trend: "up", change: 2.5 },
  ];

  const survivalRates = [
    { year: "1년", rate: 72.5 },
    { year: "3년", rate: 48.3 },
    { year: "5년", rate: 32.1 },
    { year: "10년", rate: 15.7 },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Button asChild variant="ghost" className="mb-6">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            홈으로
          </Link>
        </Button>

        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">자영업 통계</h1>
          <p className="text-xl text-muted-foreground">최신 자영업 데이터와 업종별 통계를 확인하세요</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>업종별 폐업률 (2024년 기준)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {industryStats.map((stat) => (
                  <div key={stat.industry} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="font-medium">{stat.industry}</span>
                      {stat.trend === "down" && <TrendingDown className="h-4 w-4 text-success" />}
                      {stat.trend === "up" && <TrendingUp className="h-4 w-4 text-danger" />}
                      {stat.trend === "stable" && <Minus className="h-4 w-4 text-muted-foreground" />}
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{stat.closureRate}%</div>
                      <div
                        className={`text-xs ${
                          stat.trend === "down"
                            ? "text-success"
                            : stat.trend === "up"
                            ? "text-danger"
                            : "text-muted-foreground"
                        }`}
                      >
                        {stat.change > 0 ? "+" : ""}
                        {stat.change}%p
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>생존율 통계</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {survivalRates.map((item) => (
                  <div key={item.year}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{item.year} 생존율</span>
                      <span className="font-bold text-lg">{item.rate}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-3">
                      <div className="bg-primary rounded-full h-3 transition-all" style={{ width: `${item.rate}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>주요 폐업 원인</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">42%</div>
                <div className="font-medium mb-1">매출 감소</div>
                <div className="text-sm text-muted-foreground">지속적인 매출 하락</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">28%</div>
                <div className="font-medium mb-1">과도한 경쟁</div>
                <div className="text-sm text-muted-foreground">동종 업체 증가</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">18%</div>
                <div className="font-medium mb-1">임대료 부담</div>
                <div className="text-sm text-muted-foreground">높은 고정비용</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 p-6 bg-muted/50 rounded-lg">
          <p className="text-sm text-muted-foreground">
            * 본 통계는 소상공인시장진흥공단 및 통계청 자료를 기반으로 작성되었습니다. (2024년 12월 기준)
          </p>
        </div>
      </div>
    </div>
  );
}
