from fastapi import APIRouter, HTTPException
from openai import AsyncOpenAI
from app.schemas import ChatRequest, ChatResponse
from app.config import settings


router = APIRouter()

# OpenAI 클라이언트 초기화
client = AsyncOpenAI(api_key=settings.openai_api_key)


@router.post("", response_model=ChatResponse)
async def send_chat_message(request: ChatRequest):
    """챗봇 메시지 전송 - OpenAI GPT 사용"""
    try:
        # 시스템 프롬프트 구성
        system_prompt = """당신은 자영업자를 위한 경영 상담 AI 어시스턴트입니다.
사용자의 사업 진단 결과를 바탕으로 구체적이고 실용적인 조언을 제공합니다.

다음 가이드라인을 따라주세요:
1. 친근하고 공감적인 태도로 대화하세요
2. 전문적이지만 쉽게 이해할 수 있는 언어를 사용하세요
3. 구체적인 실행 방법과 예시를 제공하세요
4. 긍정적이고 격려하는 톤을 유지하세요
5. 한국의 자영업 환경과 문화를 고려하세요"""

        # 진단 컨텍스트가 있으면 추가
        if request.context:
            context_info = f"\n\n[사용자 사업 진단 정보]\n"
            if "overall_score" in request.context:
                context_info += f"- 종합 위험도: {request.context['overall_score']}\n"
            if "risk_level" in request.context:
                context_info += f"- 위험 수준: {request.context['risk_level']}\n"
            if "components" in request.context:
                components = request.context["components"]
                if "sales" in components:
                    context_info += f"- 매출 점수: {components['sales'].get('score', 'N/A')}\n"
                if "customer" in components:
                    context_info += f"- 고객 점수: {components['customer'].get('score', 'N/A')}\n"
                if "market" in components:
                    context_info += f"- 시장 점수: {components['market'].get('score', 'N/A')}\n"
            system_prompt += context_info

        # 메시지 변환
        messages = [
            {"role": "system", "content": system_prompt}
        ] + [
            {"role": msg.role, "content": msg.content}
            for msg in request.messages
        ]

        # OpenAI API 호출
        response = await client.chat.completions.create(
            model="gpt-4o-mini",  # 또는 "gpt-3.5-turbo"
            messages=messages,
            temperature=0.7,
            max_tokens=1000,
        )

        assistant_message = response.choices[0].message.content

        return ChatResponse(message=assistant_message)

    except Exception as e:
        import traceback
        error_details = traceback.format_exc()
        print(f"OpenAI API Error: {str(e)}")
        print(f"Full traceback: {error_details}")
        raise HTTPException(
            status_code=500,
            detail=f"AI 응답 생성 중 오류가 발생했습니다: {str(e)}"
        )

