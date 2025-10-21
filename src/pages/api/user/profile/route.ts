import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { findUserById, updateUser } from "@/lib/db"
import { verifyToken } from "@/lib/auth-utils"

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("auth_token")?.value

    if (!token) {
      return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 })
    }

    const payload = await verifyToken(token)
    if (!payload) {
      return NextResponse.json({ error: "유효하지 않은 토큰입니다." }, { status: 401 })
    }

    const user = await findUserById(payload.userId)
    if (!user) {
      return NextResponse.json({ error: "사용자를 찾을 수 없습니다." }, { status: 404 })
    }

    const { password: _, ...userWithoutPassword } = user
    return NextResponse.json({ user: userWithoutPassword })
  } catch (error) {
    console.error("[v0] Get profile error:", error)
    return NextResponse.json({ error: "프로필 조회 중 오류가 발생했습니다." }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("auth_token")?.value

    if (!token) {
      return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 })
    }

    const payload = await verifyToken(token)
    if (!payload) {
      return NextResponse.json({ error: "유효하지 않은 토큰입니다." }, { status: 401 })
    }

    const body = await request.json()
    const { name, businessName, industry } = body

    const updatedUser = await updateUser(payload.userId, {
      name,
      businessName,
      industry,
    })

    if (!updatedUser) {
      return NextResponse.json({ error: "사용자를 찾을 수 없습니다." }, { status: 404 })
    }

    const { password: _, ...userWithoutPassword } = updatedUser
    return NextResponse.json({ user: userWithoutPassword })
  } catch (error) {
    console.error("[v0] Update profile error:", error)
    return NextResponse.json({ error: "프로필 수정 중 오류가 발생했습니다." }, { status: 500 })
  }
}
