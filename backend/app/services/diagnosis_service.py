import csv
import os
from typing import Optional
from datetime import datetime


class DiagnosisService:
    def __init__(self, csv_path: str = "risk_output.csv"):
        self.csv_path = csv_path
        self._data_cache = None
        
    def _load_csv(self):
        """CSV 파일을 메모리에 로드"""
        if self._data_cache is not None:
            return self._data_cache
            
        data = {}
        csv_full_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), self.csv_path)
        
        with open(csv_full_path, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                encoded_mct = row['ENCODED_MCT']
                if encoded_mct not in data:
                    data[encoded_mct] = []
                data[encoded_mct].append(row)
        
        self._data_cache = data
        return data
    
    def _load_business_data(self):
        """big_data_set1_f.csv 파일에서 가게 정보 로드"""
        businesses = []
        csv_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'big_data_set1_f.csv')
        
        # 한국어 CSV 파일은 보통 cp949 인코딩을 사용
        with open(csv_path, 'r', encoding='cp949') as f:
            reader = csv.DictReader(f)
            for row in reader:
                businesses.append({
                    'encoded_mct': row['ENCODED_MCT'],
                    'name': row['MCT_NM'],
                    'area': row['MCT_BSE_AR'],
                    'business_type': row['HPSN_MCT_ZCD_NM']
                })
        
        return businesses
    
    def search_businesses(self, keyword: str, limit: int = 10) -> list[dict]:
        """가게 이름으로 검색"""
        if not keyword or len(keyword.strip()) == 0:
            return []
        
        keyword = keyword.strip().lower()
        businesses = self._load_business_data()
        
        # 두 가지 매칭: 시작 매칭과 포함 매칭
        starts_with = []
        contains = []
        
        for business in businesses:
            name_lower = business['name'].lower()
            # 별표(*) 제거한 이름으로도 비교
            name_without_asterisk = name_lower.replace('*', '')
            
            if name_lower.startswith(keyword) or name_without_asterisk.startswith(keyword):
                starts_with.append(business)
            elif keyword in name_lower or keyword in name_without_asterisk:
                contains.append(business)
        
        # 시작 매칭을 우선, 그 다음 포함 매칭
        results = starts_with + contains
        
        # 중복 제거 (같은 ENCODED_MCT)
        seen = set()
        unique_results = []
        for business in results:
            if business['encoded_mct'] not in seen:
                seen.add(business['encoded_mct'])
                unique_results.append(business)
                if len(unique_results) >= limit:
                    break
        
        return unique_results
    
    def get_latest_diagnosis(self, encoded_mct: str) -> Optional[dict]:
        """특정 ENCODED_MCT의 최신 진단 데이터를 반환"""
        data = self._load_csv()
        
        if encoded_mct not in data:
            return None
        
        # 최신 데이터 (TA_YM 기준 정렬)
        records = sorted(data[encoded_mct], key=lambda x: x['TA_YM'], reverse=True)
        return records[0] if records else None
    
    def get_diagnosis_history(self, encoded_mct: str) -> list[dict]:
        """특정 ENCODED_MCT의 모든 진단 이력을 반환"""
        data = self._load_csv()
        
        if encoded_mct not in data:
            return []
        
        # TA_YM 기준 내림차순 정렬
        records = sorted(data[encoded_mct], key=lambda x: x['TA_YM'], reverse=True)
        return records
    
    def parse_diagnosis_response(self, row: dict) -> dict:
        """CSV row를 DiagnosisResponse 형태로 변환"""
        sales_risk = float(row['Sales_Risk'])
        customer_risk = float(row['Customer_Risk'])
        market_risk = float(row['Market_Risk'])
        risk_score = float(row['RiskScore'])
        p_final = float(row['p_final'])
        alert = row['Alert']
        ta_ym = row['TA_YM']
        
        # 0-100 스케일로 변환 (risk를 score로)
        sales_score = max(0, min(100, (1 - sales_risk) * 100))
        customer_score = max(0, min(100, (1 - customer_risk) * 100))
        market_score = max(0, min(100, (1 - market_risk) * 100))
        overall_score = max(0, min(100, (1 - risk_score) * 100))
        
        # 추천사항 생성
        recommendations = self._generate_recommendations(sales_risk, customer_risk, market_risk)
        
        # 인사이트 생성
        insights = self._generate_insights(row)
        
        return {
            "id": f"diagnosis-{row['ENCODED_MCT']}-{ta_ym}",
            "overall_score": round(overall_score, 2),
            "risk_level": alert,
            "components": {
                "sales": {
                    "score": round(sales_score, 2),
                    "trend": self._get_trend_message("매출", sales_risk)
                },
                "customer": {
                    "score": round(customer_score, 2),
                    "trend": self._get_trend_message("고객", customer_risk)
                },
                "market": {
                    "score": round(market_score, 2),
                    "trend": self._get_trend_message("시장", market_risk)
                }
            },
            "recommendations": recommendations,
            "insights": insights,
            "created_at": datetime.now().isoformat(),
            "ta_ym": ta_ym
        }
    
    def _get_trend_message(self, category: str, risk_value: float) -> str:
        """리스크 값에 따른 트렌드 메시지 생성"""
        if risk_value < 0.2:
            return f"{category} 상태가 매우 양호합니다."
        elif risk_value < 0.4:
            return f"{category} 상태가 안정적입니다."
        elif risk_value < 0.6:
            return f"{category}에 주의가 필요합니다."
        elif risk_value < 0.8:
            return f"{category} 상태가 좋지 않습니다."
        else:
            return f"{category}이 위험 수준입니다."
    
    def _generate_recommendations(self, sales_risk: float, customer_risk: float, market_risk: float) -> list[dict]:
        """리스크 값에 따른 추천사항 생성"""
        recommendations = []
        
        # 가장 높은 리스크 항목부터 우선순위 부여
        risks = [
            ("sales", sales_risk, "매출 개선", "매출 증대를 위한 프로모션 및 마케팅 강화가 필요합니다."),
            ("customer", customer_risk, "고객 관리", "고객 유지율 향상을 위한 고객 관리 시스템 도입을 고려하세요."),
            ("market", market_risk, "시장 대응", "시장 변화에 대응하기 위한 전략 수립이 필요합니다.")
        ]
        
        risks.sort(key=lambda x: x[1], reverse=True)
        
        for i, (category, risk, title, desc) in enumerate(risks[:3]):
            priority = "HIGH" if i == 0 else "MEDIUM" if i == 1 else "LOW"
            recommendations.append({
                "title": title,
                "description": desc,
                "priority": priority
            })
        
        return recommendations
    
    def _generate_insights(self, row: dict) -> list[str]:
        """데이터 기반 인사이트 생성"""
        insights = []
        
        risk_score = float(row['RiskScore'])
        alert = row['Alert']
        
        if alert == "GREEN":
            insights.append("현재 사업체 상태가 안정적입니다. 현재의 운영 방식을 유지하세요.")
        elif alert == "YELLOW":
            insights.append("일부 개선이 필요한 영역이 있습니다. 정기적인 모니터링을 권장합니다.")
        elif alert == "ORANGE":
            insights.append("주의가 필요한 상황입니다. 즉각적인 개선 조치를 취하세요.")
        else:  # RED
            insights.append("위험 수준입니다. 전문가 상담과 함께 긴급 대응이 필요합니다.")
        
        insights.append(f"종합 리스크 점수: {risk_score:.2%}")
        insights.append("정기적인 재무 분석과 고객 관리가 사업 성공의 핵심입니다.")
        
        return insights


# 싱글톤 인스턴스
diagnosis_service = DiagnosisService()

