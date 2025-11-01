import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import createClient from 'openapi-fetch'
import { create } from 'zustand'

import type { components, paths } from '@/types/api-generated'

// ========== Type Exports (from generated types) ==========
export type LoginRequest = components['schemas']['Body_auth_jwt_login_api_auth_login_post']
export type SignupRequest = components['schemas']['UserCreate']
export type User = components['schemas']['app__schemas__UserRead']
export type FastAPIUser = components['schemas']['app__routers__auth__UserRead']  // FastAPI Users response type
export type DiagnosisRequest = components['schemas']['DiagnosisRequest']
export type DiagnosisResponse = components['schemas']['DiagnosisResponse']
export type DiagnosisHistory = components['schemas']['DiagnosisHistory']
export type ActionPlanRequest = components['schemas']['ActionPlanRequest']
export type ActionPlan = components['schemas']['ActionPlan']
export type ActionPlanItem = components['schemas']['ActionPlanItem']
export type BenchmarkData = components['schemas']['BenchmarkData']
export type CompareRequest = components['schemas']['CompareRequest']
export type CompareResponse = components['schemas']['CompareResponse']
export type ChatRequest = components['schemas']['ChatRequest']
export type ChatResponse = components['schemas']['ChatResponse']
export type FAQ = components['schemas']['FAQ']
export type Insight = components['schemas']['Insight']
export type Notification = components['schemas']['Notification']
export type NotificationSettings = components['schemas']['NotificationSettings']
export type Statistics = components['schemas']['Statistics']
export type SuccessStory = components['schemas']['SuccessStory']
export type ContactRequest = components['schemas']['ContactRequest']
export type ContactResponse = components['schemas']['ContactResponse']
export type UserUpdate = components['schemas']['app__schemas__UserUpdate']
export type BearerResponse = components['schemas']['BearerResponse']
export type SuccessResponse = components['schemas']['SuccessResponse']
export type UserResponse = components['schemas']['UserResponse']
export type NotificationSettingsResponse = components['schemas']['NotificationSettingsResponse']

// ========== API Client ==========
const client = createClient<paths>({
  baseUrl: 'http://localhost:8000'
})

client.use({
  onRequest: ({ request }) => {
    const authToken = useAuthStore.getState().authToken
    if (authToken) {
      request.headers.set('Authorization', `Bearer ${authToken}`)
    }
    return request
  }
})

export const useAuthStore = create<{
  authToken: string | null
  setAuthToken: (token: string) => void
  resetAuthToken: () => void;
}>((set) => ({
  authToken: null,
  resetAuthToken: () => {

    set({ authToken: null })
  },
  setAuthToken: (token: string) => {

    set({ authToken: token })
  }
}));



// ========== Helper function to extract response data ==========
type NonUndefined<T> = T extends undefined ? never : T;

function handleResponse<T extends { data?: unknown; error?: unknown }>(response: T): NonUndefined<T['data']> {
  if (response.error) throw new Error(String(response.error) || 'API request failed')
  if (!response.data) throw new Error('No data returned from API')
  return response.data as NonUndefined<T['data']>
}

// ========== API Client Wrapper Class ==========
class ApiClient {
  // Auth
  async login(data: { username: string; password: string }): Promise<BearerResponse> {
    const formData = new URLSearchParams()
    formData.append('username', data.username)
    formData.append('password', data.password)

    const response = await client.POST('/api/auth/login', {
      // @ts-expect-error - URLSearchParams is valid for this endpoint
      body: formData.toString(),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })

    return handleResponse(response)!
  }

  async signup(data: SignupRequest): Promise<FastAPIUser> {
    const response = await client.POST('/api/auth/register', {
      body: data
    })

    return handleResponse(response)
  }

  async getMe(): Promise<UserResponse> {
    const response = await client.GET('/api/auth/me')
    return handleResponse(response)
  }

  // Diagnosis
  async predictDiagnosis(data: DiagnosisRequest): Promise<DiagnosisResponse> {
    const response = await client.POST('/api/diagnose/predict', {
      body: data
    })

    return handleResponse(response)
  }

  async getDiagnosisHistory(encodedMct: string): Promise<DiagnosisHistory> {
    const response = await client.GET('/api/diagnose/history', {
      params: {
        query: { encoded_mct: encodedMct }
      }
    })

    return handleResponse(response)
  }

  // Action Plan
  async getActionPlans(): Promise<ActionPlan[]> {
    const response = await client.GET('/api/action-plan')

    return handleResponse(response)
  }

  async createActionPlan(data: ActionPlanRequest): Promise<ActionPlan> {
    const response = await client.POST('/api/action-plan', {
      body: data
    })

    return handleResponse(response)
  }

  async updateActionPlan(id: string, data: Partial<ActionPlan>): Promise<ActionPlan> {
    const response = await client.PUT('/api/action-plan/{plan_id}', {
      params: {
        path: { plan_id: id }
      },
      // @ts-expect-error - Partial type mismatch with generated schema
      body: data
    })

    return handleResponse(response)
  }

  async deleteActionPlanItem(id: string, itemId: string): Promise<SuccessResponse> {
    const response = await client.DELETE('/api/action-plan/{plan_id}', {
      params: {
        path: { plan_id: id },
        query: { item_id: itemId }
      }
    })

    return handleResponse(response)
  }

  // Benchmark
  async getBenchmark(industry?: string, region?: string): Promise<BenchmarkData> {
    const response = await client.GET('/api/benchmark', {
      params: {
        query: {
          ...(industry && { industry }),
          ...(region && { region })
        }
      }
    })

    return handleResponse(response)
  }

  async compareBenchmark(data: CompareRequest): Promise<CompareResponse> {
    const response = await client.POST('/api/benchmark/compare', {
      body: data
    })

    return handleResponse(response)
  }

  async getScatterData(industry?: string, limit?: number): Promise<any> {
    const response = await client.GET('/api/benchmark/scatter-data', {
      params: {
        query: {
          ...(industry && { industry }),
          ...(limit && { limit })
        }
      }
    })

    return handleResponse(response)
  }


  // Chat
  async sendChatMessage(data: ChatRequest): Promise<ChatResponse> {
    const response = await client.POST('/api/chat', {
      body: data
    })

    return handleResponse(response)
  }

  // FAQ
  async getFAQs(): Promise<FAQ[]> {
    const response = await client.GET('/api/faq')

    return handleResponse(response)
  }

  // Insights
  async getInsights(industry?: string): Promise<Insight[]> {
    const response = await client.GET('/api/insights', {
      params: {
        query: {
          ...(industry && { industry })
        }
      }
    })

    return handleResponse(response)
  }

  // Notifications
  async getNotifications(): Promise<Notification[]> {
    const response = await client.GET('/api/notifications')

    return handleResponse(response)
  }

  async deleteNotification(id: string): Promise<SuccessResponse> {
    const response = await client.DELETE('/api/notifications/{notification_id}', {
      params: {
        path: { notification_id: id }
      }
    })

    return handleResponse(response)
  }

  async markNotificationAsRead(id: string): Promise<SuccessResponse> {
    const response = await client.PUT('/api/notifications/{notification_id}/read', {
      params: {
        path: { notification_id: id }
      }
    })

    return handleResponse(response)
  }

  async updateNotificationSettings(settings: NotificationSettings): Promise<NotificationSettingsResponse> {
    const response = await client.PUT('/api/notifications/settings', {
      body: settings
    })

    return handleResponse(response)
  }

  // Statistics
  async getStatistics(): Promise<Statistics> {
    const response = await client.GET('/api/statistics')

    return handleResponse(response)
  }

  // Success Stories
  async getSuccessStories(): Promise<SuccessStory[]> {
    const response = await client.GET('/api/success-stories')

    return handleResponse(response)
  }

  // Support
  async submitContact(data: ContactRequest): Promise<ContactResponse> {
    const response = await client.POST('/api/support/contact', {
      body: data
    })

    return handleResponse(response)
  }

  // User Profile
  async getProfile(): Promise<UserResponse> {
    const response = await client.GET('/api/user/profile')

    return handleResponse(response)
  }

  async updateProfile(data: UserUpdate): Promise<UserResponse> {
    const response = await client.PUT('/api/user/profile', {
      body: data
    })

    return handleResponse(response)
  }
}

export const apiClient = new ApiClient()

// ========== Query Keys ==========
export const queryKeys = {
  auth: {
    me: ['auth', 'me'] as const,
    all: ['auth'] as const,
  },
  diagnosis: {
    history: (encodedMct: string) => ['diagnosis', 'history', encodedMct] as const,
  },
  actionPlan: {
    all: ['action-plan'] as const,
  },
  benchmark: {
    data: (industry?: string, region?: string) => ['benchmark', industry, region] as const,
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
  const { setAuthToken } = useAuthStore()

  return useMutation({
    mutationFn: (data: { email: string; password: string }) =>
      apiClient.login({ username: data.email, password: data.password }),
    onSuccess: (data: BearerResponse) => {
      if (data.access_token) {
        setAuthToken(data.access_token)
      }
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.me })
    },
  })
}

export function useSignup() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: SignupRequest) => apiClient.signup(data),
    onSuccess: () => {
      // After signup, need to login separately with fastapi-users
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.me })
    },
  })
}

export function useAuth() {
  return useQuery({
    queryKey: queryKeys.auth.me,
    queryFn: async () => {
      try {
        return await apiClient.getMe()
      }
      catch (er) { // 401 에러라면 null 반환
        return null;
      }
    },
    retry: false,
    staleTime: 5 * 60 * 1000, // 5분

  })
}

export function useLogout() {
  const queryClient = useQueryClient()
  const { resetAuthToken } = useAuthStore()

  return () => {
    resetAuthToken()
    queryClient.invalidateQueries({ queryKey: queryKeys.auth.all })
    console.log('logout')
  }
}

// ========== Diagnosis Hooks ==========
export function usePredictDiagnosis() {
  return useMutation({
    mutationFn: (data: DiagnosisRequest) => apiClient.predictDiagnosis(data),
  })
}

export function useDiagnosisHistory(encodedMct: string) {
  return useQuery({
    queryKey: queryKeys.diagnosis.history(encodedMct),
    queryFn: () => apiClient.getDiagnosisHistory(encodedMct),
    enabled: !!encodedMct,
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

export function useScatterData(industry?: string, limit?: number) {
  return useQuery({
    queryKey: ['scatter-data', industry, limit],
    queryFn: () => apiClient.getScatterData(industry, limit),
    enabled: !!industry,
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
    mutationFn: (data: UserUpdate) => apiClient.updateProfile(data),
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.profile.me, data)
      queryClient.setQueryData(queryKeys.auth.me, data)
    },
  })
}
