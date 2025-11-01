import pandas as pd
import numpy as np
from typing import Dict, Optional
import os

# 프론트엔드 카테고리 -> 실제 데이터 업종명 매핑 (6개 대분류)
CATEGORY_MAPPING = {
    # 1. 음식점 (한식/양식/일식/중식 등)
    "restaurant": [
        # 한식 전체
        "한식-육류/고기", "백반/가정식", "한식-단품요리일반", "한식-해물/생선",
        "한식-국수/만두", "한식-국밥/설렁탕", "한식-찌개/전골", "한식-냉면",
        "한식뷔페", "한식-감자탕", "한식-죽", "한식-두부요리", "한정식",
        # 양식/일식/중식
        "양식", "일식당", "일식-덮밥/돈가스", "일식-우동/소바/라면",
        "일식-초밥/롤", "일식-샤브샤브", "일식-참치회",
        "중식당", "중식-훠궈/마라탕", "중식-딤섬/중식만두",
        "동남아/인도음식", "기타세계요리", "스테이크",
        # 분식/간편식
        "분식", "도시락", "기사식당", "구내식당/푸드코트"
    ],
    
    # 2. 카페/베이커리
    "cafe": [
        "카페", "커피전문점", "베이커리", "아이스크림/빙수", "도너츠",
        "마카롱", "테마카페", "테이크아웃커피", "와플/크로플", "탕후루"
    ],
    
    # 3. 패스트푸드/치킨
    "fastfood": [
        "치킨", "피자", "햄버거", "샌드위치/토스트", "꼬치구이"
    ],
    
    # 4. 주점/술집
    "pub": [
        "호프/맥주", "요리주점", "일반 유흥주점", "이자카야", "와인바",
        "룸살롱/단란주점", "민속주점", "포장마차"
    ],
    
    # 5. 식자재/편의점
    "retail": [
        "축산물", "식료품", "농산물", "청과물", "수산물", "주류",
        "반찬", "떡/한과", "떡/한과 제조", "미곡상", "담배", "건어물", "유제품",
        "인삼제품", "건강식품", "건강원", "차", "와인샵", "주스"
    ],
    
    # 6. 기타
    "other": [
        "식품 제조"
    ]
}

# 하위호환성을 위한 단일 매핑 (대표 업종)
INDUSTRY_MAPPING = {
    "restaurant": "한식-육류/고기",
    "cafe": "카페",
    "fastfood": "치킨",
    "pub": "호프/맥주",
    "retail": "식료품",
    "other": "식품 제조"
}

# 편의 함수로 export
def map_industry_code(industry_code: str) -> str:
    """
    프론트엔드 업종 코드를 실제 데이터의 업종명으로 변환
    (모듈 레벨에서도 사용 가능하도록)
    """
    return BenchmarkCalculator.map_industry_code(industry_code)

class BenchmarkCalculator:
    def __init__(self):
        self.merchants = None
        self.monthly_usage = None
        self.monthly_customers = None
        self.risk_data = None
        self.industry_stats = None
        # 프로젝트 루트에서 실행될 때를 고려한 경로
        self.base_path = os.path.join(os.path.dirname(__file__), '..')
    
    @staticmethod
    def map_industry_code(industry_code: str) -> str:
        """
        프론트엔드 업종 코드를 실제 데이터의 업종명으로 변환
        
        Args:
            industry_code: 프론트엔드에서 보낸 업종 코드 (예: "restaurant", "cafe")
        
        Returns:
            실제 데이터의 업종명 (예: "한식-육류/고기", "카페")
        """
        # 매핑 딕셔너리에서 찾기
        if industry_code in INDUSTRY_MAPPING:
            return INDUSTRY_MAPPING[industry_code]
        
        # 매핑이 없으면 원본 그대로 반환 (이미 한글 업종명일 수도 있음)
        return industry_code
        
    def load_data(self):
        """CSV 파일들 로드"""
        try:
            # 인코딩 처리 (한글 깨짐 방지)
            merchants_path = os.path.join(self.base_path, 'big_data_set1_f.csv')
            usage_path = os.path.join(self.base_path, 'ds2_monthly_usage.csv')
            customers_path = os.path.join(self.base_path, 'ds3_monthly_customers.csv')
            risk_path = os.path.join(self.base_path, 'risk_output.csv')
            
            self.merchants = pd.read_csv(merchants_path, encoding='cp949')
            self.monthly_usage = pd.read_csv(usage_path, encoding='cp949')
            self.monthly_customers = pd.read_csv(customers_path, encoding='cp949')
            self.risk_data = pd.read_csv(risk_path)
            
            print("[OK] 데이터 로드 완료")
            print(f"   - 가맹점: {len(self.merchants):,}개")
            print(f"   - 월별 사용 데이터: {len(self.monthly_usage):,}개")
            print(f"   - 위험도 데이터: {len(self.risk_data):,}개")
            return True
        except Exception as e:
            print(f"[ERROR] 데이터 로드 실패: {e}")
            import traceback
            traceback.print_exc()
            return False
    
    @staticmethod
    def parse_percentile_range(range_str) -> Optional[float]:
        """
        백분위 구간 문자열을 숫자로 변환
        예: '5_75-90%' -> 82.5, '1_10%미만' -> 5.0, '6_90%초과' -> 95.0
        """
        if pd.isna(range_str) or range_str == '-999999.9':
            return None
        
        range_str = str(range_str)
        
        # '10%미만' 처리
        if '10%미만' in range_str or '10% 미만' in range_str or '10%����' in range_str:
            return 5.0
        
        # '90%초과' 처리
        if '90%초과' in range_str or '90% 초과' in range_str or '90%�ʰ�' in range_str:
            return 95.0
        
        # 구간 처리 (예: '5_75-90%')
        try:
            if '_' in range_str:
                parts = range_str.split('_')[1]
                if '-' in parts:
                    # '75-90%' -> [75, 90]
                    values = parts.replace('%', '').split('-')
                    return (float(values[0]) + float(values[1])) / 2
        except:
            pass
        
        return None
    
    def calculate_industry_benchmarks(self, recent_months: int = 6) -> Dict:
        """
        업종별 벤치마크 통계 계산 (매출, 고객수, 위험도)
        
        Args:
            recent_months: 최근 몇 개월 데이터를 사용할지 (기본 6개월)
        
        Returns:
            업종별 통계 딕셔너리
        """
        if self.merchants is None or self.monthly_usage is None or self.risk_data is None:
            print("데이터가 로드되지 않았습니다. load_data()를 먼저 실행하세요.")
            return {}
        
        # 1. 가맹점과 월별 데이터 조인 (매출, 고객수) - HPSN_MCT_ZCD_NM이 업종 컬럼
        merged = self.monthly_usage.merge(
            self.merchants[['ENCODED_MCT', 'HPSN_MCT_ZCD_NM', 'HPSN_MCT_BZN_CD_NM', 'MCT_SIGUNGU_NM']], 
            on='ENCODED_MCT',
            how='inner'
        )
        
        # 최근 N개월 데이터만 사용
        merged['TA_YM'] = merged['TA_YM'].astype(str)
        merged = merged.sort_values('TA_YM', ascending=False)
        recent_months_data = merged.groupby('ENCODED_MCT').head(recent_months).copy()
        
        # 백분위를 실제 값으로 변환
        recent_months_data['sales_pct'] = recent_months_data['RC_M1_SAA'].apply(
            self.parse_percentile_range
        )
        recent_months_data['customers_pct'] = recent_months_data['RC_M1_UE_CUS_CN'].apply(
            self.parse_percentile_range
        )
        
        # 2. 위험도 데이터 조인
        risk_recent = self.risk_data.copy()
        risk_recent['TA_YM'] = pd.to_datetime(risk_recent['TA_YM']).dt.strftime('%Y%m')
        risk_recent = risk_recent.sort_values('TA_YM', ascending=False)
        risk_recent = risk_recent.groupby('ENCODED_MCT').head(recent_months)
        
        # 가맹점 정보와 조인하여 업종 추가
        risk_with_industry = risk_recent.merge(
            self.merchants[['ENCODED_MCT', 'HPSN_MCT_ZCD_NM']], 
            on='ENCODED_MCT',
            how='inner'
        )
        
        # 3. 업종별 매출/고객수 집계 (HPSN_MCT_ZCD_NM 사용)
        usage_stats = recent_months_data.groupby('HPSN_MCT_ZCD_NM').agg({
            'sales_pct': ['mean', 'median', 'std', 'count'],
            'customers_pct': ['mean', 'median', 'std'],
            'ENCODED_MCT': 'nunique'
        }).round(2)
        
        usage_stats.columns = [
            'sales_mean', 'sales_median', 'sales_std', 'sales_count',
            'customers_mean', 'customers_median', 'customers_std',
            'merchant_count'
        ]
        
        # 4. 업종별 위험도 집계
        risk_stats = risk_with_industry.groupby('HPSN_MCT_ZCD_NM').agg({
            'RiskScore': ['mean', 'median', 'std'],
            'ENCODED_MCT': 'nunique'
        }).round(4)
        
        risk_stats.columns = [
            'risk_mean', 'risk_median', 'risk_std', 'risk_merchant_count'
        ]
        
        # 5. 두 통계 합치기
        combined_stats = usage_stats.join(risk_stats, how='outer')
        
        self.industry_stats = combined_stats
        return combined_stats.to_dict('index')
    
    def get_benchmark_for_industry(self, industry_code: str, 
                                   base_revenue: int = 50000000,
                                   base_customers: int = 1000) -> Dict:
        """
        특정 업종의 벤치마크 데이터 반환
        
        Args:
            industry_code: 업종 코드 (영문 카테고리 또는 한글 업종명)
            base_revenue: 기준 매출 (백분위를 실제 금액으로 변환할 때 사용)
            base_customers: 기준 고객 수
        
        Returns:
            벤치마크 딕셔너리
        """
        if self.industry_stats is None:
            self.calculate_industry_benchmarks()
        
        # 프론트엔드 카테고리인지 확인
        if industry_code in CATEGORY_MAPPING:
            # 카테고리에 속한 모든 업종의 평균 계산
            return self._get_category_average(industry_code, base_revenue, base_customers)
        
        # 단일 업종명으로 처리
        mapped_industry = self.map_industry_code(industry_code)
        
        # 업종 코드가 없으면 전체 평균 반환
        if mapped_industry not in self.industry_stats.index:
            # 가장 많은 가맹점이 있는 업종 사용
            print(f"[WARN] 업종 '{industry_code}' (매핑: '{mapped_industry}')를 찾을 수 없습니다.")
            if len(self.industry_stats) > 0:
                mapped_industry = self.industry_stats['merchant_count'].idxmax()
                print(f"       '{mapped_industry}' 업종의 데이터를 반환합니다.")
            else:
                return self._get_default_benchmark()
        
        stats = self.industry_stats.loc[mapped_industry]
        
        # 백분위를 실제 값으로 변환 (백분위 * 기준값 / 100)
        avg_revenue = int(stats.get('sales_mean', 50) * base_revenue / 100)
        median_revenue = int(stats.get('sales_median', 50) * base_revenue / 100)
        avg_customers = int(stats.get('customers_mean', 50) * base_customers / 100)
        median_customers = int(stats.get('customers_median', 50) * base_customers / 100)
        
        # 위험도 (0~1 스케일을 0~100 스케일로 변환)
        avg_risk = float(stats.get('risk_mean', 0.65) * 100)
        median_risk = float(stats.get('risk_median', 0.65) * 100)
        
        return {
            "industry": mapped_industry,  # 실제 업종명 반환
            "industry_code": industry_code,  # 원본 코드도 포함
            "average_revenue": avg_revenue,
            "median_revenue": median_revenue,
            "average_customers": avg_customers,
            "median_customers": median_customers,
            "average_risk_score": round(avg_risk, 2),
            "median_risk_score": round(median_risk, 2),
            "merchant_count": int(stats.get('merchant_count', 0)),
            "sample_size": int(stats.get('sales_count', 0))
        }
    
    def _get_category_average(self, category_code: str, 
                             base_revenue: int = 50000000,
                             base_customers: int = 1000) -> Dict:
        """
        카테고리에 속한 모든 업종의 가중 평균 계산
        
        Args:
            category_code: 카테고리 코드 (예: "restaurant", "cafe")
            base_revenue: 기준 매출
            base_customers: 기준 고객 수
        
        Returns:
            카테고리 평균 벤치마크
        """
        if self.industry_stats is None:
            self.calculate_industry_benchmarks()
        
        # 카테고리에 속한 업종 목록
        industries_in_category = CATEGORY_MAPPING.get(category_code, [])
        
        if not industries_in_category:
            print(f"[WARN] 카테고리 '{category_code}'에 업종이 없습니다.")
            return self._get_default_benchmark()
        
        # 해당 업종들의 통계만 필터링
        valid_industries = [ind for ind in industries_in_category if ind in self.industry_stats.index]
        
        if not valid_industries:
            print(f"[WARN] 카테고리 '{category_code}'에 유효한 업종 데이터가 없습니다.")
            return self._get_default_benchmark()
        
        category_stats = self.industry_stats.loc[valid_industries]
        
        # 가맹점 수 기반 가중 평균 계산
        total_merchants = category_stats['merchant_count'].sum()
        
        if total_merchants == 0:
            return self._get_default_benchmark()
        
        # 가중 평균
        weighted_sales_mean = (category_stats['sales_mean'] * category_stats['merchant_count']).sum() / total_merchants
        weighted_customers_mean = (category_stats['customers_mean'] * category_stats['merchant_count']).sum() / total_merchants
        weighted_risk_mean = (category_stats['risk_mean'] * category_stats['risk_merchant_count']).sum() / category_stats['risk_merchant_count'].sum()
        
        # 중앙값은 단순 평균
        sales_median = category_stats['sales_median'].mean()
        customers_median = category_stats['customers_median'].mean()
        risk_median = category_stats['risk_median'].mean()
        
        # 백분위를 실제 값으로 변환
        avg_revenue = int(weighted_sales_mean * base_revenue / 100)
        median_revenue = int(sales_median * base_revenue / 100)
        avg_customers = int(weighted_customers_mean * base_customers / 100)
        median_customers = int(customers_median * base_customers / 100)
        
        # 위험도 (0~1 스케일을 0~100 스케일로 변환)
        avg_risk = float(weighted_risk_mean * 100)
        median_risk = float(risk_median * 100)
        
        print(f"[INFO] 카테고리 '{category_code}': {len(valid_industries)}개 업종, 총 {int(total_merchants)}개 가맹점")
        
        return {
            "industry": f"{category_code}_category",
            "industry_code": category_code,
            "category_name": category_code,
            "industries_count": len(valid_industries),
            "average_revenue": avg_revenue,
            "median_revenue": median_revenue,
            "average_customers": avg_customers,
            "median_customers": median_customers,
            "average_risk_score": round(avg_risk, 2),
            "median_risk_score": round(median_risk, 2),
            "merchant_count": int(total_merchants),
            "sample_size": int(category_stats['sales_count'].sum())
        }
    
    def _get_default_benchmark(self) -> Dict:
        """기본 벤치마크 반환"""
        return {
            "industry": "전체",
            "average_revenue": 45000000,
            "median_revenue": 38000000,
            "average_customers": 850,
            "median_customers": 720,
            "average_risk_score": 65.0,
            "median_risk_score": 63.0,
            "merchant_count": 0,
            "sample_size": 0
        }
    
    def print_all_industries(self):
        """모든 업종 목록 출력"""
        if self.merchants is None:
            self.load_data()
        
        # HPSN_MCT_ZCD_NM이 실제 업종 컬럼
        industries = self.merchants['HPSN_MCT_ZCD_NM'].value_counts()
        print("\n[INFO] 업종별 가맹점 수:")
        print("=" * 50)
        for industry, count in industries.items():
            if pd.notna(industry) and industry != '':
                print(f"{industry}: {count}개")
        print("=" * 50)
    
    def get_all_industry_benchmarks(self) -> Dict:
        """모든 업종의 벤치마크 반환"""
        if self.industry_stats is None:
            self.calculate_industry_benchmarks()
        
        result = {}
        for industry in self.industry_stats.index:
            if pd.notna(industry) and industry != '':
                result[industry] = self.get_benchmark_for_industry(industry)
        
        return result


# 사용 예시
if __name__ == "__main__":
    calc = BenchmarkCalculator()
    
    # 데이터 로드
    if calc.load_data():
        # 업종 목록 확인
        calc.print_all_industries()
        
        # 벤치마크 계산
        print("\n[INFO] 업종별 벤치마크 계산 중...")
        benchmarks = calc.calculate_industry_benchmarks(recent_months=6)
        
        # 결과 출력
        print("\n[OK] 계산 완료!")
        print(calc.industry_stats.head(10))
        
        # 모든 업종 벤치마크 출력
        print("\n[INFO] 업종별 벤치마크:")
        all_benchmarks = calc.get_all_industry_benchmarks()
        for industry, data in list(all_benchmarks.items())[:5]:
            print(f"\n{industry}:")
            print(f"  평균 매출: 원{data['average_revenue']:,}")
            print(f"  평균 고객수: {data['average_customers']:,}명")
            print(f"  평균 위험도: {data['average_risk_score']:.2f}")
            print(f"  가맹점 수: {data['merchant_count']}개")

