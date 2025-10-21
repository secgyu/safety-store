import { NextResponse } from "next/server"

export async function GET() {
  try {
    // 실제로는 데이터베이스에서 통계 데이터 조회
    const statistics = {
      totalBusinesses: 6850000,
      closureRate: 23.5,
      averageSurvivalYears: 5.2,
      byIndustry: [
        { industry: "음식점", count: 685000, closureRate: 28.3 },
        { industry: "소매업", count: 548000, closureRate: 25.1 },
        { industry: "서비스업", count: 412000, closureRate: 21.7 },
        { industry: "도소매", count: 356000, closureRate: 19.8 },
      ],
      trends: {
        labels: ["2020", "2021", "2022", "2023", "2024"],
        openings: [520000, 485000, 512000, 498000, 505000],
        closures: [145000, 138000, 152000, 148000, 155000],
      },
    }

    return NextResponse.json(statistics)
  } catch (error) {
    return NextResponse.json({ error: "통계 조회 실패" }, { status: 500 })
  }
}
