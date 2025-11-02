# 📝 리팩터링 투두리스트

**시작일:** 2025-11-02  
**진행 방식:** Feature-Based Architecture  
**상세 계획:** `REFACTORING_PLAN.md` 참고

---

## 🎯 전체 진행 상황

```
[████████░░░░░░░░░░░░░░░░░░░░] 10% (1/10 Phase 완료)

✅ Phase 1: 기반 구조 생성
⬜ Phase 2: Shared 폴더 구성
⬜ Phase 3: features/auth 모듈 분리
⬜ Phase 4: features/diagnosis 모듈 분리
⬜ Phase 5: features/benchmark 모듈 분리
⬜ Phase 6: 나머지 features 모듈 분리
⬜ Phase 7: Pages 폴더 간소화
⬜ Phase 8: App 폴더 정리
⬜ Phase 9: 기존 파일 정리 및 테스트
⬜ Phase 10: 문서화 및 마무리
```

---

## Phase 1: 기반 구조 생성 ✅

### 목표
프로젝트의 새로운 폴더 구조를 생성하고 기본 설정 파일들을 준비합니다.

### 작업 항목
- [x] 리팩터링 계획 문서 작성
- [ ] 디렉터리 구조 생성
- [ ] tsconfig.json paths 설정 업데이트
- [ ] 각 feature 폴더에 기본 index.ts 생성
- [ ] 빌드 테스트

### 상세 작업
```bash
# 1. 디렉터리 생성
mkdir -p src/app/providers
mkdir -p src/pages
mkdir -p src/shared/{components/{layout,common,ui},hooks,lib,services/{pdf,onboarding},types}

# Feature 폴더 생성
mkdir -p src/features/auth/{components,hooks,api,store,types}
mkdir -p src/features/diagnosis/{components/{DiagnosisForm,ResultsView,RiskIndicators},hooks,api,utils,types}
mkdir -p src/features/benchmark/{components/CompareView,hooks,api,utils,types}
mkdir -p src/features/action-plan/{components,hooks,api,types}
mkdir -p src/features/statistics/{components,hooks,api,types}
mkdir -p src/features/insights/{components,hooks,api,types}
mkdir -p src/features/notifications/{components,hooks,api,types}
mkdir -p src/features/support/{components,hooks,api,types}
mkdir -p src/features/user/{components,hooks,api,types}

# 2. 각 feature에 index.ts 생성 (placeholder)
echo "// TODO: Export public API" > src/features/auth/index.ts
echo "// TODO: Export public API" > src/features/diagnosis/index.ts
echo "// TODO: Export public API" > src/features/benchmark/index.ts
echo "// TODO: Export public API" > src/features/action-plan/index.ts
echo "// TODO: Export public API" > src/features/statistics/index.ts
echo "// TODO: Export public API" > src/features/insights/index.ts
echo "// TODO: Export public API" > src/features/notifications/index.ts
echo "// TODO: Export public API" > src/features/support/index.ts
echo "// TODO: Export public API" > src/features/user/index.ts
```

---

## Phase 2: Shared 폴더 구성 ⬜

### 목표
공통으로 사용되는 리소스들을 shared 폴더로 이동합니다.

### 작업 항목
- [ ] 타입 파일 이동
  - [ ] `src/types/api-generated.ts` → `src/shared/types/api-generated.ts`
- [ ] API 클라이언트 분리
  - [ ] `src/lib/api.ts`에서 클라이언트 설정 추출 → `src/shared/lib/api-client.ts`
- [ ] 유틸 함수 이동
  - [ ] `src/lib/utils.ts` → `src/shared/lib/utils.ts`
- [ ] UI 컴포넌트 이동
  - [ ] `src/components/ui/*` → `src/shared/components/ui/*` (전체 이동)
- [ ] 레이아웃 컴포넌트 이동
  - [ ] `src/components/app-header.tsx` → `src/shared/components/layout/AppHeader.tsx`
  - [ ] `src/footer/footer.tsx` → `src/shared/components/layout/Footer.tsx`
  - [ ] `src/components/breadcrumb.tsx` → `src/shared/components/layout/Breadcrumb.tsx`
- [ ] 공통 컴포넌트 이동
  - [ ] `src/components/ScrollToTop.tsx` → `src/shared/components/common/ScrollToTop.tsx`
  - [ ] `src/components/theme-provider.tsx` → `src/shared/components/common/ThemeProvider.tsx`
  - [ ] `src/components/onboarding-tour.tsx` → `src/shared/components/common/OnboardingTour.tsx`
- [ ] 훅 이동
  - [ ] `src/hooks/use-toast.ts` → `src/shared/hooks/use-toast.ts`
  - [ ] `src/hooks/use-mobile.ts` → `src/shared/hooks/use-mobile.ts`
- [ ] 서비스 파일 분리
  - [ ] `src/lib/pdf-generator.ts` 분리:
    - `src/shared/services/pdf/pdfGenerator.ts` (메인 로직)
    - `src/shared/services/pdf/pdfTemplates.ts` (템플릿)
    - `src/shared/services/pdf/pdfStyles.ts` (스타일)
  - [ ] `src/lib/onboarding.ts` → `src/shared/services/onboarding/onboardingService.ts`
- [ ] Import 경로 수정 및 테스트

### 예상 파일 구조
```
shared/
├── components/
│   ├── layout/
│   │   ├── AppHeader.tsx
│   │   ├── Footer.tsx
│   │   └── Breadcrumb.tsx
│   ├── common/
│   │   ├── ScrollToTop.tsx
│   │   ├── ThemeProvider.tsx
│   │   └── OnboardingTour.tsx
│   └── ui/              # shadcn/ui (57개 파일)
├── hooks/
│   ├── use-toast.ts
│   └── use-mobile.ts
├── lib/
│   ├── api-client.ts    # NEW
│   └── utils.ts
├── services/
│   ├── pdf/
│   │   ├── pdfGenerator.ts
│   │   ├── pdfTemplates.ts
│   │   └── pdfStyles.ts
│   └── onboarding/
│       └── onboardingService.ts
└── types/
    ├── api-generated.ts
    └── common.types.ts  # NEW (필요시)
```

---

## Phase 3: features/auth 모듈 분리 ⬜

### 목표
인증 관련 로직을 독립된 feature 모듈로 분리합니다.

### 작업 항목
- [ ] Store 분리
  - [ ] `lib/api.ts`에서 Zustand store 추출 → `features/auth/store/authStore.ts`
- [ ] API 로직 분리
  - [ ] `lib/api.ts`에서 인증 API 추출:
    - Token refresh 로직
    - API middleware
    - Login/Signup/Logout API
    - User API
  - [ ] 생성: `features/auth/api/authApi.ts`
- [ ] 훅 생성
  - [ ] `features/auth/hooks/useAuth.ts` (통합 인증 훅)
  - [ ] `features/auth/hooks/useAuthInitializer.ts` (초기화 로직)
- [ ] 컴포넌트 분리
  - [ ] `pages/login/page.tsx` 분석 후 폼 컴포넌트 추출 → `features/auth/components/LoginForm.tsx`
  - [ ] `pages/signup/page.tsx` 분석 후 폼 컴포넌트 추출 → `features/auth/components/SignupForm.tsx`
- [ ] 타입 정의
  - [ ] `features/auth/types/index.ts` (api-generated에서 re-export)
- [ ] Public API 작성
  - [ ] `features/auth/index.ts` 작성
- [ ] Import 경로 수정 및 테스트

### 예상 파일 구조
```
features/auth/
├── components/
│   ├── LoginForm.tsx
│   └── SignupForm.tsx
├── hooks/
│   ├── useAuth.ts
│   └── useAuthInitializer.ts
├── api/
│   └── authApi.ts
├── store/
│   └── authStore.ts
├── types/
│   └── index.ts
└── index.ts            # Public exports
```

### Public API 예시
```typescript
// features/auth/index.ts
export { useAuthStore } from './store/authStore'
export { useAuth, useAuthInitializer } from './hooks'
export { useLogin, useSignup, useLogout, useCurrentUser } from './api/authApi'
export * from './types'
```

---

## Phase 4: features/diagnosis 모듈 분리 ⬜

### 목표
진단 관련 로직을 독립된 feature 모듈로 분리합니다. 가장 큰 파일(results/page.tsx 1,169줄)을 포함합니다.

### 작업 항목
- [ ] API 로직 분리
  - [ ] `lib/api.ts`에서 진단 API 추출 → `features/diagnosis/api/diagnosisApi.ts`
    - useDiagnose
    - useDiagnosisHistory
    - useDiagnosisRecords
    - useBusinessSearch
- [ ] 타입 정의
  - [ ] `features/diagnosis/types/index.ts` (AlertLevel, ResultData 등)
- [ ] RiskIndicators 컴포넌트 이동
  - [ ] `components/risk-card.tsx` → `features/diagnosis/components/RiskIndicators/RiskCard.tsx`
  - [ ] `components/risk-gauge.tsx` → `features/diagnosis/components/RiskIndicators/RiskGauge.tsx`
  - [ ] `components/action-card.tsx` → `features/diagnosis/components/RiskIndicators/ActionCard.tsx`
- [ ] ResultsView 분리 (pages/results/page.tsx 1,169줄)
  - [ ] 메인 컴포넌트: `features/diagnosis/components/ResultsView/index.tsx` (~150줄)
  - [ ] 헤더: `features/diagnosis/components/ResultsView/ResultsHeader.tsx` (~80줄)
  - [ ] 리스크 개요: `features/diagnosis/components/ResultsView/RiskOverviewSection.tsx` (~200줄)
  - [ ] 차트 섹션: `features/diagnosis/components/ResultsView/ChartsSection/` (폴더로, 여러 파일)
    - `index.tsx`
    - `TrendChart.tsx`
    - `RadarChart.tsx`
    - `DistributionChart.tsx`
  - [ ] 액션 섹션: `features/diagnosis/components/ResultsView/ActionsSection.tsx` (~150줄)
  - [ ] PDF 버튼: `features/diagnosis/components/PDFExportButton.tsx` (~50줄)
- [ ] DiagnosisForm 분리
  - [ ] `pages/diagnose/page.tsx` 분석 후 폼 추출 → `features/diagnosis/components/DiagnosisForm/`
- [ ] 유틸 함수 분리
  - [ ] `features/diagnosis/utils/riskCalculator.ts`
  - [ ] `features/diagnosis/utils/chartDataFormatter.ts`
- [ ] Public API 작성
  - [ ] `features/diagnosis/index.ts`
- [ ] Import 경로 수정 및 테스트

### 예상 파일 구조
```
features/diagnosis/
├── components/
│   ├── DiagnosisForm/
│   │   ├── index.tsx
│   │   ├── BusinessSearchInput.tsx
│   │   └── DiagnosisFormFields.tsx
│   ├── ResultsView/
│   │   ├── index.tsx                    # 메인 (~150줄)
│   │   ├── ResultsHeader.tsx
│   │   ├── RiskOverviewSection.tsx
│   │   ├── ChartsSection/
│   │   │   ├── index.tsx
│   │   │   ├── TrendChart.tsx
│   │   │   ├── RadarChart.tsx
│   │   │   └── DistributionChart.tsx
│   │   └── ActionsSection.tsx
│   ├── RiskIndicators/
│   │   ├── RiskCard.tsx
│   │   ├── RiskGauge.tsx
│   │   └── ActionCard.tsx
│   └── PDFExportButton.tsx
├── hooks/
│   └── useDiagnosis.ts
├── api/
│   └── diagnosisApi.ts
├── utils/
│   ├── riskCalculator.ts
│   └── chartDataFormatter.ts
├── types/
│   └── index.ts
└── index.ts
```

---

## Phase 5: features/benchmark 모듈 분리 ⬜

### 목표
벤치마크/비교 관련 로직을 독립된 feature 모듈로 분리합니다. 큰 파일(compare/page.tsx 1,140줄)을 포함합니다.

### 작업 항목
- [ ] API 로직 분리
  - [ ] `lib/api.ts`에서 벤치마크 API 추출 → `features/benchmark/api/benchmarkApi.ts`
    - useBenchmark
    - useCompare
- [ ] 타입 정의
  - [ ] `features/benchmark/types/index.ts`
- [ ] CompareView 분리 (pages/compare/page.tsx 1,140줄)
  - [ ] 메인 컴포넌트: `features/benchmark/components/CompareView/index.tsx` (~150줄)
  - [ ] 차트 섹션: `features/benchmark/components/CompareView/ComparisonCharts/` (폴더로)
    - `index.tsx`
    - `RevenueComparisonChart.tsx`
    - `CustomerComparisonChart.tsx`
    - `TrendComparisonChart.tsx`
  - [ ] 테이블: `features/benchmark/components/CompareView/ComparisonTable.tsx` (~300줄)
  - [ ] 헤더: `features/benchmark/components/CompareView/CompareHeader.tsx`
- [ ] 유틸 함수
  - [ ] `features/benchmark/utils/comparisonCalculator.ts`
- [ ] Public API 작성
  - [ ] `features/benchmark/index.ts`
- [ ] Import 경로 수정 및 테스트

### 예상 파일 구조
```
features/benchmark/
├── components/
│   └── CompareView/
│       ├── index.tsx
│       ├── CompareHeader.tsx
│       ├── ComparisonCharts/
│       │   ├── index.tsx
│       │   ├── RevenueComparisonChart.tsx
│       │   ├── CustomerComparisonChart.tsx
│       │   └── TrendComparisonChart.tsx
│       └── ComparisonTable.tsx
├── hooks/
│   └── useBenchmark.ts
├── api/
│   └── benchmarkApi.ts
├── utils/
│   └── comparisonCalculator.ts
├── types/
│   └── index.ts
└── index.ts
```

---

## Phase 6: 나머지 features 모듈 분리 ⬜

### 목표
나머지 도메인들을 각각 독립된 feature 모듈로 분리합니다.

### 작업 항목

#### 6-1. features/action-plan
- [ ] API: `lib/api.ts`에서 추출
- [ ] 컴포넌트: `pages/action-plan/page.tsx` 분석 후 분리
- [ ] Public API 작성

#### 6-2. features/statistics
- [ ] API: `lib/api.ts`에서 추출
- [ ] 컴포넌트: `pages/statistics/page.tsx` 분석 후 분리
- [ ] Public API 작성

#### 6-3. features/insights
- [ ] API: `lib/api.ts`에서 추출
- [ ] 컴포넌트: `pages/insights/page.tsx` 분석 후 분리
- [ ] Public API 작성

#### 6-4. features/notifications
- [ ] API: `lib/api.ts`에서 추출
- [ ] 컴포넌트: `pages/notifications/page.tsx` 분석 후 분리
- [ ] Public API 작성

#### 6-5. features/support
- [ ] API: `lib/api.ts`에서 추출 (FAQ, Contact 등)
- [ ] 컴포넌트: `pages/support/page.tsx`, `pages/faq/page.tsx` 분석 후 분리
- [ ] Public API 작성

#### 6-6. features/user
- [ ] 컴포넌트: `components/user-menu.tsx` → `features/user/components/UserMenu.tsx`
- [ ] 컴포넌트: `pages/settings/page.tsx` 분석 후 분리
- [ ] Public API 작성

---

## Phase 7: Pages 폴더 간소화 ⬜

### 목표
페이지 컴포넌트를 얇은 래퍼로 변경하고 폴더 구조를 단순화합니다.

### 작업 항목
- [ ] 폴더 구조 단순화
  - [ ] `pages/login/page.tsx` → `pages/login.tsx`
  - [ ] `pages/signup/page.tsx` → `pages/signup.tsx`
  - [ ] 모든 페이지에 동일 적용
- [ ] 각 페이지를 얇은 래퍼로 변경 (150줄 이하)
  - Feature 컴포넌트 조합
  - 라우팅 관련 로직만
  - SEO 메타데이터
- [ ] Import 경로 수정
- [ ] 빌드 테스트

### 변경 전/후 비교

#### 변경 전 (pages/results/page.tsx)
```typescript
// 1,169줄 - 모든 로직 포함
export default function ResultsPage() {
  // 상태 관리, API 호출, 비즈니스 로직, UI...
  return <div>...</div>
}
```

#### 변경 후 (pages/results.tsx)
```typescript
// ~50줄 - 얇은 래퍼
import { ResultsView } from '@/features/diagnosis'

export default function ResultsPage() {
  return <ResultsView />
}
```

---

## Phase 8: App 폴더 정리 ⬜

### 목표
앱 초기화 로직을 정리하고 providers를 분리합니다.

### 작업 항목
- [ ] Providers 분리
  - [ ] `App.tsx`에서 QueryClientProvider 추출 → `app/providers/QueryProvider.tsx`
  - [ ] `App.tsx`에서 AuthInitializer 추출 → `app/providers/AuthProvider.tsx`
- [ ] 라우팅 분리
  - [ ] `App.tsx`에서 Routes 추출 → `app/routes.tsx`
- [ ] App.tsx 간소화
  - [ ] Providers 조합만
- [ ] main.tsx 정리
- [ ] 빌드 테스트

### 예상 파일 구조
```
app/
├── App.tsx              # 최상위 앱 (Providers 조합)
├── routes.tsx           # 라우팅 설정
└── providers/
    ├── QueryProvider.tsx
    └── AuthProvider.tsx
```

---

## Phase 9: 기존 파일 정리 및 테스트 ⬜

### 목표
사용하지 않는 파일을 삭제하고 전체 테스트를 수행합니다.

### 작업 항목
- [ ] 이동된 파일 확인 및 삭제
  - [ ] `src/components/` (feature로 이동된 파일들)
  - [ ] `src/lib/api.ts` (완전히 분리되었는지 확인)
  - [ ] `src/footer/` (삭제)
- [ ] Import 경로 전체 점검
  - [ ] 모든 파일에서 `@/features/*` 사용 확인
  - [ ] 모든 파일에서 `@/shared/*` 사용 확인
- [ ] Lint 수정
  - [ ] `npm run lint` 실행
  - [ ] 에러 수정
- [ ] 빌드 테스트
  - [ ] `npm run build` 성공 확인
- [ ] 런타임 테스트
  - [ ] 모든 페이지 정상 작동 확인
  - [ ] 주요 기능 테스트 (로그인, 진단, 비교 등)

---

## Phase 10: 문서화 및 마무리 ⬜

### 목표
리팩터링 내용을 문서화하고 마무리합니다.

### 작업 항목
- [ ] 아키텍처 문서 업데이트
  - [ ] README.md 업데이트 (새 구조 반영)
  - [ ] 폴더 구조 다이어그램 추가
- [ ] API 문서 업데이트
  - [ ] API_REFERENCE.md 확인
  - [ ] API_USAGE.md 확인
- [ ] 각 feature README 작성 (선택)
  - [ ] features/auth/README.md
  - [ ] features/diagnosis/README.md
  - [ ] features/benchmark/README.md
- [ ] Git commit
  - [ ] 의미있는 커밋 메시지 작성
  - [ ] Conventional Commits 준수
- [ ] 리팩터링 회고
  - [ ] 개선된 점 정리
  - [ ] 추가 개선 사항 기록

---

## 📊 통계

### 리팩터링 전
- 총 파일 수: ~80개
- 300줄 이상 파일: 4개
- 최대 파일 크기: 1,169줄 (results/page.tsx)
- API 로직 파일: 1개 (api.ts, 694줄)

### 리팩터링 후 (예상)
- 총 파일 수: ~120개
- 300줄 이상 파일: 0개
- 최대 파일 크기: ~300줄
- Feature 모듈: 9개
- 평균 파일 크기: ~150줄

---

## 🔄 진행 중 이슈 트래킹

### 이슈 로그
(발생한 문제와 해결 방법을 기록)

| 날짜 | Phase | 이슈 | 해결 |
|-----|-------|------|------|
| - | - | - | - |

---

## 📞 도움이 필요할 때

### 질문 체크리스트
- [ ] `REFACTORING_PLAN.md` 확인했는가?
- [ ] 현재 Phase의 상세 작업 확인했는가?
- [ ] 이전 Phase가 완료되었는가?
- [ ] 빌드 에러가 있는가?

### 다음 작업
현재 Phase 1 진행 중 → **디렉터리 구조 생성** 부터 시작

---

**마지막 업데이트:** 2025-11-02  
**현재 진행:** Phase 1 - 리팩터링 계획 문서 작성 완료

