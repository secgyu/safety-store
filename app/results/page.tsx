"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Download, TrendingUp, Lightbulb, BarChart3, AlertCircle, MessageCircle, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { RiskGauge } from "@/components/risk-gauge"
import { RiskCard } from "@/components/risk-card"
import { ActionCard } from "@/components/action-card"
import { AppHeader } from "@/components/app-header"
import { Breadcrumb } from "@/components/breadcrumb"
import { generatePDFReport } from "@/lib/pdf-generator"
import { useToast } from "@/hooks/use-toast"

type AlertLevel = "GREEN" | "YELLOW" | "ORANGE" | "RED"

type ResultData = {
  p_final: number
  alert: AlertLevel
  risk_components: {
    sales_risk: number
    customer_risk: number
    market_risk: number
  }
  recommendations: Array<{
    title: string
    description: string
    priority: "high" | "medium" | "low"
  }>
}

export default function ResultsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [resultData, setResultData] = useState<ResultData | null>(null)
  const [diagnosisInfo, setDiagnosisInfo] = useState<any>(null)

  useEffect(() => {
    const diagnosisData = sessionStorage.getItem("diagnosisData")

    if (!diagnosisData) {
      router.push("/diagnose")
      return
    }

    const parsedData = JSON.parse(diagnosisData)
    setDiagnosisInfo(parsedData)

    const fetchResults = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1500))

        const mockResult: ResultData = {
          p_final: 25,
          alert: "YELLOW",
          risk_components: {
            sales_risk: 30,
            customer_risk: 25,
            market_risk: 20,
          },
          recommendations: [
            {
              title: "배달 서비스 확대를 고려해보세요",
              description:
                "배달 매출 비중이 낮습니다. 배달 앱 입점을 통해 추가 수익원을 확보하고 고객 접점을 늘릴 수 있습니다.",
              priority: "high",
            },
            {
              title: "단골 고객 관리 프로그램 도입",
              description: "고객 재방문율이 평균보다 낮습니다. 멤버십이나 포인트 제도를 통해 단골 고객을 확보하세요.",
              priority: "medium",
            },
            {
              title: "SNS 마케팅 강화",
              description: "온라인 홍보가 부족합니다. 인스타그램이나 네이버 블로그를 활용하여 신규 고객을 유치하세요.",
              priority: "medium",
            },
          ],
        }

        setResultData(mockResult)
        setLoading(false)
      } catch (error) {
        console.error("[v0] Error fetching results:", error)
        setLoading(false)
      }
    }

    fetchResults()
  }, [router])

  const getAlertInfo = (alert: AlertLevel) => {
    switch (alert) {
      case "GREEN":
        return { label: "안전", color: "text-success", description: "건강한 상태입니다" }
      case "YELLOW":
        return { label: "주의", color: "text-warning", description: "관심이 필요합니다" }
      case "ORANGE":
        return { label: "경고", color: "text-alert", description: "개선이 필요합니다" }
      case "RED":
        return { label: "위험", color: "text-danger", description: "즉시 조치가 필요합니다" }
    }
  }

  if (loading) {
    return (
      <>
        <AppHeader />
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-lg font-medium text-muted-foreground">분석 중입니다...</p>
            <p className="text-sm text-muted-foreground mt-2">잠시만 기다려주세요</p>
          </div>
        </div>
      </>
    )
  }

  if (!resultData) {
    return (
      <>
        <AppHeader />
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
          <Card className="max-w-md">
            <CardContent className="pt-6 text-center">
              <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-bold mb-2">결과를 불러올 수 없습니다</h2>
              <p className="text-muted-foreground mb-6">일시적인 오류가 발생했습니다. 다시 시도해주세요.</p>
              <Button asChild>
                <Link href="/diagnose">다시 진단하기</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </>
    )
  }

  const alertInfo = getAlertInfo(resultData.alert)

  const handleDownloadPDF = async () => {
    if (!resultData || !diagnosisInfo) {
      toast({
        title: "오류",
        description: "다운로드할 데이터가 없습니다.",
        variant: "destructive",
      })
      return
    }

    try {
      toast({
        title: "PDF 생성 중",
        description: "잠시만 기다려주세요...",
      })

      await generatePDFReport({
        businessName: diagnosisInfo.businessName || "내 가게",
        industry: diagnosisInfo.industry || "정보 없음",
        diagnosisDate: new Date().toLocaleDateString("ko-KR"),
        overallRisk: resultData.p_final,
        riskLevel: resultData.alert,
        salesRisk: resultData.risk_components.sales_risk,
        customerRisk: resultData.risk_components.customer_risk,
        marketRisk: resultData.risk_components.market_risk,
        revenue: diagnosisInfo.revenue || 0,
        customerCount: diagnosisInfo.customerCount || 0,
        operatingMonths: diagnosisInfo.operatingMonths || 0,
        recommendations: resultData.recommendations.map((rec) => ({
          title: rec.title,
          description: rec.description,
          priority: rec.priority.toUpperCase(),
        })),
      })

      toast({
        title: "다운로드 완료",
        description: "PDF 리포트가 다운로드되었습니다.",
      })
    } catch (error) {
      console.error("[v0] PDF generation error:", error)
      toast({
        title: "오류",
        description: "PDF 생성 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    }
  }

  return (
    <>
      <AppHeader />
      <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-white to-purple-50/30">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <Breadcrumb items={[{ label: "진단하기", href: "/diagnose" }, { label: "진단 결과" }]} />

          <Card className="mb-10 glass-card rounded-3xl">
            <CardContent className="pt-10 pb-10">
              <div className="flex flex-col md:flex-row items-center gap-10">
                <div className="flex-shrink-0">
                  <RiskGauge value={resultData.p_final} alert={resultData.alert} size="large" />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                    현재 위험도는 <span className={alertInfo.color}>'{alertInfo.label}'</span> 단계입니다
                  </h1>
                  <p className="text-xl text-muted-foreground mb-6">{alertInfo.description}</p>
                  <p className="text-lg text-muted-foreground">
                    우리 가게는 같은 업종 평균보다{" "}
                    <span className="font-semibold">{resultData.p_final > 20 ? "조금 낮은" : "양호한"}</span> 상태입니다
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="mb-10">
            <h2 className="text-3xl font-bold mb-8">상세 위험도 분석</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <RiskCard
                type="sales"
                value={resultData.risk_components.sales_risk}
                description="최근 매출이 평균보다 감소했어요"
              />
              <RiskCard
                type="customer"
                value={resultData.risk_components.customer_risk}
                description="고객 수가 소폭 감소하는 추세입니다"
              />
              <RiskCard
                type="market"
                value={resultData.risk_components.market_risk}
                description="지역 시장 경쟁이 증가하고 있습니다"
              />
            </div>
          </div>

          <div className="mb-10">
            <h2 className="text-3xl font-bold mb-8">맞춤 개선 제안</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resultData.recommendations.map((rec, index) => (
                <ActionCard
                  key={index}
                  title={rec.title}
                  description={rec.description}
                  priority={rec.priority}
                  onLearnMore={() => {
                    console.log("[v0] Learn more clicked:", rec.title)
                  }}
                />
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-4 justify-center mb-10">
            <Button asChild size="lg" className="gap-2 rounded-2xl shadow-lg hover:shadow-xl transition-all">
              <Link href="/action-plan">
                <Lightbulb className="h-5 w-5" />
                개선 계획 수립
              </Link>
            </Button>
            <Button asChild size="lg" className="gap-2 rounded-2xl shadow-lg hover:shadow-xl transition-all">
              <Link href="/consultation">
                <MessageCircle className="h-5 w-5" />
                AI 상담 받기
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="gap-2 glass-hover rounded-2xl bg-transparent">
              <Link href="/notifications">
                <Bell className="h-5 w-5" />
                알림 센터
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="gap-2 glass-hover rounded-2xl bg-transparent"
              onClick={handleDownloadPDF}
            >
              <Download className="h-5 w-5" />
              상세 보고서 다운로드
            </Button>
            <Button asChild size="lg" variant="outline" className="gap-2 glass-hover rounded-2xl bg-transparent">
              <Link href="/compare">
                <BarChart3 className="h-5 w-5" />
                다른 업종과 비교하기
              </Link>
            </Button>
            <Button asChild size="lg" variant="secondary" className="gap-2 rounded-3xl">
              <Link href="/dashboard">
                <TrendingUp className="h-5 w-5" />
                정기 모니터링 설정
              </Link>
            </Button>
          </div>

          <Card className="glass-card rounded-3xl">
            <CardContent className="pt-8 pb-8">
              <div className="flex gap-4">
                <Lightbulb className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg mb-3">진단 결과를 저장하고 싶으신가요?</h3>
                  <p className="text-base text-muted-foreground mb-6">
                    회원가입 후 대시보드에서 과거 진단 기록을 확인하고 추세를 분석할 수 있습니다.
                  </p>
                  <Button asChild variant="default" size="sm" className="rounded-xl">
                    <Link href="/dashboard">대시보드로 이동</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
