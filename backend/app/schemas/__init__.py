from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr


# ========== User Schemas ==========
class UserRead(BaseModel):
    id: int
    email: EmailStr
    name: str
    business_name: Optional[str] = None
    industry: Optional[str] = None
    created_at: datetime
    is_active: bool = True
    is_superuser: bool = False
    is_verified: bool = False


class UserCreate(BaseModel):
    email: EmailStr
    password: str
    name: str
    business_name: Optional[str] = None
    industry: Optional[str] = None


class UserUpdate(BaseModel):
    name: Optional[str] = None
    business_name: Optional[str] = None
    industry: Optional[str] = None
    password: Optional[str] = None


# ========== Auth Schemas ==========
class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class SignupRequest(BaseModel):
    email: EmailStr
    password: str
    name: str
    business_name: Optional[str] = None
    industry: Optional[str] = None


class AuthResponse(BaseModel):
    user: UserRead
    token: str


# ========== Diagnosis Schemas ==========
class DiagnosisRequest(BaseModel):
    encoded_mct: str


class DiagnosisComponentScore(BaseModel):
    score: float
    trend: str


class DiagnosisComponents(BaseModel):
    sales: DiagnosisComponentScore
    customer: DiagnosisComponentScore
    market: DiagnosisComponentScore


class Recommendation(BaseModel):
    title: str
    description: str
    priority: str


class DiagnosisResponse(BaseModel):
    id: str
    overall_score: float
    risk_level: str
    components: DiagnosisComponents
    recommendations: list[Recommendation]
    insights: list[str]
    created_at: str
    ta_ym: Optional[str] = None


class DiagnosisHistory(BaseModel):
    diagnoses: list[DiagnosisResponse]


# ========== Action Plan Schemas ==========
class ActionPlanItem(BaseModel):
    id: str
    title: str
    description: str
    priority: str
    status: str
    due_date: Optional[str] = None


class ActionPlanRequest(BaseModel):
    diagnosis_id: str
    items: list[ActionPlanItem]


class ActionPlan(BaseModel):
    id: str
    user_id: int
    diagnosis_id: str
    items: list[ActionPlanItem]
    created_at: str
    updated_at: str


# ========== Benchmark Schemas ==========
class MetricValue(BaseModel):
    average: float
    median: float


class BenchmarkMetrics(BaseModel):
    revenue: MetricValue
    expenses: MetricValue
    customers: MetricValue
    profit_margin: MetricValue


class RiskDistribution(BaseModel):
    GREEN: int
    YELLOW: int
    ORANGE: int
    RED: int


class BenchmarkData(BaseModel):
    industry: str
    region: str
    average_risk_score: float
    metrics: BenchmarkMetrics
    risk_distribution: RiskDistribution


class CompareRequest(BaseModel):
    industry: str
    revenue: float
    expenses: float
    customers: int
    risk_score: float


class ComparisonMetric(BaseModel):
    user: float
    average: float
    difference: float


class ComparisonMetrics(BaseModel):
    revenue: ComparisonMetric
    expenses: ComparisonMetric
    customers: ComparisonMetric


class CompareResponse(BaseModel):
    user_score: float
    industry_average: float
    percentile: int
    comparison: ComparisonMetrics
    insights: list[str]


# ========== Blog Schemas ==========
class BlogPost(BaseModel):
    id: str
    title: str
    content: str
    excerpt: str
    author: str
    published_at: str
    tags: list[str]
    image_url: str


# ========== Chat Schemas ==========
class ChatMessage(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    messages: list[ChatMessage]
    context: Optional[dict] = None


class ChatResponse(BaseModel):
    message: str


# ========== FAQ Schemas ==========
class FAQ(BaseModel):
    id: str
    category: str
    question: str
    answer: str


# ========== Insight Schemas ==========
class Insight(BaseModel):
    id: str
    industry: str
    title: str
    summary: str
    key_points: list[str]
    published_at: str


# ========== Notification Schemas ==========
class Notification(BaseModel):
    id: str
    user_id: int
    title: str
    message: str
    type: str
    is_read: bool
    created_at: str


class NotificationSettings(BaseModel):
    email_notifications: bool
    push_notifications: bool
    risk_alerts: bool


# ========== Statistics Schemas ==========
class IndustryStatistic(BaseModel):
    industry: str
    count: int
    closure_rate: float


class TrendsData(BaseModel):
    labels: list[str]
    openings: list[int]
    closures: list[int]


class Statistics(BaseModel):
    total_businesses: int
    closure_rate: float
    average_survival_years: float
    by_industry: list[IndustryStatistic]
    trends: TrendsData


# ========== Success Story Schemas ==========
class SuccessStory(BaseModel):
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
class ContactRequest(BaseModel):
    name: str
    email: EmailStr
    subject: str
    message: str


class ContactResponse(BaseModel):
    success: bool
    id: str


# ========== Error Response ==========
class ErrorResponse(BaseModel):
    error: str

