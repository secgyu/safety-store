import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { industry, revenue, expenses, customers, riskScore } = body

    // 실제로는 데이터베이스에서 업종 평균 조회 후 비교
    const comparison = {
      userScore: riskScore,
      industryAverage: 65,
      percentile: Math.floor(Math.random() * 100), // 실제로는 계산
      comparison: {
        revenue: {
          user: revenue,
          average: 45000000,
          difference: ((revenue - 45000000) / 45000000) * 100,
        },
        expenses: {
          user: expenses,
          average: 35000000,
          difference: ((expenses - 35000000) / 35000000) * 100,
        },
        customers: {
          user: customers,
          average: 850,
          difference: ((customers - 850) / 850) * 100,
        },
      },
      insights: ["귀하의 매출은 업종 평균보다 높습니다.", "고객 수가 평균 이하입니다. 마케팅 강화가 필요합니다."],
    }

    return NextResponse.json(comparison)
  } catch (error) {
    return NextResponse.json({ error: "비교 분석 실패" }, { status: 500 })
  }
}
