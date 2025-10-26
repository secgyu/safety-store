import { ArrowLeft, Quote } from "lucide-react";
import { Link } from "react-router-dom";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useSuccessStories } from "@/lib/api";

export default function SuccessStoriesPage() {
  const { data: stories, isLoading, error } = useSuccessStories();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">성공 사례를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error || !stories) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 max-w-md">
          <div className="text-center">
            <Quote className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
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
          <h1 className="text-4xl font-bold mb-4">성공 사례</h1>
          <p className="text-xl text-muted-foreground">위기를 극복하고 성공한 자영업자들의 실제 이야기</p>
        </div>

        <div className="space-y-6">
          {stories.map((story) => (
            <Card key={story.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-2xl font-bold">{story.business_name}</h3>
                      <Badge>{story.industry}</Badge>
                    </div>
                    <p className="text-muted-foreground">{story.location}</p>
                  </div>
                  <Quote className="h-8 w-8 text-primary/20" />
                </div>

                <div className="space-y-4 mb-6">
                  <div>
                    <div className="font-semibold text-sm text-muted-foreground mb-1">성공 스토리</div>
                    <p className="leading-relaxed">{story.story}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-red-50 rounded-lg p-4">
                      <div className="font-semibold text-sm text-muted-foreground mb-1">개선 전</div>
                      <p className="text-2xl font-bold text-red-600">{story.before_score}점</p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4">
                      <div className="font-semibold text-sm text-muted-foreground mb-1">개선 후</div>
                      <p className="text-2xl font-bold text-green-600">{story.after_score}점</p>
                    </div>
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-muted-foreground mb-2">실행한 개선 사항</div>
                    <ul className="space-y-2">
                      {story.improvements.map((improvement, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          <span className="leading-relaxed">{improvement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="bg-muted/50 rounded-lg p-4 border-l-4 border-primary">
                  <p className="italic leading-relaxed">"{story.testimonial}"</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mt-8 bg-gradient-to-r from-primary/10 to-secondary/10">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">당신의 성공 스토리를 만들어보세요</h2>
            <p className="text-muted-foreground mb-6">조기 진단과 빠른 대응으로 위기를 기회로 바꿀 수 있습니다</p>
            <Button asChild size="lg">
              <Link to="/diagnose">무료 진단 시작하기</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
