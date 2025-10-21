import { type NextRequest, NextResponse } from "next/server"
import { createActionPlan, findActionPlanByUserId } from "@/lib/db"
import { verifyAuth } from "@/lib/auth-utils"

export async function GET(request: NextRequest) {
  try {
    const userId = await verifyAuth(request)
    if (!userId) {
      return NextResponse.json({ error: "인증 필요" }, { status: 401 })
    }

    const actionPlans = await findActionPlanByUserId(userId)
    return NextResponse.json(actionPlans)
  } catch (error) {
    return NextResponse.json({ error: "개선 계획 조회 실패" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await verifyAuth(request)
    if (!userId) {
      return NextResponse.json({ error: "인증 필요" }, { status: 401 })
    }

    const body = await request.json()
    const { diagnosisId, items } = body

    const actionPlan = await createActionPlan({
      userId,
      diagnosisId,
      items,
    })

    return NextResponse.json(actionPlan, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "개선 계획 생성 실패" }, { status: 500 })
  }
}
