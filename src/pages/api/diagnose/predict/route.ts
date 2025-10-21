import { NextResponse } from "next/server"
import { generateText } from "ai"
import { createDiagnosis } from "@/lib/db"
import { cookies } from "next/headers"
import { verifyToken } from "@/lib/auth-utils"

export async function POST(request: Request) {
  try {
    // 인증 확인
    const cookieStore = await cookies()
    const token = cookieStore.get("auth_token")?.value

    let userId = "anonymous" // 비로그인 사용자도 진단 가능

    if (token) {
      const payload = await verifyToken(token)
      if (payload) {
        userId = payload.userId
      }
    }

    const body = await request.json()
    const { industry, yearsInBusiness, monthlyRevenue, monthlyExpenses, customerCount } = body

    // 유효성 검사
    if (!industry || yearsInBusiness === undefined || !monthlyRevenue || !monthlyExpenses || !customerCount) {
      return NextResponse.json({ error: "모든 필수 항목을 입력해주세요." }, { status: 400 })
    }

    // AI를 사용한 비즈니스 분석
    const prompt = `당신은 자영업 경영 컨설턴트입니다. 다음 비즈니스 데이터를 분석하여 위험도를 평가해주세요.

업종: ${industry}
운영 기간: ${yearsInBusiness}년
월 매출: ${monthlyRevenue.toLocaleString()}원
월 지출: ${monthlyExpenses.toLocaleString()}원
고객 수: ${customerCount}명

다음 형식의 JSON으로 응답해주세요:
{
  "overallScore": 0-100 사이의 점수 (높을수록 안전),
  "riskLevel": "GREEN" | "YELLOW" | "ORANGE" | "RED",
  "components": {
    "sales": { "score": 0-100, "trend": "설명" },
    "customer": { "score": 0-100, "trend": "설명" },
    "market": { "score": 0-100, "trend": "설명" }
  },
  "recommendations": [
    { "title": "제목", "description": "설명", "priority": "HIGH" | "MEDIUM" | "LOW" }
  ],
  "insights": ["인사이트1", "인사이트2", "인사이트3"]
}`

    const { text } = await generateText({
      model: "openai/gpt-4o-mini",
      prompt,
      maxOutputTokens: 1500,
      temperature: 0.7,
    })

    // JSON 파싱
    let result
    try {
      // JSON 블록 추출 (```json ... ``` 형식 처리)
      const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/\{[\s\S]*\}/)
      const jsonText = jsonMatch ? jsonMatch[1] || jsonMatch[0] : text
      result = JSON.parse(jsonText)
    } catch (parseError) {
      console.error("[v0] JSON parse error:", parseError)
      // 파싱 실패 시 기본값 반환
      result = {
        overallScore: 50,
        riskLevel: "YELLOW",
        components: {
          sales: { score: 50, trend: "분석 중 오류가 발생했습니다." },
          customer: { score: 50, trend: "분석 중 오류가 발생했습니다." },
          market: { score: 50, trend: "분석 중 오류가 발생했습니다." },
        },
        recommendations: [{ title: "재분석 필요", description: "데이터를 다시 확인해주세요.", priority: "MEDIUM" }],
        insights: ["분석 중 오류가 발생했습니다. 다시 시도해주세요."],
      }
    }

    // 진단 결과 저장
    const diagnosis = await createDiagnosis({
      userId,
      industry,
      yearsInBusiness,
      monthlyRevenue,
      monthlyExpenses,
      customerCount,
      result,
    })

    return NextResponse.json({
      id: diagnosis.id,
      ...result,
      createdAt: diagnosis.createdAt,
    })
  } catch (error) {
    console.error("[v0] Diagnosis error:", error)
    return NextResponse.json({ error: "진단 중 오류가 발생했습니다." }, { status: 500 })
  }
}
