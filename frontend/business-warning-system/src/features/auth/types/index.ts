// Auth Feature Types
// Re-export from generated types
export type {
  BearerResponse,
  UserResponse,
  SuccessResponse,
} from '@/shared/types/api-generated'

export type LoginRequest = {
  username: string
  password: string
}

export type SignupRequest = {
  email: string
  password: string
  name: string
  business_name?: string | null
  industry?: string | null
  phone?: string | null
  is_active?: boolean | null
  is_superuser?: boolean | null
  is_verified?: boolean | null
}

export type User = {
  id: string
  email: string
  name: string
  business_name?: string | null
  industry?: string | null
  phone?: string | null
  is_active: boolean
  is_superuser: boolean
  is_verified: boolean
}

