import { Link } from "@/lib/next-compat";
import { ArrowLeft, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function SuccessStoriesPage() {
  const stories = [
    {
      name: "김민수",
      business: "서울 강남구 카페",
      industry: "카페",
      situation: "개업 2년차, 매출 30% 감소",
      action: "진단 결과 ORANGE 등급을 받고 즉시 개선 작업 시작. 시그니처 메뉴 개발과 SNS 마케팅 강화",
      result: "6개월 만에 매출 50% 증가, GREEN 등급으로 개선",
      quote: "조기에 위험 신호를 발견해서 빠르게 대응할 수 있었습니다. 지금은 안정적으로 운영하고 있어요.",
    },
    {
      name: "이지은",
      business: "부산 해운대구 음식점",
      industry: "음식점",
      situation: "개업 3년차, 고객 수 지속 감소",
      action: "YELLOW 등급 진단 후 메뉴 개편과 배달 서비스 개선. 단골 고객 리워드 프로그램 도입",
      result: "재방문율 40% 증가, 월 매출 2배 성장",
      quote: "데이터로 문제를 정확히 파악하니 해결책이 명확해졌습니다. 이제는 자신감 있게 운영합니다.",
    },
    {
      name: "박준호",
      business: "대구 중구 미용실",
      industry: "미용/이용",
      situation: "개업 1년차, 예약 노쇼 문제",
      action: "진단 후 온라인 예약 시스템 도입과 고객 관리 프로그램 활용",
      result: "노쇼율 70% 감소, 고객 만족도 상승",
      quote: "시스템을 갖추니 운영이 훨씬 수월해졌어요. 고객들도 편리해하시고 매출도 안정적입니다.",
    },
    {
      name: "최수진",
      business: "인천 남동구 소매점",
      industry: "소매업",
      situation: "개업 4년차, 온라인 쇼핑몰 경쟁",
      action: "RED 등급에서 온라인 채널 확장과 재고 관리 시스템 도입",
      result: "3개월 만에 YELLOW 등급, 온라인 매출 비중 40% 달성",
      quote: "위기가 기회였습니다. 온라인 진출로 새로운 고객층을 확보했어요.",
    },
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
          <h1 className="text-4xl font-bold mb-4">성공 사례</h1>
          <p className="text-xl text-muted-foreground">위기를 극복하고 성공한 자영업자들의 실제 이야기</p>
        </div>

        <div className="space-y-6">
          {stories.map((story, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-2xl font-bold">{story.name}</h3>
                      <Badge>{story.industry}</Badge>
                    </div>
                    <p className="text-muted-foreground">{story.business}</p>
                  </div>
                  <Quote className="h-8 w-8 text-primary/20" />
                </div>

                <div className="space-y-4 mb-6">
                  <div>
                    <div className="font-semibold text-sm text-muted-foreground mb-1">상황</div>
                    <p className="leading-relaxed">{story.situation}</p>
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-muted-foreground mb-1">실행한 조치</div>
                    <p className="leading-relaxed">{story.action}</p>
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-muted-foreground mb-1">결과</div>
                    <p className="leading-relaxed font-medium text-primary">{story.result}</p>
                  </div>
                </div>

                <div className="bg-muted/50 rounded-lg p-4 border-l-4 border-primary">
                  <p className="italic leading-relaxed">"{story.quote}"</p>
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
              <Link href="/diagnose">무료 진단 시작하기</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
