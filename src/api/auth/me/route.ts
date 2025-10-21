import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { findUserById } from "@/lib/db"
import { verifyToken } from "@/lib/auth-utils"

export async function GET(request: Request) {
  try {
    // 쿠키에서 토큰 가져오기
    const cookieStore = await cookies()
    const token = cookieStore.get("auth_token")?.value

    if (!token) {
      return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 })
    }

    // 토큰 검증
    const payload = await verifyToken(token)
    if (!payload) {
      return NextResponse.json({ error: "유효하지 않은 토큰입니다." }, { status: 401 })
    }

    // 사용자 정보 조회
    const user = await findUserById(payload.userId)
    if (!user) {
      return NextResponse.json({ error: "사용자를 찾을 수 없습니다." }, { status: 404 })
    }

    // 비밀번호 제외하고 반환
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({ user: userWithoutPassword })
  } catch (error) {
    console.error("[v0] Get user error:", error)
    return NextResponse.json({ error: "사용자 정보 조회 중 오류가 발생했습니다." }, { status: 500 })
  }
}
