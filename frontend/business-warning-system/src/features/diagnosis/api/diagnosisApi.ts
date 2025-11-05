import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { client, handleResponse } from '@/shared/lib/api-client'

import type {
  BusinessSearchResponse,
  DiagnosisHistory,
  DiagnosisRecordList,
  DiagnosisRecordSimple,
  DiagnosisRequest,
  DiagnosisResponse,
} from '../types'

// ========== API Functions ==========
class DiagnosisApi {
  async searchBusiness(keyword: string): Promise<BusinessSearchResponse> {
    const response = await client.GET('/api/diagnose/search', {
      params: {
        query: { keyword },
      },
    })

    return handleResponse(response)
  }

  async predictDiagnosis(data: DiagnosisRequest): Promise<DiagnosisResponse> {
    const response = await client.POST('/api/diagnose/predict', {
      body: data,
    })

    return handleResponse(response)
  }

  async getDiagnosisHistory(encodedMct: string): Promise<DiagnosisHistory> {
    const response = await client.GET('/api/diagnose/history', {
      params: {
        query: { encoded_mct: encodedMct },
      },
    })

    return handleResponse(response)
  }

  async getRecentDiagnosis(): Promise<DiagnosisRecordSimple | null> {
    const response = await client.GET('/api/diagnose/recent')

    if (response.error || !response.data) {
      return null
    }

    return response.data
  }

  async getMyDiagnosisRecords(limit: number = 10): Promise<DiagnosisRecordList> {
    const response = await client.GET('/api/diagnose/my-records', {
      params: {
        query: { limit },
      },
    })

    return handleResponse(response)
  }
}

export const diagnosisApi = new DiagnosisApi()

// ========== React Query Hooks ==========
export function useBusinessSearch(keyword: string) {
  return useQuery({
    queryKey: ['businessSearch', keyword],
    queryFn: () => diagnosisApi.searchBusiness(keyword),
    enabled: keyword.length > 0,
  })
}

export function useDiagnose() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: diagnosisApi.predictDiagnosis,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['diagnosisHistory'] })
      queryClient.invalidateQueries({ queryKey: ['diagnosisRecords'] })
      queryClient.invalidateQueries({ queryKey: ['recentDiagnosis'] })
    },
  })
}

export function useDiagnosisHistory(encodedMct: string | undefined) {
  return useQuery({
    queryKey: ['diagnosisHistory', encodedMct],
    queryFn: () => diagnosisApi.getDiagnosisHistory(encodedMct!),
    enabled: !!encodedMct && encodedMct.length > 0,
  })
}

export function useRecentDiagnosis() {
  return useQuery({
    queryKey: ['recentDiagnosis'],
    queryFn: diagnosisApi.getRecentDiagnosis,
  })
}

export function useDiagnosisRecords(limit?: number) {
  return useQuery({
    queryKey: ['diagnosisRecords', limit],
    queryFn: () => diagnosisApi.getMyDiagnosisRecords(limit),
  })
}

