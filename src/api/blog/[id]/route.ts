import { type NextRequest, NextResponse } from "next/server"
import { findBlogPostById } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const post = await findBlogPostById(params.id)

    if (!post) {
      return NextResponse.json({ error: "블로그 포스트를 찾을 수 없습니다" }, { status: 404 })
    }

    return NextResponse.json(post)
  } catch (error) {
    return NextResponse.json({ error: "블로그 조회 실패" }, { status: 500 })
  }
}
