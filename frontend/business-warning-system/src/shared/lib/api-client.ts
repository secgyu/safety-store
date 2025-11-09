import createClient from 'openapi-fetch'

import type { paths } from '@/shared/types/api-generated'

// ========== API Client ==========
export const client = createClient<paths>({
  baseUrl: 'http://localhost:8000',
  credentials: 'include', // 쿠키 자동 전송
})

// ========== Helper function to handle response ==========
type NonUndefined<T> = T extends undefined ? never : T

export function handleResponse<T extends { data?: unknown; error?: unknown }>(
  response: T
): NonUndefined<T['data']> {
  if (response.error) throw new Error(String(response.error) || 'API request failed')
  if (!response.data) throw new Error('No data returned from API')
  return response.data as NonUndefined<T['data']>
}

