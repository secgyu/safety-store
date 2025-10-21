import { type NextRequest, NextResponse } from "next/server"
import { findNotificationsByUserId } from "@/lib/db"
import { verifyAuth } from "@/lib/auth-utils"

export async function GET(request: NextRequest) {
  try {
    const userId = await verifyAuth(request)
    if (!userId) {
      return NextResponse.json({ error: "인증 필요" }, { status: 401 })
    }

    const notifications = await findNotificationsByUserId(userId)
    return NextResponse.json(notifications)
  } catch (error) {
    return NextResponse.json({ error: "알림 조회 실패" }, { status: 500 })
  }
}
