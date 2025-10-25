from fastapi import APIRouter
from app.schemas import Statistics


router = APIRouter()


@router.get("", response_model=Statistics)
async def get_statistics():
    """통계 데이터 조회"""
    return Statistics(
        total_businesses=6850000,
        closure_rate=23.5,
        average_survival_years=5.2,
        by_industry=[
            {"industry": "음식점", "count": 685000, "closure_rate": 28.3},
            {"industry": "소매업", "count": 548000, "closure_rate": 25.1},
            {"industry": "서비스업", "count": 412000, "closure_rate": 21.7},
            {"industry": "도소매", "count": 356000, "closure_rate": 19.8},
        ],
        trends={
            "labels": ["2020", "2021", "2022", "2023", "2024"],
            "openings": [520000, 485000, 512000, 498000, 505000],
            "closures": [145000, 138000, 152000, 148000, 155000],
        },
    )

