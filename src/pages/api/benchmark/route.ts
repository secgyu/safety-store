import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const industry = searchParams.get("industry")
    const region = searchParams.get("region")

    // 실제로는 데이터베이스에서 조회
    const benchmarkData = {
      industry: industry || "전체",
      region: region || "전국",
      averageRiskScore: 65,
      metrics: {
        revenue: { average: 45000000, median: 38000000 },
        expenses: { average: 35000000, median: 30000000 },
        customers: { average: 850, median: 720 },
        profitMargin: { average: 22, median: 21 },
      },
      riskDistribution: {
        GREEN: 25,
        YELLOW: 40,
        ORANGE: 25,
        RED: 10,
      },
    }

    return NextResponse.json(benchmarkData)
  } catch (error) {
    return NextResponse.json({ error: "벤치마크 데이터 조회 실패" }, { status: 500 })
  }
}
