from fastapi import APIRouter
from app.schemas import FAQ


router = APIRouter()


mock_faqs = [
    FAQ(
        id="1",
        category="서비스 이용",
        question="진단은 얼마나 자주 받아야 하나요?",
        answer="최소 월 1회 진단을 권장합니다. 매출이나 비용에 큰 변화가 있을 때는 즉시 재진단하는 것이 좋습니다.",
    ),
    FAQ(
        id="2",
        category="서비스 이용",
        question="진단 결과는 얼마나 정확한가요?",
        answer="AI 분석과 업종별 빅데이터를 기반으로 85% 이상의 정확도를 보입니다.",
    ),
    FAQ(
        id="3",
        category="요금",
        question="서비스 이용료는 얼마인가요?",
        answer="진단은 무료입니다. 회원가입 후 바로 진단을 받을 수 있습니다.",
    ),
    FAQ(
        id="4",
        category="데이터 보안",
        question="내 사업 정보는 안전한가요?",
        answer="모든 데이터는 암호화되어 저장되며, 개인정보보호법을 준수합니다.",
    ),
]


@router.get("", response_model=list[FAQ])
async def get_faqs():
    """FAQ 목록 조회"""
    return mock_faqs

