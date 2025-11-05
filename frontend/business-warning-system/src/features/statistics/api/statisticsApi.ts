import { useQuery } from '@tanstack/react-query'

import { client, handleResponse } from '@/shared/lib/api-client'

import type { Statistics } from '../types'

class StatisticsApi {
  async getStatistics(): Promise<Statistics> {
    const response = await client.GET('/api/statistics')
    return handleResponse(response)
  }
}

export const statisticsApi = new StatisticsApi()

export function useStatistics() {
  return useQuery({
    queryKey: ['statistics'],
    queryFn: statisticsApi.getStatistics,
  })
}

