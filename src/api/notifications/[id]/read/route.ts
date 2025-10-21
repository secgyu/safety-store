import { type NextRequest, NextResponse } from "next/server"
import { markNotificationAsRead } from "@/lib/db"
import { verifyAuth } from "@/lib/auth-utils"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = await verifyAuth(request)
    if (!userId) {
      return NextResponse.json({ error: "인증 필요" }, { status: 401 })
    }

    const success = await markNotificationAsRead(params.id)

    if (!success) {
      return NextResponse.json({ error: "알림을 찾을 수 없습니다" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "알림 읽음 처리 실패" }, { status: 500 })
  }
}
