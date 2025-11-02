import { create } from 'zustand'

interface AuthState {
  authToken: string | null
  isInitialized: boolean
  setAuthToken: (token: string) => void
  resetAuthToken: () => void
  setInitialized: (value: boolean) => void
}

// ========== Zustand Store (메모리만, localStorage 없음) ==========
export const useAuthStore = create<AuthState>((set) => ({
  authToken: null,
  isInitialized: false,
  setInitialized: (value: boolean) => set({ isInitialized: value }),
  resetAuthToken: () => set({ authToken: null }),
  setAuthToken: (token: string) => set({ authToken: token }),
}))

