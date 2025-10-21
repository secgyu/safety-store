import { NextResponse } from "next/server"
import { findAllBlogPosts } from "@/lib/db"

export async function GET() {
  try {
    const posts = await findAllBlogPosts()
    return NextResponse.json(posts)
  } catch (error) {
    return NextResponse.json({ error: "블로그 조회 실패" }, { status: 500 })
  }
}
