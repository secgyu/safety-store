from fastapi import APIRouter, HTTPException
from typing import Optional
from app.schemas import BenchmarkData, CompareRequest, CompareResponse, ScatterData
from app.services.benchmark_calculator import BenchmarkCalculator, map_industry_code

router = APIRouter()

# 전역으로 계산기 인스턴스 생성 (앱 시작 시 한 번만 로드)
print("[INFO] 벤치마크 계산기 초기화 중...")
benchmark_calc = BenchmarkCalculator()
if benchmark_calc.load_data():
    benchmark_calc.calculate_industry_benchmarks(recent_months=6)
    print("[OK] 벤치마크 데이터 로드 완료")
else:
    print("[WARN] 벤치마크 데이터 로드 실패 - 기본값 사용")
    benchmark_calc = None


@router.get("", response_model=BenchmarkData)
async def get_benchmark(industry: Optional[str] = None, region: Optional[str] = None):
    """실제 데이터 기반 벤치마크 조회"""
    
    # 요청 로깅
    print(f"[API] GET /api/benchmark - industry: {industry}, region: {region}")
    
    # 프론트엔드 코드를 실제 업종명으로 변환
    if industry:
        mapped_industry = map_industry_code(industry)
        print(f"[MAPPING] '{industry}' -> '{mapped_industry}'")
    else:
        mapped_industry = None
    
    # 데이터가 로드되지 않았으면 기본값 반환
    if benchmark_calc is None or benchmark_calc.industry_stats is None:
        print("[WARN] 벤치마크 데이터가 로드되지 않아 기본값을 반환합니다.")
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
    
    # 실제 데이터에서 벤치마크 가져오기
    benchmark = benchmark_calc.get_benchmark_for_industry(
        industry or "전체",
        base_revenue=50000000,  # 5천만원 기준
        base_customers=1000      # 1000명 기준
    )
    
    print(f"[OK] 업종: {benchmark['industry']}, 평균 위험도: {benchmark['average_risk_score']:.2f}")
    
    return BenchmarkData(
        industry=industry or "전체",
        region=region or "전국",
        average_risk_score=benchmark["average_risk_score"],
        metrics={
            "revenue": {
                "average": benchmark["average_revenue"],
                "median": benchmark["median_revenue"]
            },
            "expenses": {
                "average": int(benchmark["average_revenue"] * 0.75),  # 매출의 75%로 추정
                "median": int(benchmark["median_revenue"] * 0.75)
            },
            "customers": {
                "average": benchmark["average_customers"],
                "median": benchmark["median_customers"]
            },
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
    """벤치마크 비교 분석 - 실제 데이터 기반"""
    
    # 요청 로깅
    print(f"[API] POST /api/benchmark/compare - industry: {request.industry}, risk_score: {request.risk_score}")
    
    # 프론트엔드 코드를 실제 업종명으로 변환
    mapped_industry = map_industry_code(request.industry)
    print(f"[MAPPING] '{request.industry}' -> '{mapped_industry}'")
    
    # 실제 데이터가 없으면 기본값 사용
    if benchmark_calc is None or benchmark_calc.industry_stats is None:
        print("[WARN] 벤치마크 데이터가 없어 기본값 사용")
        avg_revenue = 45000000
        avg_customers = 850
        industry_avg_risk = 65.0
    else:
        # 실제 업종 데이터 가져오기
        benchmark = benchmark_calc.get_benchmark_for_industry(
            request.industry,  # 매핑은 get_benchmark_for_industry 내부에서 처리됨
            base_revenue=50000000,
            base_customers=1000
        )
        avg_revenue = benchmark["average_revenue"]
        avg_customers = benchmark["average_customers"]
        industry_avg_risk = benchmark["average_risk_score"]
        print(f"[OK] 업종 평균 - 매출: {avg_revenue:,}원, 고객수: {avg_customers}명, 위험도: {industry_avg_risk:.2f}")
    
    # 비용은 요청에서 받거나 매출의 75%로 추정
    avg_expenses = int(avg_revenue * 0.75)
    
    # 백분위 계산 (위험도 기반)
    score_diff = request.risk_score - industry_avg_risk
    if score_diff <= -10:
        percentile = 20
    elif score_diff <= -5:
        percentile = 35
    elif score_diff <= 0:
        percentile = 50
    elif score_diff <= 5:
        percentile = 65
    else:
        percentile = 80
    
    # 인사이트 생성
    insights = []
    
    revenue_diff = ((request.revenue - avg_revenue) / avg_revenue) * 100
    if abs(revenue_diff) < 5:
        insights.append("귀하의 매출은 업종 평균과 유사합니다.")
    elif revenue_diff > 0:
        insights.append(f"귀하의 매출은 업종 평균보다 {revenue_diff:.1f}% 높습니다.")
    else:
        insights.append(f"귀하의 매출은 업종 평균보다 {abs(revenue_diff):.1f}% 낮습니다. 매출 증대 전략이 필요합니다.")
    
    expense_ratio = (request.expenses / request.revenue) * 100
    avg_expense_ratio = (avg_expenses / avg_revenue) * 100
    if expense_ratio > avg_expense_ratio + 5:
        insights.append("비용 비율이 업종 평균보다 높습니다. 비용 관리를 통해 수익성을 개선할 수 있습니다.")
    elif expense_ratio < avg_expense_ratio - 5:
        insights.append("효율적인 비용 관리를 하고 계십니다.")
    
    if request.risk_score > industry_avg_risk:
        insights.append(f"위험도가 업종 평균보다 {request.risk_score - industry_avg_risk:.1f}점 높습니다. 개선 조치가 필요합니다.")
    else:
        insights.append("위험도가 업종 평균 이하로 양호한 상태입니다.")
    
    print(f"[OK] 비교 완료 - 백분위: {percentile}%, 인사이트 {len(insights)}개 생성")
    
    return CompareResponse(
        user_score=request.risk_score,
        industry_average=industry_avg_risk,
        percentile=percentile,
        comparison={
            "revenue": {
                "user": request.revenue,
                "average": avg_revenue,
                "difference": revenue_diff,
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
        insights=insights,
    )


@router.get("/scatter-data", response_model=ScatterData)
async def get_scatter_data(industry: Optional[str] = None, limit: Optional[int] = 500):
    """
    특정 업종의 개별 가게 데이터를 반환 (산점도용)
    - industry: 업종 코드 (restaurant, cafe 등)
    - limit: 반환할 최대 데이터 수 (기본 500개, 성능 최적화)
    """
    print(f"[API] GET /api/benchmark/scatter-data - industry: {industry}, limit: {limit}")
    
    if benchmark_calc is None or benchmark_calc.merged_df is None:
        raise HTTPException(status_code=503, detail="벤치마크 데이터가 로드되지 않았습니다.")
    
    # 프론트엔드 코드를 실제 업종명으로 변환
    if industry:
        mapped_industry = map_industry_code(industry)
        print(f"[MAPPING] '{industry}' -> '{mapped_industry}'")
    else:
        mapped_industry = None
    
    try:
        scatter_data = benchmark_calc.get_scatter_data(mapped_industry, limit)
        print(f"[OK] 산점도 데이터 반환 완료: {len(scatter_data['points'])}개 점")
        return scatter_data
    except Exception as e:
        print(f"[ERROR] 산점도 데이터 조회 실패: {str(e)}")
        raise HTTPException(status_code=500, detail=f"데이터 조회 실패: {str(e)}")

