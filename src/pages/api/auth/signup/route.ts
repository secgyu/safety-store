import { NextResponse } from "next/server"
import { createUser, findUserByEmail } from "@/lib/db"
import { hashPassword, createToken } from "@/lib/auth-utils"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password, name, businessName, industry } = body

    // 유효성 검사
    if (!email || !password || !name) {
      return NextResponse.json({ error: "필수 항목을 입력해주세요." }, { status: 400 })
    }

    // 이메일 중복 확인
    const existingUser = await findUserByEmail(email)
    if (existingUser) {
      return NextResponse.json({ error: "이미 사용 중인 이메일입니다." }, { status: 409 })
    }

    // 비밀번호 해시
    const hashedPassword = await hashPassword(password)

    // 사용자 생성
    const user = await createUser({
      email,
      password: hashedPassword,
      name,
      businessName,
      industry,
    })

    // JWT 토큰 생성
    const token = await createToken(user.id)

    // 비밀번호 제외하고 반환
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({
      user: userWithoutPassword,
      token,
    })
  } catch (error) {
    console.error("[v0] Signup error:", error)
    return NextResponse.json({ error: "회원가입 중 오류가 발생했습니다." }, { status: 500 })
  }
}
