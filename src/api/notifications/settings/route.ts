import { type NextRequest, NextResponse } from "next/server"
import { updateUser } from "@/lib/db"
import { verifyAuth } from "@/lib/auth-utils"

export async function PUT(request: NextRequest) {
  try {
    const userId = await verifyAuth(request)
    if (!userId) {
      return NextResponse.json({ error: "인증 필요" }, { status: 401 })
    }

    const body = await request.json()
    const { emailAlerts, weeklyReports, riskThreshold } = body

    // 실제로는 별도 settings 테이블에 저장
    const updatedUser = await updateUser(userId, {
      // settings를 User 인터페이스에 추가하거나 별도 테이블 사용
    } as any)

    return NextResponse.json({ success: true, settings: body })
  } catch (error) {
    return NextResponse.json({ error: "알림 설정 업데이트 실패" }, { status: 500 })
  }
}
