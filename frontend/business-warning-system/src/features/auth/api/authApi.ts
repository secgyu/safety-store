import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { client, handleResponse } from '@/shared/lib/api-client'

import { useAuthStore } from '../store/authStore'
import type { LoginRequest, SignupRequest, User, UserResponse, UserUpdate } from '../types'

// ========== Token Refresh ==========
async function refreshAccessToken(): Promise<string | null> {
  try {
    const response = await fetch('http://localhost:8000/api/auth/refresh', {
      method: 'POST',
      credentials: 'include',
    })

    if (!response.ok) return null

    const data = await response.json()
    // AuthResponse 형태: { user: {...}, token: "..." }
    return data.token
  } catch (error) {
    console.error('Token refresh failed:', error)
    return null
  }
}

// ========== API Client Middleware ==========
client.use({
  onRequest: ({ request }) => {
    const authToken = useAuthStore.getState().authToken
    if (authToken) {
      request.headers.set('Authorization', `Bearer ${authToken}`)
    }
    return request
  },
  onResponse: async ({ response, request }) => {
    if (response.status === 401 && !request.url.includes('/api/auth/refresh')) {
      const newToken = await refreshAccessToken()

      if (newToken) {
        useAuthStore.getState().setAuthToken(newToken)
      } else {
        useAuthStore.getState().resetAuthToken()
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login'
        }
      }
    }
    return response
  },
})

// ========== API Functions ==========
class AuthApi {
  async login(data: LoginRequest): Promise<{ user: User; token: string }> {
    const response = await fetch('http://localhost:8000/api/auth/login-custom', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        email: data.email,
        password: data.password,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.detail || 'Login failed')
    }

    // AuthResponse 형태: { user: {...}, token: "..." }
    return response.json()
  }

  async signup(data: SignupRequest): Promise<User> {
    const response = await client.POST('/api/auth/register', { body: data })
    return handleResponse(response) as User
  }

  async getMe(): Promise<UserResponse> {
    const response = await client.GET('/api/auth/me')
    return handleResponse(response)
  }

  async logout(): Promise<void> {
    await fetch('http://localhost:8000/api/auth/logout-custom', {
      method: 'POST',
      credentials: 'include',
    })
  }

  async updateUser(data: UserUpdate): Promise<User> {
    const response = await client.PATCH('/api/users/me', { body: data })
    return handleResponse(response)
  }
}

export const authApi = new AuthApi()

// ========== React Query Hooks ==========
export function useLogin() {
  const { setAuthToken } = useAuthStore()

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      // AuthResponse에서 token 필드 사용
      setAuthToken(data.token)
    },
  })
}

export function useSignup() {
  return useMutation({
    mutationFn: authApi.signup,
  })
}

export function useLogout() {
  const queryClient = useQueryClient()
  const { resetAuthToken } = useAuthStore()

  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      resetAuthToken()
      queryClient.clear()
    },
  })
}

export function useAuth() {
  const { authToken } = useAuthStore()

  return useQuery({
    queryKey: ['auth', 'me'],
    queryFn: authApi.getMe,
    enabled: !!authToken,
  })
}

export function useCurrentUser() {
  const { authToken } = useAuthStore()

  return useQuery({
    queryKey: ['currentUser'],
    queryFn: authApi.getMe,
    enabled: !!authToken,
  })
}

export function useUpdateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: authApi.updateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUser'] })
    },
  })
}

