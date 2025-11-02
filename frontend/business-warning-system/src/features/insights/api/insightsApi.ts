import { useQuery } from '@tanstack/react-query'
import { client, handleResponse } from '@/shared/lib/api-client'
import type { Insight } from '../types'

class InsightsApi {
  async getInsights(industry?: string): Promise<Insight[]> {
    const response = await client.GET('/api/insights', {
      params: {
        query: {
          ...(industry && { industry }),
        },
      },
    })
    return handleResponse(response)
  }
}

export const insightsApi = new InsightsApi()

export function useInsights(industry?: string) {
  return useQuery({
    queryKey: ['insights', industry],
    queryFn: () => insightsApi.getInsights(industry),
  })
}

