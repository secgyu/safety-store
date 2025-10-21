import { NextResponse } from "next/server"

export async function GET() {
  try {
    // 실제로는 데이터베이스에서 FAQ 조회
    const faqs = [
      {
        id: "1",
        category: "서비스 이용",
        question: "진단은 얼마나 자주 받아야 하나요?",
        answer: "최소 월 1회 진단을 권장합니다. 매출이나 비용에 큰 변화가 있을 때는 즉시 재진단하는 것이 좋습니다.",
      },
      {
        id: "2",
        category: "서비스 이용",
        question: "진단 결과는 얼마나 정확한가요?",
        answer:
          "AI 분석과 업종별 빅데이터를 기반으로 85% 이상의 정확도를 보입니다. 다만 참고 자료로 활용하시고, 중요한 결정은 전문가와 상담하시기 바랍니다.",
      },
      {
        id: "3",
        category: "요금",
        question: "서비스 이용료는 얼마인가요?",
        answer: "기본 진단은 무료입니다. 프리미엄 기능(상세 분석, 전문가 상담 등)은 월 29,000원부터 시작합니다.",
      },
      {
        id: "4",
        category: "데이터 보안",
        question: "내 사업 정보는 안전한가요?",
        answer: "모든 데이터는 암호화되어 저장되며, 개인정보보호법을 준수합니다. 제3자에게 공유되지 않습니다.",
      },
    ]

    return NextResponse.json(faqs)
  } catch (error) {
    return NextResponse.json({ error: "FAQ 조회 실패" }, { status: 500 })
  }
}
