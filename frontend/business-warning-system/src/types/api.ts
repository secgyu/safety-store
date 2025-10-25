// API 요청/응답 타입 정의

// Auth Types
export interface LoginRequest {
  email: string
  password: string
}

export interface SignupRequest {
  email: string
  password: string
  name: string
  businessName?: string
  industry?: string
}

export interface AuthResponse {
  user: User
  token: string
}

export interface User {
  id: string
  email: string
  name: string
  businessName?: string
  industry?: string
  createdAt: string
}

// Diagnosis Types
export interface DiagnosisRequest {
  industry: string
  yearsInBusiness: number
  monthlyRevenue: number
  monthlyExpenses: number
  customerCount: number
}

export interface DiagnosisResponse {
  id: string
  overallScore: number
  riskLevel: "GREEN" | "YELLOW" | "ORANGE" | "RED"
  components: {
    sales: { score: number; trend: string }
    customer: { score: number; trend: string }
    market: { score: number; trend: string }
  }
  recommendations: Recommendation[]
  insights: string[]
  createdAt: string
}

export interface Recommendation {
  title: string
  description: string
  priority: "HIGH" | "MEDIUM" | "LOW"
}

export interface DiagnosisHistory {
  diagnoses: DiagnosisResponse[]
}

// Action Plan Types
export interface ActionPlanRequest {
  diagnosisId: string
  items: ActionPlanItem[]
}

export interface ActionPlanItem {
  id: string
  title: string
  description: string
  priority: "HIGH" | "MEDIUM" | "LOW"
  status: "pending" | "in_progress" | "completed"
  dueDate?: string
}

export interface ActionPlan {
  id: string
  userId: string
  diagnosisId: string
  items: ActionPlanItem[]
  createdAt: string
  updatedAt: string
}

// Chat Types
export interface ChatMessage {
  role: "user" | "assistant" | "system"
  content: string
}

export interface ChatRequest {
  messages: ChatMessage[]
  context?: {
    industry?: string
    businessPeriod?: string
    salesChange?: string
    customerChange?: string
    deliveryRatio?: string
  }
}

export interface ChatResponse {
  message: string
}

// Blog Types
export interface BlogPost {
  id: string
  title: string
  content: string
  excerpt: string
  author: string
  publishedAt: string
  tags: string[]
  imageUrl?: string
}

// Benchmark Types
export interface BenchmarkData {
  industry: string
  region: string
  averageRiskScore: number
  metrics: {
    revenue: { average: number; median: number }
    expenses: { average: number; median: number }
    customers: { average: number; median: number }
    profitMargin: { average: number; median: number }
  }
  riskDistribution: {
    GREEN: number
    YELLOW: number
    ORANGE: number
    RED: number
  }
}

export interface CompareRequest {
  industry: string
  revenue: number
  expenses: number
  customers: number
  riskScore: number
}

export interface CompareResponse {
  userScore: number
  industryAverage: number
  percentile: number
  comparison: {
    revenue: { user: number; average: number; difference: number }
    expenses: { user: number; average: number; difference: number }
    customers: { user: number; average: number; difference: number }
  }
  insights: string[]
}

// FAQ Types
export interface FAQ {
  id: string
  category: string
  question: string
  answer: string
}

// Insights Types
export interface Insight {
  id: string
  industry: string
  title: string
  summary: string
  keyPoints: string[]
  publishedAt: string
}

// Statistics Types
export interface Statistics {
  totalBusinesses: number
  closureRate: number
  averageSurvivalYears: number
  byIndustry: {
    industry: string
    count: number
    closureRate: number
  }[]
  trends: {
    labels: string[]
    openings: number[]
    closures: number[]
  }
}

// Notification Types
export interface Notification {
  id: string
  userId: string
  title: string
  message: string
  type: "info" | "warning" | "success" | "error"
  isRead: boolean
  createdAt: string
}

export interface NotificationSettings {
  emailAlerts: boolean
  weeklyReports: boolean
  riskThreshold: "GREEN" | "YELLOW" | "ORANGE" | "RED"
}

// Success Story Types
export interface SuccessStory {
  id: string
  businessName: string
  industry: string
  location: string
  story: string
  beforeScore: number
  afterScore: number
  improvements: string[]
  testimonial: string
  imageUrl: string
}

// Support Types
export interface ContactRequest {
  name: string
  email: string
  subject: string
  message: string
}

export interface ContactResponse {
  success: boolean
  id: string
}

// Profile Types
export interface ProfileUpdateRequest {
  name?: string
  businessName?: string
  industry?: string
}

// Error Response
export interface ErrorResponse {
  error: string
}


