import { useEffect } from 'react'

import { useAuthStore } from '@/features/auth'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setAuthToken, setInitialized, isInitialized } = useAuthStore()

  useEffect(() => {
    async function initAuth() {
      try {
        // Refresh Token으로 Access Token 발급 시도
        const response = await fetch('http://localhost:8000/api/auth/refresh', {
          method: 'POST',
          credentials: 'include',
        })

        if (response.ok) {
          const data = await response.json()
          // AuthResponse 형태: { user: {...}, token: "..." }
          setAuthToken(data.token)
          console.log('✅ 자동 로그인 성공')
        } else {
          console.log('ℹ️ Refresh token 없음 - 비로그인 상태')
        }
      } catch (error) {
        console.log('ℹ️ 인증 초기화 실패:', error)
      } finally {
        setInitialized(true)
      }
    }

    if (!isInitialized) {
      initAuth()
    }
  }, [setAuthToken, setInitialized, isInitialized])

  // 초기화 전에는 로딩 표시
  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  return <>{children}</>
}

