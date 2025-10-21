import Link from "next/link"
import { ArrowLeft, Lightbulb, TrendingUp, Users, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function InsightsPage() {
  const insights = [
    {
      icon: TrendingUp,
      title: "음식점 업종 인사이트",
      content: "배달 앱 의존도가 높은 음식점일수록 폐업 위험이 30% 높습니다. 자체 고객 확보 전략이 필수입니다.",
      tips: ["단골 고객 리워드 프로그램 운영", "SNS 마케팅 강화", "자체 배달 시스템 구축 검토"],
    },
    {
      icon: Users,
      title: "카페 업종 인사이트",
      content: "재방문율이 40% 이상인 카페는 생존율이 2배 높습니다. 고객 경험과 브랜딩이 핵심입니다.",
      tips: ["시그니처 메뉴 개발", "인테리어 차별화", "고객 커뮤니티 형성"],
    },
    {
      icon: DollarSign,
      title: "소매업 인사이트",
      content: "온라인 채널을 병행하는 소매업은 매출이 평균 45% 높습니다. 옴니채널 전략이 필수입니다.",
      tips: ["온라인 쇼핑몰 개설", "소셜 커머스 활용", "재고 관리 시스템 도입"],
    },
    {
      icon: Lightbulb,
      title: "미용/이용 업종 인사이트",
      content: "예약 시스템을 사용하는 미용실은 노쇼율이 60% 감소하고 매출이 안정적입니다.",
      tips: ["온라인 예약 시스템 도입", "고객 관리 프로그램 활용", "정기 고객 할인 제도"],
    },
  ]

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
          <h1 className="text-4xl font-bold mb-4">업종별 인사이트</h1>
          <p className="text-xl text-muted-foreground">데이터 분석을 통해 발견한 업종별 성공 전략과 인사이트</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {insights.map((insight, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <insight.icon className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{insight.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4 leading-relaxed">{insight.content}</p>
                <div className="bg-muted/50 rounded-lg p-4">
                  <div className="font-semibold mb-2 text-sm">실행 가능한 팁</div>
                  <ul className="space-y-2">
                    {insight.tips.map((tip, tipIndex) => (
                      <li key={tipIndex} className="text-sm flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="bg-gradient-to-r from-primary/10 to-secondary/10">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold mb-4">공통 성공 요인</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <div className="text-3xl font-bold text-primary mb-2">85%</div>
                <div className="font-medium mb-1">고객 데이터 활용</div>
                <div className="text-sm text-muted-foreground">고객 데이터를 분석하고 활용하는 사업장의 생존율</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-2">3개월</div>
                <div className="font-medium mb-1">조기 대응 기간</div>
                <div className="text-sm text-muted-foreground">매출 감소 징후 발견 후 3개월 내 대응 시 회복 가능</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-2">2배</div>
                <div className="font-medium mb-1">정기 점검 효과</div>
                <div className="text-sm text-muted-foreground">월 1회 이상 경영 상태를 점검하는 사업장의 성공률</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
