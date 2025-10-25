import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type {
  LoginRequest,
  SignupRequest,
  AuthResponse,
  User,
  DiagnosisRequest,
  DiagnosisResponse,
  DiagnosisHistory,
  ActionPlanRequest,
  ActionPlan,
  BenchmarkData,
  CompareRequest,
  CompareResponse,
  BlogPost,
  ChatRequest,
  ChatResponse,
  FAQ,
  Insight,
  Notification,
  NotificationSettings,
  Statistics,
  SuccessStory,
  ContactRequest,
  ContactResponse,
  ProfileUpdateRequest,
  ErrorResponse,
} from '@/types/api'

// ========== API Client ==========
class ApiClient {
  private baseUrl = '/api'
  private token: string | null = null

  setToken(token: string | null) {
    this.token = token
    if (token) {
      localStorage.setItem('auth_token', token)
    } else {
      localStorage.removeItem('auth_token')
    }
  }

  getToken(): string | null {
    if (!this.token) {
      this.token = localStorage.getItem('auth_token')
    }
    return this.token
  }

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const token = this.getToken()
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options?.headers,
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error((data as ErrorResponse).error || 'API 요청 실패')
    }

    return data
  }

  // Auth
  async login(data: LoginRequest): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async signup(data: SignupRequest): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async getMe(): Promise<{ user: User }> {
    return this.request<{ user: User }>('/auth/me')
  }

  // Diagnosis
  async predictDiagnosis(data: DiagnosisRequest): Promise<DiagnosisResponse> {
    return this.request<DiagnosisResponse>('/diagnose/predict', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async getDiagnosisHistory(): Promise<DiagnosisHistory> {
    return this.request<DiagnosisHistory>('/diagnose/history')
  }

  // Action Plan
  async getActionPlans(): Promise<ActionPlan[]> {
    return this.request<ActionPlan[]>('/action-plan')
  }

  async createActionPlan(data: ActionPlanRequest): Promise<ActionPlan> {
    return this.request<ActionPlan>('/action-plan', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateActionPlan(id: string, data: Partial<ActionPlan>): Promise<ActionPlan> {
    return this.request<ActionPlan>(`/action-plan/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async deleteActionPlanItem(id: string, itemId: string): Promise<{ success: boolean }> {
    return this.request<{ success: boolean }>(`/action-plan/${id}?itemId=${itemId}`, {
      method: 'DELETE',
    })
  }

  // Benchmark
  async getBenchmark(industry?: string, region?: string): Promise<BenchmarkData> {
    const params = new URLSearchParams()
    if (industry) params.append('industry', industry)
    if (region) params.append('region', region)
    const query = params.toString() ? `?${params.toString()}` : ''
    return this.request<BenchmarkData>(`/benchmark${query}`)
  }

  async compareBenchmark(data: CompareRequest): Promise<CompareResponse> {
    return this.request<CompareResponse>('/benchmark/compare', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  // Blog
  async getBlogPosts(): Promise<BlogPost[]> {
    return this.request<BlogPost[]>('/blog')
  }

  async getBlogPost(id: string): Promise<BlogPost> {
    return this.request<BlogPost>(`/blog/${id}`)
  }

  // Chat
  async sendChatMessage(data: ChatRequest): Promise<ChatResponse> {
    return this.request<ChatResponse>('/chat', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  // FAQ
  async getFAQs(): Promise<FAQ[]> {
    return this.request<FAQ[]>('/faq')
  }

  // Insights
  async getInsights(industry?: string): Promise<Insight[]> {
    const query = industry ? `?industry=${industry}` : ''
    return this.request<Insight[]>(`/insights${query}`)
  }

  // Notifications
  async getNotifications(): Promise<Notification[]> {
    return this.request<Notification[]>('/notifications')
  }

  async deleteNotification(id: string): Promise<{ success: boolean }> {
    return this.request<{ success: boolean }>(`/notifications/${id}`, {
      method: 'DELETE',
    })
  }

  async markNotificationAsRead(id: string): Promise<{ success: boolean }> {
    return this.request<{ success: boolean }>(`/notifications/${id}/read`, {
      method: 'PUT',
    })
  }

  async updateNotificationSettings(settings: NotificationSettings): Promise<{ success: boolean; settings: NotificationSettings }> {
    return this.request<{ success: boolean; settings: NotificationSettings }>('/notifications/settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    })
  }

  // Statistics
  async getStatistics(): Promise<Statistics> {
    return this.request<Statistics>('/statistics')
  }

  // Success Stories
  async getSuccessStories(): Promise<SuccessStory[]> {
    return this.request<SuccessStory[]>('/success-stories')
  }

  // Support
  async submitContact(data: ContactRequest): Promise<ContactResponse> {
    return this.request<ContactResponse>('/support/contact', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  // User Profile
  async getProfile(): Promise<{ user: User }> {
    return this.request<{ user: User }>('/user/profile')
  }

  async updateProfile(data: ProfileUpdateRequest): Promise<{ user: User }> {
    return this.request<{ user: User }>('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }
}

export const apiClient = new ApiClient()

// ========== Query Keys ==========
export const queryKeys = {
  auth: {
    me: ['auth', 'me'] as const,
  },
  diagnosis: {
    history: ['diagnosis', 'history'] as const,
  },
  actionPlan: {
    all: ['action-plan'] as const,
  },
  benchmark: {
    data: (industry?: string, region?: string) => ['benchmark', industry, region] as const,
  },
  blog: {
    all: ['blog'] as const,
    detail: (id: string) => ['blog', id] as const,
  },
  faq: {
    all: ['faq'] as const,
  },
  insights: {
    all: (industry?: string) => ['insights', industry] as const,
  },
  notifications: {
    all: ['notifications'] as const,
  },
  statistics: {
    all: ['statistics'] as const,
  },
  successStories: {
    all: ['success-stories'] as const,
  },
  profile: {
    me: ['profile', 'me'] as const,
  },
}

// ========== Auth Hooks ==========
export function useLogin() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: LoginRequest) => apiClient.login(data),
    onSuccess: (data) => {
      apiClient.setToken(data.token)
      queryClient.setQueryData(queryKeys.auth.me, { user: data.user })
    },
  })
}

export function useSignup() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: SignupRequest) => apiClient.signup(data),
    onSuccess: (data) => {
      apiClient.setToken(data.token)
      queryClient.setQueryData(queryKeys.auth.me, { user: data.user })
    },
  })
}

export function useAuth() {
  return useQuery({
    queryKey: queryKeys.auth.me,
    queryFn: () => apiClient.getMe(),
    retry: false,
    staleTime: 5 * 60 * 1000, // 5분
  })
}

export function useLogout() {
  const queryClient = useQueryClient()

  return () => {
    apiClient.setToken(null)
    queryClient.clear()
  }
}

// ========== Diagnosis Hooks ==========
export function usePredictDiagnosis() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: DiagnosisRequest) => apiClient.predictDiagnosis(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.diagnosis.history })
    },
  })
}

export function useDiagnosisHistory() {
  return useQuery({
    queryKey: queryKeys.diagnosis.history,
    queryFn: () => apiClient.getDiagnosisHistory(),
  })
}

// ========== Action Plan Hooks ==========
export function useActionPlans() {
  return useQuery({
    queryKey: queryKeys.actionPlan.all,
    queryFn: () => apiClient.getActionPlans(),
  })
}

export function useCreateActionPlan() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: ActionPlanRequest) => apiClient.createActionPlan(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.actionPlan.all })
    },
  })
}

export function useUpdateActionPlan() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ActionPlan> }) => apiClient.updateActionPlan(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.actionPlan.all })
    },
  })
}

export function useDeleteActionPlanItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, itemId }: { id: string; itemId: string }) => apiClient.deleteActionPlanItem(id, itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.actionPlan.all })
    },
  })
}

// ========== Benchmark Hooks ==========
export function useBenchmark(industry?: string, region?: string) {
  return useQuery({
    queryKey: queryKeys.benchmark.data(industry, region),
    queryFn: () => apiClient.getBenchmark(industry, region),
  })
}

export function useCompareBenchmark() {
  return useMutation({
    mutationFn: (data: CompareRequest) => apiClient.compareBenchmark(data),
  })
}

// ========== Blog Hooks ==========
export function useBlogPosts() {
  return useQuery({
    queryKey: queryKeys.blog.all,
    queryFn: () => apiClient.getBlogPosts(),
  })
}

export function useBlogPost(id: string) {
  return useQuery({
    queryKey: queryKeys.blog.detail(id),
    queryFn: () => apiClient.getBlogPost(id),
    enabled: !!id,
  })
}

// ========== Chat Hooks ==========
export function useSendChatMessage() {
  return useMutation({
    mutationFn: (data: ChatRequest) => apiClient.sendChatMessage(data),
  })
}

// ========== FAQ Hooks ==========
export function useFAQs() {
  return useQuery({
    queryKey: queryKeys.faq.all,
    queryFn: () => apiClient.getFAQs(),
  })
}

// ========== Insights Hooks ==========
export function useInsights(industry?: string) {
  return useQuery({
    queryKey: queryKeys.insights.all(industry),
    queryFn: () => apiClient.getInsights(industry),
  })
}

// ========== Notifications Hooks ==========
export function useNotifications() {
  return useQuery({
    queryKey: queryKeys.notifications.all,
    queryFn: () => apiClient.getNotifications(),
  })
}

export function useDeleteNotification() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => apiClient.deleteNotification(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all })
    },
  })
}

export function useMarkNotificationAsRead() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => apiClient.markNotificationAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all })
    },
  })
}

export function useUpdateNotificationSettings() {
  return useMutation({
    mutationFn: (settings: NotificationSettings) => apiClient.updateNotificationSettings(settings),
  })
}

// ========== Statistics Hooks ==========
export function useStatistics() {
  return useQuery({
    queryKey: queryKeys.statistics.all,
    queryFn: () => apiClient.getStatistics(),
  })
}

// ========== Success Stories Hooks ==========
export function useSuccessStories() {
  return useQuery({
    queryKey: queryKeys.successStories.all,
    queryFn: () => apiClient.getSuccessStories(),
  })
}

// ========== Support Hooks ==========
export function useSubmitContact() {
  return useMutation({
    mutationFn: (data: ContactRequest) => apiClient.submitContact(data),
  })
}

// ========== Profile Hooks ==========
export function useProfile() {
  return useQuery({
    queryKey: queryKeys.profile.me,
    queryFn: () => apiClient.getProfile(),
  })
}

export function useUpdateProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: ProfileUpdateRequest) => apiClient.updateProfile(data),
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.profile.me, data)
      queryClient.setQueryData(queryKeys.auth.me, data)
    },
  })
}

