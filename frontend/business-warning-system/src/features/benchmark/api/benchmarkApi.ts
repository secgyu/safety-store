import { useMutation, useQuery } from '@tanstack/react-query'

import { client, handleResponse } from '@/shared/lib/api-client'

import type { BenchmarkData, CompareRequest, CompareResponse, ScatterData } from '../types'

// ========== API Functions ==========
class BenchmarkApi {
  async getBenchmark(industry?: string, region?: string): Promise<BenchmarkData> {
    const response = await client.GET('/api/benchmark', {
      params: {
        query: {
          ...(industry && { industry }),
          ...(region && { region }),
        },
      },
    })

    return handleResponse(response)
  }

  async compareBenchmark(data: CompareRequest): Promise<CompareResponse> {
    const response = await client.POST('/api/benchmark/compare', {
      body: data,
    })

    return handleResponse(response)
  }

  async getScatterData(industry?: string, limit?: number): Promise<ScatterData> {
    const response = await client.GET('/api/benchmark/scatter-data', {
      params: {
        query: {
          ...(industry && { industry }),
          ...(limit && { limit }),
        },
      },
    })

    return handleResponse(response)
  }
}

export const benchmarkApi = new BenchmarkApi()

// ========== React Query Hooks ==========
export function useBenchmark(industry?: string, region?: string) {
  return useQuery({
    queryKey: ['benchmark', industry, region],
    queryFn: () => benchmarkApi.getBenchmark(industry, region),
  })
}

export function useCompareBenchmark() {
  return useMutation({
    mutationFn: benchmarkApi.compareBenchmark,
  })
}

export function useScatterData(industry?: string, limit?: number) {
  return useQuery<ScatterData>({
    queryKey: ['scatterData', industry, limit],
    queryFn: () => benchmarkApi.getScatterData(industry, limit),
    enabled: !!industry,
  })
}

