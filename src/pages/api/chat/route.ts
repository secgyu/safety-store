import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"

export async function POST(req: NextRequest) {
  try {
    const { messages, context } = await req.json()

    // Build system prompt with context
    let systemPrompt = `당신은 한국의 자영업자를 위한 경영 컨설팅 AI 어시스턴트입니다.

역할:
- 자영업자의 경영 상태를 분석하고 실질적인 조언을 제공합니다
- 친근하고 이해하기 쉬운 한국어로 대화합니다
- 구체적이고 실행 가능한 개선 방안을 제시합니다
- 긍정적이면서도 현실적인 태도를 유지합니다

답변 스타일:
- 존댓말을 사용하되 너무 격식적이지 않게 합니다
- 복잡한 용어는 쉽게 풀어서 설명합니다
- 구체적인 예시와 수치를 활용합니다
- 3-5문장으로 간결하게 답변합니다`

    if (context) {
      systemPrompt += `\n\n현재 사용자의 진단 정보:
- 업종: ${context.industry || "정보 없음"}
- 영업 기간: ${context.businessPeriod || "정보 없음"}
- 최근 매출 변화: ${context.salesChange || "정보 없음"}
- 고객 수 변화: ${context.customerChange || "정보 없음"}
- 배달 매출 비중: ${context.deliveryRatio || "정보 없음"}

이 정보를 바탕으로 맞춤형 조언을 제공하세요.`
    }

    const { text } = await generateText({
      model: "openai/gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        ...messages.map((msg: { role: string; content: string }) => ({
          role: msg.role,
          content: msg.content,
        })),
      ],
      temperature: 0.7,
      maxOutputTokens: 500,
    })

    return NextResponse.json({ message: text })
  } catch (error) {
    console.error("[v0] Chat API error:", error)
    return NextResponse.json({ error: "Failed to generate response" }, { status: 500 })
  }
}
