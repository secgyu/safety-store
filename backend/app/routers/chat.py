from fastapi import APIRouter
from app.schemas import ChatRequest, ChatResponse


router = APIRouter()


@router.post("", response_model=ChatResponse)
async def send_chat_message(request: ChatRequest):
    """챗봇 메시지 전송"""
    last_message = request.messages[-1].content if request.messages else ""
    
    return ChatResponse(
        message=f"{last_message}에 대한 답변입니다. 자영업 경영에서 이 부분은 매우 중요합니다. "
                f"구체적인 상황에 맞춰 조언을 드리자면, 우선 현재 상황을 정확히 파악하는 것이 중요합니다."
    )

