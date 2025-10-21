import { type NextRequest, NextResponse } from "next/server"
import { updateActionPlan, deleteActionPlanItem } from "@/lib/db"
import { verifyAuth } from "@/lib/auth-utils"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = await verifyAuth(request)
    if (!userId) {
      return NextResponse.json({ error: "인증 필요" }, { status: 401 })
    }

    const body = await request.json()
    const updatedPlan = await updateActionPlan(params.id, body)

    if (!updatedPlan) {
      return NextResponse.json({ error: "개선 계획을 찾을 수 없습니다" }, { status: 404 })
    }

    return NextResponse.json(updatedPlan)
  } catch (error) {
    return NextResponse.json({ error: "개선 계획 업데이트 실패" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = await verifyAuth(request)
    if (!userId) {
      return NextResponse.json({ error: "인증 필요" }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const itemId = searchParams.get("itemId")

    if (!itemId) {
      return NextResponse.json({ error: "itemId 필요" }, { status: 400 })
    }

    const success = await deleteActionPlanItem(params.id, itemId)

    if (!success) {
      return NextResponse.json({ error: "삭제 실패" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "액션 아이템 삭제 실패" }, { status: 500 })
  }
}
