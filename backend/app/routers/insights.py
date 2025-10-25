from fastapi import APIRouter
from typing import Optional
from app.schemas import Insight


router = APIRouter()


@router.get("", response_model=list[Insight])
async def get_insights(industry: Optional[str] = None):
    """인사이트 목록 조회"""
    return [
        Insight(
            id="1",
            industry=industry or "전체",
            title="2024년 자영업 트렌드 분석",
            summary="디지털 전환과 배달 서비스 확대가 주요 트렌드",
            key_points=[
                "온라인 주문 시스템 도입 업체 45% 증가",
                "배달 매출 비중 평균 32%로 상승",
                "SNS 마케팅 활용도 68% 증가",
            ],
            published_at="2024-01-15",
        ),
        Insight(
            id="2",
            industry=industry or "전체",
            title="성공하는 자영업자의 공통점",
            summary="데이터 기반 의사결정과 고객 관리가 핵심",
            key_points=[
                "월 단위 재무 분석 실시",
                "고객 데이터베이스 체계적 관리",
                "정기적인 메뉴/서비스 개선",
            ],
            published_at="2024-01-10",
        ),
    ]

