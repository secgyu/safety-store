from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, ConfigDict
from pydantic.alias_generators import to_camel  # Pydantic 내장 함수 사용


# 모든 스키마의 베이스 클래스 - 자동으로 camelCase 변환
class CamelBaseModel(BaseModel):
    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
        from_attributes=True,
        use_enum_values=True,
    )
    
    def model_dump(self, **kwargs):
        """기본적으로 by_alias=True로 직렬화"""
        kwargs.setdefault('by_alias', True)
        return super().model_dump(**kwargs)
    
    def model_dump_json(self, **kwargs):
        """기본적으로 by_alias=True로 JSON 직렬화"""
        kwargs.setdefault('by_alias', True)
        return super().model_dump_json(**kwargs)


# ========== User Schemas ==========
class UserRead(CamelBaseModel):
    id: int
    email: EmailStr
    name: str
    business_name: Optional[str] = None
    industry: Optional[str] = None
    created_at: datetime
    is_active: bool = True
    is_superuser: bool = False
    is_verified: bool = False


class UserCreate(CamelBaseModel):
    email: EmailStr
    password: str
    name: str
    business_name: Optional[str] = None
    industry: Optional[str] = None


class UserUpdate(CamelBaseModel):
    name: Optional[str] = None
    business_name: Optional[str] = None
    industry: Optional[str] = None
    password: Optional[str] = None


# ========== Auth Schemas ==========
class LoginRequest(CamelBaseModel):
    email: EmailStr
    password: str


class SignupRequest(CamelBaseModel):
    email: EmailStr
    password: str
    name: str
    business_name: Optional[str] = None
    industry: Optional[str] = None


class AuthResponse(CamelBaseModel):
    user: UserRead
    token: str


# ========== Diagnosis Schemas ==========
class DiagnosisRequest(CamelBaseModel):
    encoded_mct: str


class BusinessSearchResult(CamelBaseModel):
    encoded_mct: str
    name: str
    area: str
    business_type: str


class BusinessSearchResponse(CamelBaseModel):
    results: list[BusinessSearchResult]


class DiagnosisComponentScore(CamelBaseModel):
    score: float
    trend: str


class DiagnosisComponents(CamelBaseModel):
    sales: DiagnosisComponentScore
    customer: DiagnosisComponentScore
    market: DiagnosisComponentScore


class Recommendation(CamelBaseModel):
    title: str
    description: str
    priority: str


class DiagnosisResponse(CamelBaseModel):
    id: str
    overall_score: float
    risk_level: str
    components: DiagnosisComponents
    recommendations: list[Recommendation]
    insights: list[str]
    created_at: str
    ta_ym: Optional[str] = None
    revenue_ratio: Optional[float] = None  # 업종 평균 대비 매출 비율 (100% = 평균)


class DiagnosisHistory(CamelBaseModel):
    diagnoses: list[DiagnosisResponse]


# ========== Diagnosis Record Schemas (저장용) ==========
class DiagnosisRecordSimple(CamelBaseModel):
    """최근 진단 기록 (간단한 정보만)"""
    encoded_mct: str
    business_name: str
    created_at: str


class DiagnosisRecordListItem(CamelBaseModel):
    """진단 기록 목록 아이템"""
    id: int
    encoded_mct: str
    business_name: str
    created_at: str


class DiagnosisRecordList(CamelBaseModel):
    """사용자의 진단 기록 목록"""
    records: list[DiagnosisRecordListItem]
    total: int


# ========== Action Plan Schemas ==========
class ActionPlanItem(CamelBaseModel):
    id: str
    title: str
    description: str
    priority: str
    status: str
    due_date: Optional[str] = None


class ActionPlanRequest(CamelBaseModel):
    diagnosis_id: str
    items: list[ActionPlanItem]


class ActionPlan(CamelBaseModel):
    id: str
    user_id: int
    diagnosis_id: str
    items: list[ActionPlanItem]
    created_at: str
    updated_at: str


# ========== Benchmark Schemas ==========
class MetricValue(CamelBaseModel):
    average: float
    median: float


class BenchmarkMetrics(CamelBaseModel):
    revenue: MetricValue
    expenses: MetricValue
    customers: MetricValue
    profit_margin: MetricValue


class RiskDistribution(CamelBaseModel):
    GREEN: int
    YELLOW: int
    ORANGE: int
    RED: int


class BenchmarkData(CamelBaseModel):
    industry: str
    region: str
    average_risk_score: float
    metrics: BenchmarkMetrics
    risk_distribution: RiskDistribution


class CompareRequest(CamelBaseModel):
    industry: str
    revenue: float
    expenses: float
    customers: int
    risk_score: float


class ComparisonMetric(CamelBaseModel):
    user: float
    average: float
    difference: float


class ComparisonMetrics(CamelBaseModel):
    revenue: ComparisonMetric
    expenses: ComparisonMetric
    customers: ComparisonMetric


class CompareResponse(CamelBaseModel):
    user_score: float
    industry_average: float
    percentile: int
    comparison: ComparisonMetrics
    insights: list[str]


# ========== Scatter Plot Schemas ==========
class ScatterPoint(CamelBaseModel):
    merchant_id: str
    revenue: float  # 월평균 매출
    customers: float  # 월평균 고객수
    risk_score: float  # 위험도
    industry: str  # 업종명


class ScatterData(CamelBaseModel):
    points: list[ScatterPoint]
    industry: str
    total_count: int
    avg_revenue: float
    avg_customers: float
    avg_risk: float


# ========== Chat Schemas ==========
class ChatMessage(CamelBaseModel):
    role: str
    content: str


class ChatRequest(CamelBaseModel):
    messages: list[ChatMessage]
    context: Optional[dict] = None


class ChatResponse(CamelBaseModel):
    message: str


# ========== FAQ Schemas ==========
class FAQ(CamelBaseModel):
    id: str
    category: str
    question: str
    answer: str


# ========== Insight Schemas ==========
class Insight(CamelBaseModel):
    id: str
    industry: str
    title: str
    summary: str
    key_points: list[str]
    published_at: str


# ========== Notification Schemas ==========
class Notification(CamelBaseModel):
    id: str
    user_id: int
    title: str
    message: str
    type: str
    is_read: bool
    created_at: str


class NotificationSettings(CamelBaseModel):
    email_alerts: bool
    weekly_reports: bool
    risk_threshold: str


# ========== Statistics Schemas ==========
class IndustryStatistic(CamelBaseModel):
    industry: str
    count: int
    closure_rate: float


class TrendsData(CamelBaseModel):
    labels: list[str]
    openings: list[int]
    closures: list[int]


class Statistics(CamelBaseModel):
    total_businesses: int
    closure_rate: float
    average_survival_years: float
    by_industry: list[IndustryStatistic]
    trends: TrendsData


# ========== Success Story Schemas ==========
class SuccessStory(CamelBaseModel):
    id: str
    business_name: str
    industry: str
    location: str
    story: str
    before_score: float
    after_score: float
    improvements: list[str]
    testimonial: str
    image_url: str


# ========== Support Schemas ==========
class ContactRequest(CamelBaseModel):
    name: str
    email: EmailStr
    subject: str
    message: str


class ContactResponse(CamelBaseModel):
    success: bool
    id: str


# ========== Common Response Schemas ==========
class SuccessResponse(CamelBaseModel):
    success: bool


class UserResponse(CamelBaseModel):
    user: UserRead


class NotificationSettingsResponse(CamelBaseModel):
    success: bool
    settings: NotificationSettings


# ========== Error Response ==========
class ErrorResponse(CamelBaseModel):
    error: str

