from fastapi import APIRouter
from typing import Optional
from app.schemas import BenchmarkData, CompareRequest, CompareResponse


router = APIRouter()


@router.get("", response_model=BenchmarkData)
async def get_benchmark(industry: Optional[str] = None, region: Optional[str] = None):
    """벤치마크 데이터 조회"""
    return BenchmarkData(
        industry=industry or "전체",
        region=region or "전국",
        average_risk_score=65.0,
        metrics={
            "revenue": {"average": 45000000, "median": 38000000},
            "expenses": {"average": 35000000, "median": 30000000},
            "customers": {"average": 850, "median": 720},
            "profit_margin": {"average": 22, "median": 21},
        },
        risk_distribution={
            "GREEN": 25,
            "YELLOW": 40,
            "ORANGE": 25,
            "RED": 10,
        },
    )


@router.post("/compare", response_model=CompareResponse)
async def compare_benchmark(request: CompareRequest):
    """벤치마크 비교 분석"""
    avg_revenue = 45000000
    avg_expenses = 35000000
    avg_customers = 850
    
    return CompareResponse(
        user_score=request.risk_score,
        industry_average=65.0,
        percentile=50,
        comparison={
            "revenue": {
                "user": request.revenue,
                "average": avg_revenue,
                "difference": ((request.revenue - avg_revenue) / avg_revenue) * 100,
            },
            "expenses": {
                "user": request.expenses,
                "average": avg_expenses,
                "difference": ((request.expenses - avg_expenses) / avg_expenses) * 100,
            },
            "customers": {
                "user": float(request.customers),
                "average": float(avg_customers),
                "difference": ((request.customers - avg_customers) / avg_customers) * 100,
            },
        },
        insights=[
            "귀하의 매출은 업종 평균과 유사합니다.",
            "비용 관리를 통해 수익성을 개선할 수 있습니다.",
        ],
    )

