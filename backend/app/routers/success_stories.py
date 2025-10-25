from fastapi import APIRouter
from app.schemas import SuccessStory


router = APIRouter()


mock_stories = [
    SuccessStory(
        id="1",
        business_name="행복한 카페",
        industry="음식점",
        location="서울 강남구",
        story="위기 진단 후 메뉴 개선과 SNS 마케팅으로 매출 150% 증가",
        before_score=45.0,
        after_score=78.0,
        improvements=["메뉴 단순화", "인스타그램 마케팅", "배달 서비스 도입"],
        testimonial="조기 경보 시스템 덕분에 위기를 기회로 바꿀 수 있었습니다.",
        image_url="/placeholder.svg",
    ),
    SuccessStory(
        id="2",
        business_name="스마트 편의점",
        industry="소매업",
        location="부산 해운대구",
        story="재고 관리 개선과 고객 분석으로 수익성 200% 향상",
        before_score=52.0,
        after_score=85.0,
        improvements=["POS 시스템 도입", "재고 최적화", "단골 고객 관리"],
        testimonial="데이터 기반 의사결정으로 완전히 달라졌습니다.",
        image_url="/placeholder.svg",
    ),
]


@router.get("", response_model=list[SuccessStory])
async def get_success_stories():
    """성공 사례 목록 조회"""
    return mock_stories

