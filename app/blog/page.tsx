import Link from "next/link"
import { ArrowLeft, Calendar, Clock, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function BlogPage() {
  const posts = [
    {
      id: 1,
      title: "2025년 자영업 트렌드 분석",
      excerpt: "올해 주목해야 할 자영업 트렌드와 성공 전략을 알아봅니다.",
      category: "트렌드",
      date: "2025-01-15",
      readTime: "5분",
    },
    {
      id: 2,
      title: "매출 감소 시 대응 방법 5가지",
      excerpt: "매출이 줄어들 때 즉시 실행할 수 있는 실전 대응 전략을 소개합니다.",
      category: "경영 팁",
      date: "2025-01-10",
      readTime: "7분",
    },
    {
      id: 3,
      title: "고객 재방문율 높이는 법",
      excerpt: "단골 고객을 만드는 검증된 방법들을 사례와 함께 알아봅니다.",
      category: "마케팅",
      date: "2025-01-05",
      readTime: "6분",
    },
    {
      id: 4,
      title: "업종별 평균 폐업률 통계",
      excerpt: "최근 3년간 업종별 폐업률 데이터와 생존 전략을 분석합니다.",
      category: "통계",
      date: "2024-12-28",
      readTime: "8분",
    },
    {
      id: 5,
      title: "소상공인 지원 정책 총정리",
      excerpt: "2025년 정부 지원 정책과 신청 방법을 한눈에 정리했습니다.",
      category: "정책",
      date: "2024-12-20",
      readTime: "10분",
    },
    {
      id: 6,
      title: "위기를 기회로 바꾼 사례들",
      excerpt: "어려운 상황을 극복하고 성공한 자영업자들의 실제 이야기입니다.",
      category: "성공 사례",
      date: "2024-12-15",
      readTime: "9분",
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
          <h1 className="text-4xl font-bold mb-4">블로그</h1>
          <p className="text-xl text-muted-foreground">자영업 경영에 도움이 되는 인사이트와 정보를 공유합니다</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Card key={post.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Badge variant="secondary">{post.category}</Badge>
                </div>
                <h2 className="text-xl font-bold mb-3 line-clamp-2">{post.title}</h2>
                <p className="text-muted-foreground mb-4 line-clamp-3 leading-relaxed">{post.excerpt}</p>
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{post.date}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{post.readTime}</span>
                  </div>
                </div>
                <Button variant="ghost" className="w-full">
                  자세히 보기
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
