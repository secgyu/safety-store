// Diagnosis Feature Types
export type {
  DiagnosisRequest,
  DiagnosisResponse,
  DiagnosisHistory,
  DiagnosisRecordSimple,
  DiagnosisRecordListItem,
  DiagnosisRecordList,
  BusinessSearchResult,
  BusinessSearchResponse,
} from '@/shared/types/api-generated'

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

