import { ArrowLeft, DollarSign, Lightbulb, TrendingUp, Users } from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { useInsights } from "@/lib/api";

// 인사이트 타입별 아이콘 매핑
const industryIcons: Record<string, typeof TrendingUp> = {
  음식점: TrendingUp,
  카페: Users,
  소매업: DollarSign,
  "미용/이용": Lightbulb,
  전체: TrendingUp,
};

export default function InsightsPage() {
  const { data: insights, isLoading, error } = useInsights();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">인사이트를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error || !insights) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 max-w-md">
          <div className="text-center">
            <Lightbulb className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">데이터를 불러올 수 없습니다</h2>
            <p className="text-muted-foreground mb-4">일시적인 오류가 발생했습니다.</p>
            <Button asChild>
              <Link to="/">홈으로</Link>
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Button asChild variant="ghost" className="mb-6">
          <Link to="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            홈으로
          </Link>
        </Button>

        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">업종별 인사이트</h1>
          <p className="text-xl text-muted-foreground">데이터 분석을 통해 발견한 업종별 성공 전략과 인사이트</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {insights.map((insight) => {
            const IconComponent = industryIcons[insight.industry] || Lightbulb;
            return (
              <Card key={insight.id}>
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <IconComponent className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{insight.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4 leading-relaxed">{insight.summary}</p>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <div className="font-semibold mb-2 text-sm">주요 포인트</div>
                    <ul className="space-y-2">
                      {insight.keyPoints.map((point: string, pointIndex: number) => (
                        <li key={pointIndex} className="text-sm flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
