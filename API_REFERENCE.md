# API Reference

이 문서는 `src/lib/api.ts`에 구현된 모든 API 호출 함수와 React Query hooks의 레퍼런스입니다.

## 📦 Export 목록

```typescript
// API Client (직접 사용 가능)
export const apiClient: ApiClient

// Query Keys (직접 사용 가능)
export const queryKeys

// Auth Hooks
export function useLogin(): UseMutationResult<AuthResponse, Error, LoginRequest>
export function useSignup(): UseMutationResult<AuthResponse, Error, SignupRequest>
export function useAuth(): UseQueryResult<{ user: User }, Error>
export function useLogout(): () => void

// Diagnosis Hooks
export function usePredictDiagnosis(): UseMutationResult<DiagnosisResponse, Error, DiagnosisRequest>
export function useDiagnosisHistory(): UseQueryResult<DiagnosisHistory, Error>

// Action Plan Hooks
export function useActionPlans(): UseQueryResult<ActionPlan[], Error>
export function useCreateActionPlan(): UseMutationResult<ActionPlan, Error, ActionPlanRequest>
export function useUpdateActionPlan(): UseMutationResult<ActionPlan, Error, { id: string; data: Partial<ActionPlan> }>
export function useDeleteActionPlanItem(): UseMutationResult<{ success: boolean }, Error, { id: string; itemId: string }>

// Benchmark Hooks
export function useBenchmark(industry?: string, region?: string): UseQueryResult<BenchmarkData, Error>
export function useCompareBenchmark(): UseMutationResult<CompareResponse, Error, CompareRequest>

// Blog Hooks
export function useBlogPosts(): UseQueryResult<BlogPost[], Error>
export function useBlogPost(id: string): UseQueryResult<BlogPost, Error>

// Chat Hooks
export function useSendChatMessage(): UseMutationResult<ChatResponse, Error, ChatRequest>

// FAQ Hooks
export function useFAQs(): UseQueryResult<FAQ[], Error>

// Insights Hooks
export function useInsights(industry?: string): UseQueryResult<Insight[], Error>

// Notifications Hooks
export function useNotifications(): UseQueryResult<Notification[], Error>
export function useDeleteNotification(): UseMutationResult<{ success: boolean }, Error, string>
export function useMarkNotificationAsRead(): UseMutationResult<{ success: boolean }, Error, string>
export function useUpdateNotificationSettings(): UseMutationResult<{ success: boolean; settings: NotificationSettings }, Error, NotificationSettings>

// Statistics Hooks
export function useStatistics(): UseQueryResult<Statistics, Error>

// Success Stories Hooks
export function useSuccessStories(): UseQueryResult<SuccessStory[], Error>

// Support Hooks
export function useSubmitContact(): UseMutationResult<ContactResponse, Error, ContactRequest>

// Profile Hooks
export function useProfile(): UseQueryResult<{ user: User }, Error>
export function useUpdateProfile(): UseMutationResult<{ user: User }, Error, ProfileUpdateRequest>
```

---

## 🔧 ApiClient 메서드

ApiClient는 singleton 인스턴스로 export되며, 필요시 직접 호출 가능합니다:

```typescript
import { apiClient } from '@/lib/api'

// 직접 API 호출 (권장하지 않음, hooks 사용 권장)
const response = await apiClient.login({ email, password })
```

### 인증 관리

```typescript
// 토큰 설정 (로그인 시 자동 호출됨)
apiClient.setToken(token: string | null)

// 토큰 가져오기
apiClient.getToken(): string | null
```

---

## 📋 Query Keys

TanStack Query의 query invalidation이나 직접 캐시 조작 시 사용:

```typescript
import { queryKeys } from '@/lib/api'

// Query keys 구조
queryKeys = {
  auth: {
    me: ['auth', 'me']
  },
  diagnosis: {
    history: ['diagnosis', 'history']
  },
  actionPlan: {
    all: ['action-plan']
  },
  benchmark: {
    data: (industry?, region?) => ['benchmark', industry, region]
  },
  blog: {
    all: ['blog'],
    detail: (id) => ['blog', id]
  },
  faq: {
    all: ['faq']
  },
  insights: {
    all: (industry?) => ['insights', industry]
  },
  notifications: {
    all: ['notifications']
  },
  statistics: {
    all: ['statistics']
  },
  successStories: {
    all: ['success-stories']
  },
  profile: {
    me: ['profile', 'me']
  }
}
```

### Query Keys 사용 예제

```typescript
import { useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/lib/api'

function MyComponent() {
  const queryClient = useQueryClient()

  // 특정 query 무효화
  queryClient.invalidateQueries({ queryKey: queryKeys.diagnosis.history })

  // 캐시 데이터 직접 설정
  queryClient.setQueryData(queryKeys.auth.me, { user: { ... } })

  // 캐시 데이터 가져오기
  const cachedUser = queryClient.getQueryData(queryKeys.auth.me)
}
```

---

## 🎯 Hooks 상세 사용법

### 1. Auth Hooks

#### useLogin()

```typescript
const login = useLogin()

// 로딩 상태
login.isPending // boolean

// 에러
login.error // Error | null

// 실행
await login.mutateAsync({ email, password })

// 또는 콜백 사용
login.mutate({ email, password }, {
  onSuccess: (data) => {
    console.log('로그인 성공:', data.user)
  },
  onError: (error) => {
    console.error('로그인 실패:', error.message)
  }
})
```

#### useSignup()

```typescript
const signup = useSignup()

await signup.mutateAsync({
  email: 'test@example.com',
  password: 'password123',
  name: '홍길동',
  businessName: '행복한 카페', // optional
  industry: '음식점' // optional
})
```

#### useAuth()

```typescript
const { data, isLoading, error, refetch } = useAuth()

if (isLoading) return <Spinner />
if (error) return <Error />
if (data) {
  console.log(data.user.name)
}

// 수동 refetch
await refetch()
```

#### useLogout()

```typescript
const logout = useLogout()

// 로그아웃 실행
logout() // 토큰 제거 + 모든 캐시 초기화
```

---

### 2. Diagnosis Hooks

#### usePredictDiagnosis()

```typescript
const predict = usePredictDiagnosis()

const result = await predict.mutateAsync({
  industry: '음식점',
  yearsInBusiness: 3,
  monthlyRevenue: 50000000,
  monthlyExpenses: 40000000,
  customerCount: 1000
})

console.log('위험도:', result.riskLevel) // GREEN | YELLOW | ORANGE | RED
console.log('점수:', result.overallScore)
console.log('추천사항:', result.recommendations)
```

#### useDiagnosisHistory()

```typescript
const { data, isLoading } = useDiagnosisHistory()

// data.diagnoses: DiagnosisResponse[]
```

---

### 3. Action Plan Hooks

#### useActionPlans()

```typescript
const { data: plans, isLoading } = useActionPlans()

// plans: ActionPlan[]
```

#### useCreateActionPlan()

```typescript
const createPlan = useCreateActionPlan()

await createPlan.mutateAsync({
  diagnosisId: 'diagnosis-123',
  items: [
    {
      id: 'item-1',
      title: '비용 절감',
      description: '불필요한 지출 줄이기',
      priority: 'HIGH', // HIGH | MEDIUM | LOW
      status: 'pending', // pending | in_progress | completed
      dueDate: '2024-12-31' // optional
    }
  ]
})
```

#### useUpdateActionPlan()

```typescript
const updatePlan = useUpdateActionPlan()

await updatePlan.mutateAsync({
  id: 'plan-123',
  data: {
    items: [ /* 수정된 items */ ]
  }
})
```

#### useDeleteActionPlanItem()

```typescript
const deleteItem = useDeleteActionPlanItem()

await deleteItem.mutateAsync({
  id: 'plan-123',
  itemId: 'item-1'
})
```

---

### 4. Benchmark Hooks

#### useBenchmark()

```typescript
// 파라미터는 optional
const { data } = useBenchmark('음식점', '서울')
const { data } = useBenchmark() // 전체

console.log(data.averageRiskScore)
console.log(data.metrics.revenue.average)
console.log(data.riskDistribution.GREEN) // 비율 (%)
```

#### useCompareBenchmark()

```typescript
const compare = useCompareBenchmark()

const result = await compare.mutateAsync({
  industry: '음식점',
  revenue: 50000000,
  expenses: 40000000,
  customers: 1000,
  riskScore: 75
})

console.log('내 점수:', result.userScore)
console.log('업계 평균:', result.industryAverage)
console.log('상위 %:', result.percentile)
console.log('매출 차이:', result.comparison.revenue.difference) // %
```

---

### 5. Blog Hooks

#### useBlogPosts()

```typescript
const { data: posts } = useBlogPosts()

// posts: BlogPost[]
```

#### useBlogPost()

```typescript
const { data: post, isLoading } = useBlogPost('post-id')

// enabled option: id가 있을 때만 query 실행
if (!post) return null

console.log(post.title)
console.log(post.content)
console.log(post.author)
console.log(post.tags)
```

---

### 6. Chat Hook

#### useSendChatMessage()

```typescript
const sendMessage = useSendChatMessage()

const response = await sendMessage.mutateAsync({
  messages: [
    { role: 'user', content: '안녕하세요' },
    { role: 'assistant', content: '안녕하세요! 무엇을 도와드릴까요?' },
    { role: 'user', content: '매출이 줄어들고 있어요' }
  ],
  context: { // optional
    industry: '음식점',
    businessPeriod: '3년',
    salesChange: '-15%',
    customerChange: '-10%',
    deliveryRatio: '40%'
  }
})

console.log(response.message) // AI 응답
```

---

### 7. FAQ Hook

#### useFAQs()

```typescript
const { data: faqs } = useFAQs()

faqs?.forEach(faq => {
  console.log(faq.category) // 카테고리
  console.log(faq.question)
  console.log(faq.answer)
})
```

---

### 8. Insights Hook

#### useInsights()

```typescript
const { data: insights } = useInsights('음식점') // industry optional

insights?.forEach(insight => {
  console.log(insight.title)
  console.log(insight.summary)
  console.log(insight.keyPoints) // string[]
})
```

---

### 9. Notifications Hooks

#### useNotifications()

```typescript
const { data: notifications } = useNotifications()

// notifications: Notification[]
notifications?.forEach(notif => {
  console.log(notif.title)
  console.log(notif.message)
  console.log(notif.type) // info | warning | success | error
  console.log(notif.isRead) // boolean
})
```

#### useDeleteNotification()

```typescript
const deleteNotif = useDeleteNotification()

await deleteNotif.mutateAsync('notification-id')
```

#### useMarkNotificationAsRead()

```typescript
const markAsRead = useMarkNotificationAsRead()

await markAsRead.mutateAsync('notification-id')
```

#### useUpdateNotificationSettings()

```typescript
const updateSettings = useUpdateNotificationSettings()

await updateSettings.mutateAsync({
  emailAlerts: true,
  weeklyReports: false,
  riskThreshold: 'YELLOW' // GREEN | YELLOW | ORANGE | RED
})
```

---

### 10. Statistics Hook

#### useStatistics()

```typescript
const { data: stats } = useStatistics()

console.log(stats.totalBusinesses) // 전체 사업체 수
console.log(stats.closureRate) // 폐업률 (%)
console.log(stats.averageSurvivalYears) // 평균 생존 기간

stats.byIndustry.forEach(item => {
  console.log(item.industry) // 업종
  console.log(item.count) // 사업체 수
  console.log(item.closureRate) // 폐업률
})

// 트렌드 데이터
console.log(stats.trends.labels) // ['2020', '2021', ...]
console.log(stats.trends.openings) // [520000, 485000, ...]
console.log(stats.trends.closures) // [145000, 138000, ...]
```

---

### 11. Success Stories Hook

#### useSuccessStories()

```typescript
const { data: stories } = useSuccessStories()

stories?.forEach(story => {
  console.log(story.businessName)
  console.log(story.industry)
  console.log(story.location)
  console.log(story.story)
  console.log(`${story.beforeScore} → ${story.afterScore}`)
  console.log(story.improvements) // string[]
  console.log(story.testimonial)
})
```

---

### 12. Support Hook

#### useSubmitContact()

```typescript
const submit = useSubmitContact()

const result = await submit.mutateAsync({
  name: '홍길동',
  email: 'hong@example.com',
  subject: '문의사항',
  message: '서비스에 대해 궁금한 점이 있습니다.'
})

console.log(result.id) // 생성된 문의 ID
```

---

### 13. Profile Hooks

#### useProfile()

```typescript
const { data, isLoading } = useProfile()

console.log(data?.user.name)
console.log(data?.user.businessName)
console.log(data?.user.industry)
console.log(data?.user.email)
```

#### useUpdateProfile()

```typescript
const updateProfile = useUpdateProfile()

await updateProfile.mutateAsync({
  name: '홍길동', // optional
  businessName: '행복한 카페', // optional
  industry: '음식점' // optional
})
```

---

## 🔄 자동 Query Invalidation

Mutation 성공 시 자동으로 관련 query가 refetch됩니다:

| Mutation Hook | 자동 Invalidate되는 Query |
|--------------|------------------------|
| `usePredictDiagnosis()` | `useDiagnosisHistory()` |
| `useCreateActionPlan()` | `useActionPlans()` |
| `useUpdateActionPlan()` | `useActionPlans()` |
| `useDeleteActionPlanItem()` | `useActionPlans()` |
| `useDeleteNotification()` | `useNotifications()` |
| `useMarkNotificationAsRead()` | `useNotifications()` |
| `useUpdateProfile()` | `useProfile()`, `useAuth()` |
| `useLogin()` | `useAuth()` (캐시에 직접 설정) |
| `useSignup()` | `useAuth()` (캐시에 직접 설정) |

---

## 🎨 고급 사용 패턴

### 1. Optimistic Updates

```typescript
import { useQueryClient } from '@tanstack/react-query'
import { queryKeys, useMarkNotificationAsRead } from '@/lib/api'

function NotificationItem({ notification }) {
  const queryClient = useQueryClient()
  const markAsRead = useMarkNotificationAsRead()

  const handleMarkAsRead = async () => {
    // 즉시 UI 업데이트 (낙관적)
    queryClient.setQueryData(queryKeys.notifications.all, (old: Notification[]) =>
      old.map(n => n.id === notification.id ? { ...n, isRead: true } : n)
    )

    try {
      // 실제 API 호출
      await markAsRead.mutateAsync(notification.id)
    } catch (error) {
      // 실패 시 롤백
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all })
    }
  }

  return <button onClick={handleMarkAsRead}>읽음 처리</button>
}
```

### 2. Dependent Queries

```typescript
function DiagnosisResultPage() {
  const { data: authData } = useAuth()
  const { data: history, isLoading } = useDiagnosisHistory({
    // 로그인되어 있을 때만 실행
    enabled: !!authData?.user
  })

  if (!authData) return <Login />
  if (isLoading) return <Spinner />

  return <div>{/* history 렌더링 */}</div>
}
```

### 3. Prefetching

```typescript
import { useQueryClient } from '@tanstack/react-query'
import { queryKeys, apiClient } from '@/lib/api'

function BlogList() {
  const queryClient = useQueryClient()
  const { data: posts } = useBlogPosts()

  const handleMouseEnter = (postId: string) => {
    // 마우스 오버 시 미리 로드
    queryClient.prefetchQuery({
      queryKey: queryKeys.blog.detail(postId),
      queryFn: () => apiClient.getBlogPost(postId)
    })
  }

  return (
    <div>
      {posts?.map(post => (
        <Link
          key={post.id}
          to={`/blog/${post.id}`}
          onMouseEnter={() => handleMouseEnter(post.id)}
        >
          {post.title}
        </Link>
      ))}
    </div>
  )
}
```

### 4. 에러 핸들링

```typescript
function MyComponent() {
  const { data, error, isError } = useFAQs()

  if (isError) {
    return (
      <div>
        <h3>오류가 발생했습니다</h3>
        <p>{error.message}</p>
      </div>
    )
  }

  // ...
}

// Mutation 에러 처리
function LoginForm() {
  const login = useLogin()

  const handleSubmit = async (values) => {
    try {
      await login.mutateAsync(values)
      navigate('/dashboard')
    } catch (error) {
      toast.error(error.message)
    }
  }

  return <form onSubmit={handleSubmit}>...</form>
}
```

---

## 📚 타입 Import

모든 타입은 `@/types/api.ts`에서 import:

```typescript
import type {
  // Auth
  LoginRequest,
  SignupRequest,
  AuthResponse,
  User,
  
  // Diagnosis
  DiagnosisRequest,
  DiagnosisResponse,
  DiagnosisHistory,
  Recommendation,
  
  // Action Plan
  ActionPlanRequest,
  ActionPlan,
  ActionPlanItem,
  
  // Benchmark
  BenchmarkData,
  CompareRequest,
  CompareResponse,
  
  // Blog
  BlogPost,
  
  // Chat
  ChatMessage,
  ChatRequest,
  ChatResponse,
  
  // FAQ
  FAQ,
  
  // Insights
  Insight,
  
  // Notifications
  Notification,
  NotificationSettings,
  
  // Statistics
  Statistics,
  
  // Success Stories
  SuccessStory,
  
  // Support
  ContactRequest,
  ContactResponse,
  
  // Profile
  ProfileUpdateRequest,
  
  // Error
  ErrorResponse
} from '@/types/api'
```

