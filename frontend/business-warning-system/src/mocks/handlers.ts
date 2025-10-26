import { http, HttpResponse } from 'msw'
import type {
  AuthResponse,
  DiagnosisResponse,
  DiagnosisHistory,
  ActionPlan,
  BenchmarkData,
  CompareResponse,
  ChatResponse,
  FAQ,
  Insight,
  Statistics,
  SuccessStory,
  ContactResponse,
} from '@/types/api'

// Mock 데이터 저장소
const mockUsers = new Map<string, any>()
const mockDiagnoses = new Map<string, any[]>()
const mockActionPlans = new Map<string, any[]>()
const mockNotifications = new Map<string, any[]>()

// 토큰에서 userId 추출 (간단한 mock)
const getUserIdFromToken = (request: Request): string | null => {
  const authHeader = request.headers.get('Authorization')
  if (!authHeader?.startsWith('Bearer ')) return null
  const token = authHeader.substring(7)
  // Mock: token이 userId라고 가정
  return token || null
}

export const handlers = [
  // ========== Auth API ==========
  http.post('/api/auth/login', async ({ request }) => {
    try {
      const body = await request.json() as { email: string; password: string }
      const { email, password } = body

      if (!email || !password) {
        return HttpResponse.json({ error: '이메일과 비밀번호를 입력해주세요.' }, { status: 400 })
      }

      // Mock user 찾기
      let user = null
      for (const [id, u] of mockUsers.entries()) {
        if (u.email === email) {
          user = { ...u, id }
          break
        }
      }

      if (!user || user.password !== password) {
        return HttpResponse.json({ error: '이메일 또는 비밀번호가 올바르지 않습니다.' }, { status: 401 })
      }

      const { password: _, ...userWithoutPassword } = user
      const response: AuthResponse = {
        user: userWithoutPassword,
        token: user.id, // Mock: userId를 token으로 사용
      }


      return HttpResponse.json(response)
    } catch (error) {
      return HttpResponse.json({ error: '로그인 중 오류가 발생했습니다.' }, { status: 500 })
    }
  }),

  http.post('/api/auth/signup', async ({ request }) => {
    try {
      const body = await request.json() as { email: string; password: string; name: string; businessName?: string; industry?: string }
      const { email, password, name, businessName, industry } = body

      if (!email || !password || !name) {
        return HttpResponse.json({ error: '필수 항목을 입력해주세요.' }, { status: 400 })
      }

      // 이메일 중복 확인
      for (const u of mockUsers.values()) {
        if (u.email === email) {
          return HttpResponse.json({ error: '이미 사용 중인 이메일입니다.' }, { status: 409 })
        }
      }

      const userId = `user-${Date.now()}`
      const user = {
        id: userId,
        email,
        password,
        name,
        businessName,
        industry,
        createdAt: new Date().toISOString(),
      }

      mockUsers.set(userId, user)

      const { password: _, ...userWithoutPassword } = user
      const response: AuthResponse = {
        user: userWithoutPassword,
        token: userId,
      }

      return HttpResponse.json(response)
    } catch (error) {
      return HttpResponse.json({ error: '회원가입 중 오류가 발생했습니다.' }, { status: 500 })
    }
  }),

  http.get('/api/auth/me', ({ request }) => {
    try {
      const userId = getUserIdFromToken(request)
      if (!userId) {
        return HttpResponse.json({ error: '인증이 필요합니다.' }, { status: 401 })
      }

      const user = mockUsers.get(userId)
      if (!user) {
        return HttpResponse.json({ error: '사용자를 찾을 수 없습니다.' }, { status: 404 })
      }

      const { password: _, ...userWithoutPassword } = user
      return HttpResponse.json({ user: userWithoutPassword })
    } catch (error) {
      return HttpResponse.json({ error: '사용자 정보 조회 중 오류가 발생했습니다.' }, { status: 500 })
    }
  }),

  // ========== Diagnosis API ==========
  http.post('/api/diagnose/predict', async ({ request }) => {
    try {
      const userId = getUserIdFromToken(request) || 'anonymous'
      const body = await request.json() as { industry: string; yearsInBusiness: number; monthlyRevenue: number; monthlyExpenses: number; customerCount: number }
      const { industry, yearsInBusiness, monthlyRevenue, monthlyExpenses, customerCount } = body

      if (!industry || yearsInBusiness === undefined || !monthlyRevenue || !monthlyExpenses || !customerCount) {
        return HttpResponse.json({ error: '모든 필수 항목을 입력해주세요.' }, { status: 400 })
      }

      // Mock 분석 결과 생성
      const profitMargin = ((monthlyRevenue - monthlyExpenses) / monthlyRevenue) * 100
      const overallScore = Math.min(100, Math.max(0, 50 + profitMargin + yearsInBusiness * 2))

      let riskLevel: 'GREEN' | 'YELLOW' | 'ORANGE' | 'RED'
      if (overallScore >= 75) riskLevel = 'GREEN'
      else if (overallScore >= 50) riskLevel = 'YELLOW'
      else if (overallScore >= 25) riskLevel = 'ORANGE'
      else riskLevel = 'RED'

      const diagnosis: DiagnosisResponse = {
        id: `diagnosis-${Date.now()}`,
        overallScore: Math.round(overallScore),
        riskLevel,
        components: {
          sales: { score: Math.round(overallScore + Math.random() * 10 - 5), trend: '매출이 안정적입니다.' },
          customer: { score: Math.round(overallScore + Math.random() * 10 - 5), trend: '고객 수가 증가하고 있습니다.' },
          market: { score: Math.round(overallScore + Math.random() * 10 - 5), trend: '시장 경쟁이 치열합니다.' },
        },
        recommendations: [
          { title: '비용 절감', description: '불필요한 지출을 줄이세요.', priority: 'HIGH' },
          { title: '마케팅 강화', description: 'SNS 마케팅을 시작하세요.', priority: 'MEDIUM' },
          { title: '메뉴 개선', description: '인기 메뉴를 중심으로 개선하세요.', priority: 'LOW' },
        ],
        insights: [
          `${industry} 업종의 평균 운영 기간은 ${yearsInBusiness}년입니다.`,
          '수익성 개선을 위해 비용 구조를 점검하세요.',
          '고객 유지율을 높이는 것이 중요합니다.',
        ],
        createdAt: new Date().toISOString(),
      }

      // 저장
      if (!mockDiagnoses.has(userId)) {
        mockDiagnoses.set(userId, [])
      }
      mockDiagnoses.get(userId)?.push(diagnosis)

      return HttpResponse.json(diagnosis)
    } catch (error) {
      return HttpResponse.json({ error: '진단 중 오류가 발생했습니다.' }, { status: 500 })
    }
  }),

  http.get('/api/diagnose/history', ({ request }) => {
    try {
      const userId = getUserIdFromToken(request)
      if (!userId) {
        return HttpResponse.json({ error: '인증이 필요합니다.' }, { status: 401 })
      }

      const diagnoses = mockDiagnoses.get(userId) || []
      const response: DiagnosisHistory = { diagnoses }

      return HttpResponse.json(response)
    } catch (error) {
      return HttpResponse.json({ error: '진단 기록 조회 중 오류가 발생했습니다.' }, { status: 500 })
    }
  }),

  // ========== Action Plan API ==========
  http.get('/api/action-plan', ({ request }) => {
    try {
      const userId = getUserIdFromToken(request)
      if (!userId) {
        return HttpResponse.json({ error: '인증 필요' }, { status: 401 })
      }

      const actionPlans = mockActionPlans.get(userId) || []
      return HttpResponse.json(actionPlans)
    } catch (error) {
      return HttpResponse.json({ error: '개선 계획 조회 실패' }, { status: 500 })
    }
  }),

  http.post('/api/action-plan', async ({ request }) => {
    try {
      const userId = getUserIdFromToken(request)
      if (!userId) {
        return HttpResponse.json({ error: '인증 필요' }, { status: 401 })
      }

      const body = await request.json() as { diagnosisId: string; items: any[] }
      const { diagnosisId, items } = body

      const actionPlan: ActionPlan = {
        id: `plan-${Date.now()}`,
        userId,
        diagnosisId,
        items,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      if (!mockActionPlans.has(userId)) {
        mockActionPlans.set(userId, [])
      }
      mockActionPlans.get(userId)?.push(actionPlan)

      return HttpResponse.json(actionPlan, { status: 201 })
    } catch (error) {
      return HttpResponse.json({ error: '개선 계획 생성 실패' }, { status: 500 })
    }
  }),

  http.put('/api/action-plan/:id', async ({ request, params }) => {
    try {
      const userId = getUserIdFromToken(request)
      if (!userId) {
        return HttpResponse.json({ error: '인증 필요' }, { status: 401 })
      }

      const { id } = params
      const body = await request.json() as Record<string, any>;

      const plans = mockActionPlans.get(userId) || []
      const planIndex = plans.findIndex((p) => p.id === id)

      if (planIndex === -1) {
        return HttpResponse.json({ error: '개선 계획을 찾을 수 없습니다' }, { status: 404 })
      }

      plans[planIndex] = { ...plans[planIndex], ...body, updatedAt: new Date().toISOString() }
      mockActionPlans.set(userId, plans)

      return HttpResponse.json(plans[planIndex])
    } catch (error) {
      return HttpResponse.json({ error: '개선 계획 업데이트 실패' }, { status: 500 })
    }
  }),

  http.delete('/api/action-plan/:id', ({ request, params }) => {
    try {
      const userId = getUserIdFromToken(request)
      if (!userId) {
        return HttpResponse.json({ error: '인증 필요' }, { status: 401 })
      }

      const { id } = params
      const url = new URL(request.url)
      const itemId = url.searchParams.get('itemId')

      if (!itemId) {
        return HttpResponse.json({ error: 'itemId 필요' }, { status: 400 })
      }

      const plans = mockActionPlans.get(userId) || []
      const planIndex = plans.findIndex((p) => p.id === id)

      if (planIndex === -1) {
        return HttpResponse.json({ error: '삭제 실패' }, { status: 404 })
      }

      plans[planIndex].items = plans[planIndex].items.filter((item: any) => item.id !== itemId)
      mockActionPlans.set(userId, plans)

      return HttpResponse.json({ success: true })
    } catch (error) {
      return HttpResponse.json({ error: '액션 아이템 삭제 실패' }, { status: 500 })
    }
  }),

  // ========== Benchmark API ==========
  http.get('/api/benchmark', ({ request }) => {
    try {
      const url = new URL(request.url)
      const industry = url.searchParams.get('industry') || '전체'
      const region = url.searchParams.get('region') || '전국'

      const benchmarkData: BenchmarkData = {
        industry,
        region,
        averageRiskScore: 65,
        metrics: {
          revenue: { average: 45000000, median: 38000000 },
          expenses: { average: 35000000, median: 30000000 },
          customers: { average: 850, median: 720 },
          profitMargin: { average: 22, median: 21 },
        },
        riskDistribution: {
          GREEN: 25,
          YELLOW: 40,
          ORANGE: 25,
          RED: 10,
        },
      }

      return HttpResponse.json(benchmarkData)
    } catch (error) {
      return HttpResponse.json({ error: '벤치마크 데이터 조회 실패' }, { status: 500 })
    }
  }),

  http.post('/api/benchmark/compare', async ({ request }) => {
    try {
      const body = await request.json() as { industry: string; revenue: number; expenses: number; customers: number; riskScore: number }
      const { revenue, expenses, customers, riskScore } = body

      const comparison: CompareResponse = {
        userScore: riskScore,
        industryAverage: 65,
        percentile: Math.floor(Math.random() * 100),
        comparison: {
          revenue: {
            user: revenue,
            average: 45000000,
            difference: ((revenue - 45000000) / 45000000) * 100,
          },
          expenses: {
            user: expenses,
            average: 35000000,
            difference: ((expenses - 35000000) / 35000000) * 100,
          },
          customers: {
            user: customers,
            average: 850,
            difference: ((customers - 850) / 850) * 100,
          },
        },
        insights: ['귀하의 매출은 업종 평균보다 높습니다.', '고객 수가 평균 이하입니다. 마케팅 강화가 필요합니다.'],
      }

      return HttpResponse.json(comparison)
    } catch (error) {
      return HttpResponse.json({ error: '비교 분석 실패' }, { status: 500 })
    }
  }),

  // ========== Chat API ==========
  http.post('/api/chat', async ({ request }) => {
    try {
      const body = await request.json() as { messages: any[]; context?: any }
      const { messages } = body

      // Mock AI 응답
      const lastMessage = messages[messages.length - 1]?.content || ''
      const response: ChatResponse = {
        message: `${lastMessage}에 대한 답변입니다. 자영업 경영에서 이 부분은 매우 중요합니다. 구체적인 상황에 맞춰 조언을 드리자면, 우선 현재 상황을 정확히 파악하는 것이 중요합니다.`,
      }

      return HttpResponse.json(response)
    } catch (error) {
      return HttpResponse.json({ error: 'Failed to generate response' }, { status: 500 })
    }
  }),

  // ========== FAQ API ==========
  http.get('/api/faq', () => {
    try {
      const faqs: FAQ[] = [
        {
          id: '1',
          category: '서비스 이용',
          question: '진단은 얼마나 자주 받아야 하나요?',
          answer: '최소 월 1회 진단을 권장합니다. 매출이나 비용에 큰 변화가 있을 때는 즉시 재진단하는 것이 좋습니다.',
        },
        {
          id: '2',
          category: '서비스 이용',
          question: '진단 결과는 얼마나 정확한가요?',
          answer: 'AI 분석과 업종별 빅데이터를 기반으로 85% 이상의 정확도를 보입니다. 다만 참고 자료로 활용하시고, 중요한 결정은 전문가와 상담하시기 바랍니다.',
        },
        {
          id: '3',
          category: '요금',
          question: '서비스 이용료는 얼마인가요?',
          answer: '기본 진단은 무료입니다. 프리미엄 기능(상세 분석, 전문가 상담 등)은 월 29,000원부터 시작합니다.',
        },
        {
          id: '4',
          category: '데이터 보안',
          question: '내 사업 정보는 안전한가요?',
          answer: '모든 데이터는 암호화되어 저장되며, 개인정보보호법을 준수합니다. 제3자에게 공유되지 않습니다.',
        },
      ]

      return HttpResponse.json(faqs)
    } catch (error) {
      return HttpResponse.json({ error: 'FAQ 조회 실패' }, { status: 500 })
    }
  }),

  // ========== Insights API ==========
  http.get('/api/insights', ({ request }) => {
    try {
      const url = new URL(request.url)
      const industry = url.searchParams.get('industry') || '전체'

      const insights: Insight[] = [
        {
          id: '1',
          industry,
          title: '2024년 자영업 트렌드 분석',
          summary: '디지털 전환과 배달 서비스 확대가 주요 트렌드',
          keyPoints: ['온라인 주문 시스템 도입 업체 45% 증가', '배달 매출 비중 평균 32%로 상승', 'SNS 마케팅 활용도 68% 증가'],
          publishedAt: '2024-01-15',
        },
        {
          id: '2',
          industry,
          title: '성공하는 자영업자의 공통점',
          summary: '데이터 기반 의사결정과 고객 관리가 핵심',
          keyPoints: ['월 단위 재무 분석 실시', '고객 데이터베이스 체계적 관리', '정기적인 메뉴/서비스 개선'],
          publishedAt: '2024-01-10',
        },
      ]

      return HttpResponse.json(insights)
    } catch (error) {
      return HttpResponse.json({ error: '인사이트 조회 실패' }, { status: 500 })
    }
  }),

  // ========== Notifications API ==========
  http.get('/api/notifications', ({ request }) => {
    try {
      const userId = getUserIdFromToken(request)
      if (!userId) {
        return HttpResponse.json({ error: '인증 필요' }, { status: 401 })
      }

      const notifications = mockNotifications.get(userId) || []
      return HttpResponse.json(notifications)
    } catch (error) {
      return HttpResponse.json({ error: '알림 조회 실패' }, { status: 500 })
    }
  }),

  http.delete('/api/notifications/:id', ({ request, params }) => {
    try {
      const userId = getUserIdFromToken(request)
      if (!userId) {
        return HttpResponse.json({ error: '인증 필요' }, { status: 401 })
      }

      const { id } = params
      const notifications = mockNotifications.get(userId) || []
      const filtered = notifications.filter((n: any) => n.id !== id)

      if (filtered.length === notifications.length) {
        return HttpResponse.json({ error: '알림을 찾을 수 없습니다' }, { status: 404 })
      }

      mockNotifications.set(userId, filtered)
      return HttpResponse.json({ success: true })
    } catch (error) {
      return HttpResponse.json({ error: '알림 삭제 실패' }, { status: 500 })
    }
  }),

  http.put('/api/notifications/:id/read', ({ request, params }) => {
    try {
      const userId = getUserIdFromToken(request)
      if (!userId) {
        return HttpResponse.json({ error: '인증 필요' }, { status: 401 })
      }

      const { id } = params
      const notifications = mockNotifications.get(userId) || []
      const notification = notifications.find((n: any) => n.id === id)

      if (!notification) {
        return HttpResponse.json({ error: '알림을 찾을 수 없습니다' }, { status: 404 })
      }

      notification.isRead = true
      mockNotifications.set(userId, notifications)

      return HttpResponse.json({ success: true })
    } catch (error) {
      return HttpResponse.json({ error: '알림 읽음 처리 실패' }, { status: 500 })
    }
  }),

  http.put('/api/notifications/settings', async ({ request }) => {
    try {
      const userId = getUserIdFromToken(request)
      if (!userId) {
        return HttpResponse.json({ error: '인증 필요' }, { status: 401 })
      }

      const body = await request.json()
      return HttpResponse.json({ success: true, settings: body })
    } catch (error) {
      return HttpResponse.json({ error: '알림 설정 업데이트 실패' }, { status: 500 })
    }
  }),

  // ========== Statistics API ==========
  http.get('/api/statistics', () => {
    try {
      const statistics: Statistics = {
        totalBusinesses: 6850000,
        closureRate: 23.5,
        averageSurvivalYears: 5.2,
        byIndustry: [
          { industry: '음식점', count: 685000, closureRate: 28.3 },
          { industry: '소매업', count: 548000, closureRate: 25.1 },
          { industry: '서비스업', count: 412000, closureRate: 21.7 },
          { industry: '도소매', count: 356000, closureRate: 19.8 },
        ],
        trends: {
          labels: ['2020', '2021', '2022', '2023', '2024'],
          openings: [520000, 485000, 512000, 498000, 505000],
          closures: [145000, 138000, 152000, 148000, 155000],
        },
      }

      return HttpResponse.json(statistics)
    } catch (error) {
      return HttpResponse.json({ error: '통계 조회 실패' }, { status: 500 })
    }
  }),

  // ========== Success Stories API ==========
  http.get('/api/success-stories', () => {
    try {
      const stories: SuccessStory[] = [
        {
          id: '1',
          businessName: '행복한 카페',
          industry: '음식점',
          location: '서울 강남구',
          story: '위기 진단 후 메뉴 개선과 SNS 마케팅으로 매출 150% 증가',
          beforeScore: 45,
          afterScore: 78,
          improvements: ['메뉴 단순화', '인스타그램 마케팅', '배달 서비스 도입'],
          testimonial: '조기 경보 시스템 덕분에 위기를 기회로 바꿀 수 있었습니다.',
          imageUrl: '/placeholder.svg?height=300&width=400',
        },
        {
          id: '2',
          businessName: '스마트 편의점',
          industry: '소매업',
          location: '부산 해운대구',
          story: '재고 관리 개선과 고객 분석으로 수익성 200% 향상',
          beforeScore: 52,
          afterScore: 85,
          improvements: ['POS 시스템 도입', '재고 최적화', '단골 고객 관리'],
          testimonial: '데이터 기반 의사결정으로 완전히 달라졌습니다.',
          imageUrl: '/placeholder.svg?height=300&width=400',
        },
      ]

      return HttpResponse.json(stories)
    } catch (error) {
      return HttpResponse.json({ error: '성공 사례 조회 실패' }, { status: 500 })
    }
  }),

  // ========== Support API ==========
  http.post('/api/support/contact', async ({ request }) => {
    try {
      const body = await request.json() as { name: string; email: string; subject: string; message: string }
      const { name, email, subject, message } = body

      if (!name || !email || !subject || !message) {
        return HttpResponse.json({ error: '모든 필드를 입력해주세요' }, { status: 400 })
      }

      const response: ContactResponse = {
        success: true,
        id: `contact-${Date.now()}`,
      }

      return HttpResponse.json(response, { status: 201 })
    } catch (error) {
      return HttpResponse.json({ error: '문의 제출 실패' }, { status: 500 })
    }
  }),

  // ========== User Profile API ==========
  http.get('/api/user/profile', ({ request }) => {
    try {
      const userId = getUserIdFromToken(request)
      if (!userId) {
        return HttpResponse.json({ error: '인증이 필요합니다.' }, { status: 401 })
      }

      const user = mockUsers.get(userId)
      if (!user) {
        return HttpResponse.json({ error: '사용자를 찾을 수 없습니다.' }, { status: 404 })
      }

      const { password: _, ...userWithoutPassword } = user
      return HttpResponse.json({ user: userWithoutPassword })
    } catch (error) {
      return HttpResponse.json({ error: '프로필 조회 중 오류가 발생했습니다.' }, { status: 500 })
    }
  }),

  http.put('/api/user/profile', async ({ request }) => {
    try {
      const userId = getUserIdFromToken(request)
      if (!userId) {
        return HttpResponse.json({ error: '인증이 필요합니다.' }, { status: 401 })
      }

      const user = mockUsers.get(userId)
      if (!user) {
        return HttpResponse.json({ error: '사용자를 찾을 수 없습니다.' }, { status: 404 })
      }

      const body = await request.json() as { name?: string; businessName?: string; industry?: string }
      const updatedUser = { ...user, ...body }
      mockUsers.set(userId, updatedUser)

      const { password: _, ...userWithoutPassword } = updatedUser
      return HttpResponse.json({ user: userWithoutPassword })
    } catch (error) {
      return HttpResponse.json({ error: '프로필 수정 중 오류가 발생했습니다.' }, { status: 500 })
    }
  }),
]
