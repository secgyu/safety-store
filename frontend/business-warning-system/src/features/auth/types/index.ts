// Auth Feature Types
import type { components } from '@/shared/types/api-generated'

export type BearerResponse = components['schemas']['BearerResponse']
export type UserResponse = components['schemas']['UserResponse']
export type SuccessResponse = components['schemas']['SuccessResponse']
export type User = components['schemas']['UserRead']
export type LoginRequest = components['schemas']['LoginRequest']
export type SignupRequest = components['schemas']['UserCreate']
export type UserUpdate = components['schemas']['UserUpdate']
export type AuthResponse = components['schemas']['AuthResponse']
