import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import createClient from 'openapi-fetch'
import type { paths, components } from '@/types/api-generated'

// ========== Type Exports (from generated types) ==========
export type LoginRequest = components['schemas']['Body_auth_jwt_login_api_auth_login_post']
export type SignupRequest = components['schemas']['UserCreate']
export type User = components['schemas']['UserRead']
export type DiagnosisRequest = components['schemas']['DiagnosisRequest']
export type DiagnosisResponse = components['schemas']['DiagnosisResponse']
export type DiagnosisHistory = components['schemas']['DiagnosisHistory']
export type ActionPlanRequest = components['schemas']['ActionPlanRequest']
export type ActionPlan = components['schemas']['ActionPlan']
export type ActionPlanItem = components['schemas']['ActionPlanItem']
export type BenchmarkData = components['schemas']['BenchmarkData']
export type CompareRequest = components['schemas']['CompareRequest']
export type CompareResponse = components['schemas']['CompareResponse']
export type BlogPost = components['schemas']['BlogPost']
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

// ========== API Client ==========
const client = createClient<paths>({
  baseUrl: 'http://localhost:8000'
})

// Token Management
let authToken: string | null = null

export function setAuthToken(token: string | null) {
  authToken = token
  if (token) {
    localStorage.setItem('auth_token', token)
    // Set Authorization header for all future requests
    client.use({
      onRequest({ request }) {
        request.headers.set('Authorization', `Bearer ${token}`)
        return request
      }
    })
  } else {
    localStorage.removeItem('auth_token')
  }
}

export function getAuthToken(): string | null {
  if (!authToken) {
    authToken = localStorage.getItem('auth_token')
    if (authToken) {
      setAuthToken(authToken) // Re-initialize middleware
    }
  }
  return authToken
}

// Initialize token on load
getAuthToken()

// ========== API Client Wrapper Class ==========
class ApiClient {
  // Auth
  async login(data: { username: string; password: string }) {
    const formData = new FormData()
    formData.append('username', data.username)
    formData.append('password', data.password)

    const { data: response, error } = await client.POST('/api/auth/login', {
      // @ts-expect-error - FormData is valid for this endpoint
      body: formData
    })

    if (error) throw new Error('Login failed')
    return response
  }

  async signup(data: SignupRequest) {
    const { data: response, error } = await client.POST('/api/auth/register', {
      body: data
    })

    if (error) throw new Error(error.detail as string || 'Signup failed')
    return response
  }

  async getMe() {
    const { data: response, error } = await client.GET('/api/auth/me')

    if (error) throw new Error('Failed to get user')
    return response
  }

  // Diagnosis
  async predictDiagnosis(data: DiagnosisRequest) {
    const { data: response, error } = await client.POST('/api/diagnose/predict', {
      body: data
    })

    if (error) throw new Error('Diagnosis prediction failed')
    return response!
  }

  async getDiagnosisHistory(encodedMct: string) {
    const { data: response, error } = await client.GET('/api/diagnose/history', {
      params: {
        query: { encoded_mct: encodedMct }
      }
    })

    if (error) throw new Error('Failed to get diagnosis history')
    return response!
  }

  // Action Plan
  async getActionPlans() {
    const { data: response, error } = await client.GET('/api/action-plan')

    if (error) throw new Error('Failed to get action plans')
    return response!
  }

  async createActionPlan(data: ActionPlanRequest) {
    const { data: response, error } = await client.POST('/api/action-plan', {
      body: data
    })

    if (error) throw new Error('Failed to create action plan')
    return response!
  }

  async updateActionPlan(id: string, data: Partial<ActionPlan>) {
    const { data: response, error } = await client.PUT('/api/action-plan/{plan_id}', {
      params: {
        path: { plan_id: id }
      },
      // @ts-expect-error - Partial type mismatch
      body: data
    })

    if (error) throw new Error('Failed to update action plan')
    return response!
  }

  async deleteActionPlanItem(id: string, itemId: string) {
    const { data: response, error } = await client.DELETE('/api/action-plan/{plan_id}', {
      params: {
        path: { plan_id: id },
        query: { item_id: itemId }
      }
    })

    if (error) throw new Error('Failed to delete action plan item')
    return response!
  }

  // Benchmark
  async getBenchmark(industry?: string, region?: string) {
    const { data: response, error } = await client.GET('/api/benchmark', {
      params: {
        query: {
          ...(industry && { industry }),
          ...(region && { region })
        }
      }
    })

    if (error) throw new Error('Failed to get benchmark')
    return response!
  }

  async compareBenchmark(data: CompareRequest) {
    const { data: response, error } = await client.POST('/api/benchmark/compare', {
      body: data
    })

    if (error) throw new Error('Failed to compare benchmark')
    return response!
  }

  // Blog
  async getBlogPosts() {
    const { data: response, error } = await client.GET('/api/blog')

    if (error) throw new Error('Failed to get blog posts')
    return response!
  }

  async getBlogPost(id: string) {
    const { data: response, error } = await client.GET('/api/blog/{post_id}', {
      params: {
        path: { post_id: id }
      }
    })

    if (error) throw new Error('Failed to get blog post')
    return response!
  }

  // Chat
  async sendChatMessage(data: ChatRequest) {
    const { data: response, error } = await client.POST('/api/chat', {
      body: data
    })

    if (error) throw new Error('Failed to send chat message')
    return response!
  }

  // FAQ
  async getFAQs() {
    const { data: response, error } = await client.GET('/api/faq')

    if (error) throw new Error('Failed to get FAQs')
    return response!
  }

  // Insights
  async getInsights(industry?: string) {
    const { data: response, error } = await client.GET('/api/insights', {
      params: {
        query: {
          ...(industry && { industry })
        }
      }
    })

    if (error) throw new Error('Failed to get insights')
    return response!
  }

  // Notifications
  async getNotifications() {
    const { data: response, error } = await client.GET('/api/notifications')

    if (error) throw new Error('Failed to get notifications')
    return response!
  }

  async deleteNotification(id: string) {
    const { data: response, error } = await client.DELETE('/api/notifications/{notification_id}', {
      params: {
        path: { notification_id: id }
      }
    })

    if (error) throw new Error('Failed to delete notification')
    return response!
  }

  async markNotificationAsRead(id: string) {
    const { data: response, error } = await client.PUT('/api/notifications/{notification_id}/read', {
      params: {
        path: { notification_id: id }
      }
    })

    if (error) throw new Error('Failed to mark notification as read')
    return response!
  }

  async updateNotificationSettings(settings: NotificationSettings) {
    const { data: response, error } = await client.PUT('/api/notifications/settings', {
      body: settings
    })

    if (error) throw new Error('Failed to update notification settings')
    return response!
  }

  // Statistics
  async getStatistics() {
    const { data: response, error } = await client.GET('/api/statistics')

    if (error) throw new Error('Failed to get statistics')
    return response!
  }

  // Success Stories
  async getSuccessStories() {
    const { data: response, error } = await client.GET('/api/success-stories')

    if (error) throw new Error('Failed to get success stories')
    return response!
  }

  // Support
  async submitContact(data: ContactRequest) {
    const { data: response, error } = await client.POST('/api/support/contact', {
      body: data
    })

    if (error) throw new Error('Failed to submit contact request')
    return response!
  }

  // User Profile
  async getProfile() {
    const { data: response, error } = await client.GET('/api/user/profile')

    if (error) throw new Error('Failed to get profile')
    return response!
  }

  async updateProfile(data: UserUpdate) {
    const { data: response, error } = await client.PUT('/api/user/profile', {
      body: data
    })

    if (error) throw new Error('Failed to update profile')
    return response!
  }
}

export const apiClient = new ApiClient()

// ========== Query Keys ==========
export const queryKeys = {
  auth: {
    me: ['auth', 'me'] as const,
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
    mutationFn: (data: { email: string; password: string }) =>
      apiClient.login({ username: data.email, password: data.password }),
    onSuccess: (data) => {
      if (data && 'access_token' in data) {
        setAuthToken(data.access_token as string)
      }
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.me })
    },
  })
}

export function useSignup() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: SignupRequest) => apiClient.signup(data),
    onSuccess: (data) => {
      if (data && 'access_token' in data) {
        setAuthToken(data.access_token as string)
      }
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.me })
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
    setAuthToken(null)
    queryClient.clear()
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
    mutationFn: (data: UserUpdate) => apiClient.updateProfile(data),
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.profile.me, data)
      queryClient.setQueryData(queryKeys.auth.me, data)
    },
  })
}
