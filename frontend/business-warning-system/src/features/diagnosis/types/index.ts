// Diagnosis Feature Types
import type { components } from '@/shared/types/api-generated'

export type DiagnosisRequest = components['schemas']['DiagnosisRequest']
export type DiagnosisResponse = components['schemas']['DiagnosisResponse']
export type DiagnosisHistory = components['schemas']['DiagnosisHistory']
export type DiagnosisRecordSimple = components['schemas']['DiagnosisRecordSimple']
export type DiagnosisRecordListItem = components['schemas']['DiagnosisRecordListItem']
export type DiagnosisRecordList = components['schemas']['DiagnosisRecordList']
export type BusinessSearchResult = components['schemas']['BusinessSearchResult']
export type BusinessSearchResponse = components['schemas']['BusinessSearchResponse']

export type AlertLevel = 'GREEN' | 'YELLOW' | 'ORANGE' | 'RED'

export interface ResultData {
  p_final: number
  alert: AlertLevel
  risk_components: {
    sales_risk: number
    customer_risk: number
    market_risk: number
  }
  recommendations: Array<{
    title: string
    description: string
    priority: 'high' | 'medium' | 'low'
  }>
  revenue_ratio?: number
}

export interface DiagnosisInfo {
  encoded_mct: string
  business_name: string
}
