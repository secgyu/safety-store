import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const industry = searchParams.get("industry")

    // 실제로는 데이터베이스에서 업종별 인사이트 조회
    const insights = [
      {
        id: "1",
        industry: industry || "전체",
        title: "2024년 자영업 트렌드 분석",
        summary: "디지털 전환과 배달 서비스 확대가 주요 트렌드",
        keyPoints: [
          "온라인 주문 시스템 도입 업체 45% 증가",
          "배달 매출 비중 평균 32%로 상승",
          "SNS 마케팅 활용도 68% 증가",
        ],
        publishedAt: "2024-01-15",
      },
      {
        id: "2",
        industry: industry || "전체",
        title: "성공하는 자영업자의 공통점",
        summary: "데이터 기반 의사결정과 고객 관리가 핵심",
        keyPoints: ["월 단위 재무 분석 실시", "고객 데이터베이스 체계적 관리", "정기적인 메뉴/서비스 개선"],
        publishedAt: "2024-01-10",
      },
    ]

    return NextResponse.json(insights)
  } catch (error) {
    return NextResponse.json({ error: "인사이트 조회 실패" }, { status: 500 })
  }
}
