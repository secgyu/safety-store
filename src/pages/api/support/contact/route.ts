import { type NextRequest, NextResponse } from "next/server"
import { createContactMessage } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, subject, message } = body

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "모든 필드를 입력해주세요" }, { status: 400 })
    }

    const contactMessage = await createContactMessage({
      name,
      email,
      subject,
      message,
    })

    // 실제로는 이메일 발송 또는 알림 시스템 연동
    return NextResponse.json({ success: true, id: contactMessage.id }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "문의 제출 실패" }, { status: 500 })
  }
}
