import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { findDiagnosisByUserId } from "@/lib/db"
import { verifyToken } from "@/lib/auth-utils"

export async function GET(request: Request) {
  try {
    // 인증 확인
    const cookieStore = await cookies()
    const token = cookieStore.get("auth_token")?.value

    if (!token) {
      return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 })
    }

    const payload = await verifyToken(token)
    if (!payload) {
      return NextResponse.json({ error: "유효하지 않은 토큰입니다." }, { status: 401 })
    }

    // 사용자의 진단 기록 조회
    const diagnoses = await findDiagnosisByUserId(payload.userId)

    return NextResponse.json({ diagnoses })
  } catch (error) {
    console.error("[v0] Get history error:", error)
    return NextResponse.json({ error: "진단 기록 조회 중 오류가 발생했습니다." }, { status: 500 })
  }
}
