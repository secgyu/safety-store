# 🏪 Business Warning System (자영업 위기 예측 시스템)

> 데이터 기반 자영업 위험도 분석 및 경영 개선 지원 플랫폼

## 📖 프로젝트 소개

**Business Warning System**은 자영업자들이 사업의 위험 요소를 사전에 파악하고 대응할 수 있도록 돕는 AI 기반 진단 및 컨설팅 플랫폼입니다. 빅콘테스트 데이터를 활용하여 매출, 고객, 시장 리스크를 종합적으로 분석하고, 맞춤형 개선 방안을 제시합니다.

### 🎯 주요 기능

- **🔍 사업체 위험도 진단**: 매출, 고객, 시장 3개 영역의 리스크 분석
- **📊 업종별 벤치마크**: 동일 업종 평균 대비 우리 가게의 위치 파악
- **📈 트렌드 분석**: 시계열 데이터 기반 경영 상태 추이 확인
- **💡 맞춤형 개선안**: AI 기반 경영 개선 추천사항 제공
- **📄 진단 리포트**: PDF 다운로드 및 공유 기능
- **🤖 AI 챗봇**: 경영 관련 질문에 실시간 답변
- **📚 경영 가이드**: FAQ, 성공 사례, 통계 자료 제공

## 🚀 빠른 시작

### 1️⃣ 저장소 클론

```bash
git clone <repository-url>
cd proj
```

### 2️⃣ 백엔드 설정 및 실행

```bash
cd backend

# 가상환경 생성 및 활성화
python -m venv .venv

# Windows
.venv\Scripts\activate

# Linux/Mac
source .venv/bin/activate

# 의존성 설치
pip install -r requirements.txt

# 환경 변수 설정 (선택사항)
# .env 파일 생성하여 설정 커스터마이징 가능

# 서버 실행
uvicorn app.main:app --reload
```

백엔드 서버: **http://localhost:8000**

- API 문서 (Swagger): http://localhost:8000/docs
- API 문서 (ReDoc): http://localhost:8000/redoc

### 3️⃣ 프론트엔드 설정 및 실행

```bash
cd frontend/business-warning-system

# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

프론트엔드 서버: **http://localhost:5173**

## 📊 데이터 구조

### 데이터 소스

프로젝트는 빅콘테스트에서 제공하는 실제 자영업 데이터를 활용합니다:

#### 1. **big_data_set1_f.csv** - 가맹점 기본 정보

- 총 4,187개 가맹점
- 가맹점명, 주소, 업종, 상권, 개설일, 폐업일 등

#### 2. **ds2_monthly_usage.csv** - 월별 매출 데이터

- 총 86,592개 레코드
- 매출금액, 매출건수, 고객수, 객단가, 업종/상권 비교 등

#### 3. **ds3_monthly_customers.csv** - 월별 고객 정보

- 총 86,592개 레코드
- 연령대별/성별 고객 비중, 재방문율, 거주/직장/유동 고객 비율 등

#### 4. **risk_output.csv** - 위험도 분석 결과

- 총 86,592개 레코드
- Sales_Risk, Customer_Risk, Market_Risk
- RiskScore (종합 위험도)
- Alert (GREEN, YELLOW, ORANGE, RED)

### Alert 레벨 기준

```python
# RiskScore 기준 (0-100 스케일)
RiskScore < 20  → GREEN   (안전)
20 ≤ RiskScore < 30 → YELLOW  (주의)
30 ≤ RiskScore < 40 → ORANGE  (경고)
RiskScore ≥ 40  → RED     (위험)
```

Alert 레벨을 재계산하려면:

```bash
cd backend/app
python a.py
```

## 🛠️ 기술 스택

### Backend

- **FastAPI** 0.115.0 - 고성능 웹 프레임워크
- **SQLAlchemy** 2.0.35 - ORM
- **FastAPI Users** 13.0.0 - 인증 및 사용자 관리
- **Pandas** 2.2.3 - 데이터 분석
- **OpenAI** 1.54.3 - AI 챗봇
- **SQLite** + aiosqlite - 데이터베이스
- **JWT** - 토큰 기반 인증

### Frontend

- **React** 19 - UI 라이브러리
- **TypeScript** 5.9 - 타입 안정성
- **Vite** 7.1 - 빌드 도구
- **TanStack Query** 5.90 - 서버 상태 관리
- **Zustand** 5.0 - 클라이언트 상태 관리
- **React Router** 7.9 - 라우팅
- **Tailwind CSS** 4.1 - 스타일링
- **Radix UI** - 접근성 높은 UI 컴포넌트
- **Recharts** 2.15 - 차트 라이브러리
- **Zod** 3.25 - 스키마 검증

## 📱 주요 화면

### 1. 대시보드

- 전체 사업체 현황 요약
- 최근 진단 결과
- 주요 지표 시각화

### 2. 진단 페이지

- 가게 검색 및 선택
- 즉시 위험도 분석
- 3가지 영역별 리스크 점수

### 3. 진단 결과 페이지

- 종합 위험도 점수
- 레이더 차트 시각화
- 시계열 트렌드 분석
- 업종 벤치마크 비교
- 맞춤형 개선 추천
- PDF 리포트 다운로드

### 4. 통계 & 인사이트

- 업종별 통계
- 지역별 분석
- 트렌드 분석

### API 타입 자동 생성

```bash
# 백엔드 서버 실행 후
cd frontend/business-warning-system
npm run generate-types
```

`openapi-typescript`를 사용하여 백엔드 OpenAPI 스펙에서 TypeScript 타입을 자동 생성합니다.
