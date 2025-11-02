# 🏗️ 프론트엔드 리팩터링 계획서

**작성일:** 2025-11-02  
**리팩터링 방식:** Feature-Based Architecture  
**목표:** 코드는 유지하면서 폴더 구조를 개선하고 파일을 분리

---

## 📋 목차

1. [현재 문제점](#현재-문제점)
2. [목표 구조](#목표-구조)
3. [리팩터링 원칙](#리팩터링-원칙)
4. [단계별 실행 계획](#단계별-실행-계획)
5. [파일 매핑 테이블](#파일-매핑-테이블)
6. [체크리스트](#체크리스트)

---

## 🚨 현재 문제점

### 1. 거대한 파일들

- `pages/results/page.tsx`: **1,169줄**
- `pages/compare/page.tsx`: **1,140줄**
- `lib/api.ts`: **694줄**
- `lib/pdf-generator.ts`: **495줄**

### 2. 구조적 문제

- 모든 API 로직이 `api.ts` 한 파일에 집중
- 페이지 컴포넌트가 너무 많은 책임을 가짐
- 비즈니스 로직과 UI가 혼재
- 관련 파일들이 흩어져 있음

### 3. 유지보수 문제

- 특정 기능 수정 시 여러 폴더를 이동해야 함
- 코드 재사용이 어려움
- 의존성 파악이 어려움

---

## 🎯 목표 구조

```
src/
├── app/                          # 앱 초기화 및 설정
│   ├── App.tsx
│   ├── routes.tsx
│   └── providers/
│
├── features/                     # 도메인별 기능 모듈 ⭐
│   ├── auth/
│   │   ├── components/          # 인증 관련 컴포넌트
│   │   ├── hooks/               # 인증 관련 훅
│   │   ├── api/                 # 인증 API 호출
│   │   ├── store/               # 인증 상태 관리
│   │   ├── types/               # 인증 타입
│   │   └── index.ts             # Public exports
│   │
│   ├── diagnosis/               # 진단 기능
│   │   ├── components/
│   │   │   ├── DiagnosisForm/
│   │   │   ├── ResultsView/
│   │   │   └── RiskIndicators/
│   │   ├── hooks/
│   │   ├── api/
│   │   ├── utils/
│   │   ├── types/
│   │   └── index.ts
│   │
│   ├── benchmark/               # 벤치마크/비교
│   ├── action-plan/             # 실행계획
│   ├── statistics/              # 통계
│   ├── insights/                # 인사이트
│   ├── notifications/           # 알림
│   ├── support/                 # 고객지원
│   └── user/                    # 사용자 설정
│
├── shared/                       # 공유 리소스
│   ├── components/
│   │   ├── layout/              # AppHeader, Footer 등
│   │   ├── ui/                  # shadcn/ui 컴포넌트
│   │   └── common/              # 공통 컴포넌트
│   ├── hooks/                   # 공통 훅
│   ├── lib/                     # 유틸리티
│   ├── services/                # 공통 서비스
│   └── types/                   # 공통 타입
│
├── pages/                        # 페이지 (얇은 래퍼)
│   ├── index.tsx
│   ├── login.tsx
│   └── ...
│
└── assets/
```

---

## 📐 리팩터링 원칙

### 1. **Feature 모듈 구조**

각 feature는 독립적인 모듈로 구성:

```
features/[feature-name]/
├── components/          # UI 컴포넌트
├── hooks/              # React 훅
├── api/                # API 호출 로직
├── store/              # 상태 관리 (필요시)
├── utils/              # 유틸리티
├── types/              # 타입 정의
└── index.ts            # Public API (외부 노출)
```

### 2. **SSOT (Single Source of Truth)**

- API 타입은 `shared/types/api-generated.ts` (openapi-typescript로 생성)
- 각 feature의 `types/index.ts`에서 re-export
- 중복 타입 정의 제거

### 3. **관심사 분리**

- **Pages**: 라우팅과 feature 조합만 (100줄 이하)
- **Features**: 비즈니스 로직과 도메인 컴포넌트
- **Shared**: 재사용 가능한 공통 요소

### 4. **파일 크기 제한**

- 컴포넌트: ~200줄
- 유틸/서비스: ~300줄
- 페이지: ~150줄

### 5. **Import 규칙**

```typescript
// ❌ 나쁜 예
import { useAuth } from "@/features/auth/hooks/useAuth";

// ✅ 좋은 예
import { useAuth } from "@/features/auth";

// Feature의 index.ts에서 export
export { useAuth } from "./hooks/useAuth";
```

---

## 🚀 단계별 실행 계획

### **Phase 1: 기반 구조 생성** ✅

- [ ] 디렉터리 생성
- [ ] tsconfig paths 설정
- [ ] 기본 index.ts 파일 생성

### **Phase 2: Shared 폴더 구성**

- [ ] `shared/types/api-generated.ts` 이동
- [ ] `shared/lib/api-client.ts` 생성 (API 클라이언트 설정만)
- [ ] `shared/lib/utils.ts` 이동
- [ ] `shared/components/ui/` 이동 (shadcn/ui)
- [ ] `shared/components/layout/` 생성 (AppHeader, Footer 등)
- [ ] `shared/hooks/` 이동
- [ ] `shared/services/pdf/` 생성 (pdf-generator 분리)

### **Phase 3: features/auth 모듈 분리**

- [ ] `api.ts`에서 인증 관련 추출
  - `auth/api/authApi.ts`: API 호출
  - `auth/store/authStore.ts`: Zustand store
  - `auth/hooks/useAuth.ts`: 커스텀 훅
  - `auth/types/index.ts`: 타입
- [ ] 로그인/회원가입 컴포넌트 이동
  - `auth/components/LoginForm.tsx`
  - `auth/components/SignupForm.tsx`
- [ ] `auth/index.ts` public API 생성

### **Phase 4: features/diagnosis 모듈 분리**

- [ ] `api.ts`에서 진단 관련 추출
  - `diagnosis/api/diagnosisApi.ts`
  - `diagnosis/hooks/useDiagnosis.ts`
- [ ] `pages/results/page.tsx` 분리 (1,169줄)
  - `diagnosis/components/ResultsView/index.tsx` (메인)
  - `diagnosis/components/ResultsView/ResultsHeader.tsx`
  - `diagnosis/components/ResultsView/RiskOverviewSection.tsx`
  - `diagnosis/components/ResultsView/ChartsSection.tsx`
  - `diagnosis/components/ResultsView/ActionsSection.tsx`
- [ ] 진단 관련 컴포넌트 이동
  - `diagnosis/components/RiskIndicators/RiskCard.tsx`
  - `diagnosis/components/RiskIndicators/RiskGauge.tsx`
  - `diagnosis/components/RiskIndicators/ActionCard.tsx`
  - `diagnosis/components/DiagnosisForm/index.tsx`
- [ ] 타입 정의
  - `diagnosis/types/index.ts`

### **Phase 5: features/benchmark 모듈 분리**

- [ ] `api.ts`에서 벤치마크 관련 추출
  - `benchmark/api/benchmarkApi.ts`
  - `benchmark/hooks/useBenchmark.ts`
- [ ] `pages/compare/page.tsx` 분리 (1,140줄)
  - `benchmark/components/CompareView/index.tsx`
  - `benchmark/components/CompareView/ComparisonCharts.tsx`
  - `benchmark/components/CompareView/ComparisonTable.tsx`
- [ ] 타입 정의
  - `benchmark/types/index.ts`

### **Phase 6: 나머지 features 모듈 분리**

- [ ] `features/action-plan/`
- [ ] `features/statistics/`
- [ ] `features/insights/`
- [ ] `features/notifications/`
- [ ] `features/support/`
- [ ] `features/user/`

### **Phase 7: Pages 폴더 간소화**

- [ ] 각 페이지를 얇은 래퍼로 변경
- [ ] 폴더 구조 단순화 (`page.tsx` → `*.tsx`)
- [ ] Feature 컴포넌트 조합

### **Phase 8: App 폴더 정리**

- [ ] `App.tsx`에서 providers 분리
  - `app/providers/QueryProvider.tsx`
  - `app/providers/AuthProvider.tsx`
- [ ] 라우팅 분리
  - `app/routes.tsx`

### **Phase 9: 기존 파일 정리**

- [ ] 사용하지 않는 파일 삭제
- [ ] Import 경로 정리 확인
- [ ] Lint 에러 수정
- [ ] 빌드 테스트

---

## 📊 파일 매핑 테이블

| 현재 위치                          | 새 위치                                                             | 크기    | 분리 방식         |
| ---------------------------------- | ------------------------------------------------------------------- | ------- | ----------------- |
| `lib/api.ts` (694줄)               | 여러 파일로 분리                                                    |         | 도메인별 API 파일 |
| → 인증 관련                        | `features/auth/api/authApi.ts`                                      | ~150줄  |                   |
| → 진단 관련                        | `features/diagnosis/api/diagnosisApi.ts`                            | ~100줄  |                   |
| → 벤치마크 관련                    | `features/benchmark/api/benchmarkApi.ts`                            | ~80줄   |                   |
| → 기타 API                         | 각 feature/api/                                                     | ~50줄씩 |                   |
| → API Client 설정                  | `shared/lib/api-client.ts`                                          | ~100줄  |                   |
|                                    |                                                                     |         |                   |
| `pages/results/page.tsx` (1,169줄) | 여러 파일로 분리                                                    |         | 섹션별 분리       |
| → 메인                             | `features/diagnosis/components/ResultsView/index.tsx`               | ~150줄  |                   |
| → 헤더                             | `features/diagnosis/components/ResultsView/ResultsHeader.tsx`       | ~80줄   |                   |
| → 리스크 개요                      | `features/diagnosis/components/ResultsView/RiskOverviewSection.tsx` | ~200줄  |                   |
| → 차트 섹션                        | `features/diagnosis/components/ResultsView/ChartsSection.tsx`       | ~400줄  | 추가 분리 필요    |
| → 액션 섹션                        | `features/diagnosis/components/ResultsView/ActionsSection.tsx`      | ~150줄  |                   |
| → PDF 버튼                         | `features/diagnosis/components/PDFExportButton.tsx`                 | ~50줄   |                   |
|                                    |                                                                     |         |                   |
| `pages/compare/page.tsx` (1,140줄) | 여러 파일로 분리                                                    |         | 섹션별 분리       |
| → 메인                             | `features/benchmark/components/CompareView/index.tsx`               | ~150줄  |                   |
| → 차트                             | `features/benchmark/components/CompareView/ComparisonCharts.tsx`    | ~500줄  | 추가 분리 필요    |
| → 테이블                           | `features/benchmark/components/CompareView/ComparisonTable.tsx`     | ~300줄  |                   |
|                                    |                                                                     |         |                   |
| `lib/pdf-generator.ts` (495줄)     | 여러 파일로 분리                                                    |         | 기능별 분리       |
| → 메인 생성 로직                   | `shared/services/pdf/pdfGenerator.ts`                               | ~150줄  |                   |
| → 템플릿                           | `shared/services/pdf/pdfTemplates.ts`                               | ~200줄  |                   |
| → 스타일                           | `shared/services/pdf/pdfStyles.ts`                                  | ~100줄  |                   |
|                                    |                                                                     |         |                   |
| `components/risk-card.tsx`         | `features/diagnosis/components/RiskIndicators/RiskCard.tsx`         | 72줄    | 이동만            |
| `components/risk-gauge.tsx`        | `features/diagnosis/components/RiskIndicators/RiskGauge.tsx`        |         | 이동만            |
| `components/action-card.tsx`       | `features/diagnosis/components/RiskIndicators/ActionCard.tsx`       |         | 이동만            |
| `components/app-header.tsx`        | `shared/components/layout/AppHeader.tsx`                            |         | 이동만            |
| `components/user-menu.tsx`         | `features/user/components/UserMenu.tsx`                             |         | 이동만            |
| `footer/footer.tsx`                | `shared/components/layout/Footer.tsx`                               |         | 이동만            |
| `components/ui/*`                  | `shared/components/ui/*`                                            |         | 이동만            |

---

## ✅ 체크리스트

### 코드 품질

- [ ] 모든 파일이 300줄 이하
- [ ] 컴포넌트가 200줄 이하
- [ ] 페이지가 150줄 이하
- [ ] SSOT 원칙 준수 (타입 중복 없음)
- [ ] 각 feature의 index.ts가 public API 제공

### 구조

- [ ] feature 모듈이 독립적으로 동작
- [ ] shared 폴더에 도메인 로직 없음
- [ ] pages 폴더가 얇은 래퍼 역할만

### 빌드 & 테스트

- [ ] `npm run build` 성공
- [ ] Lint 에러 없음
- [ ] 모든 페이지 정상 작동
- [ ] Import 경로 정상

### 문서화

- [ ] 각 feature의 README.md (필요시)
- [ ] API 문서 업데이트
- [ ] 아키텍처 다이어그램 업데이트

---

## 📝 주의사항

### 1. 점진적 마이그레이션

- 한 번에 하나의 feature씩 마이그레이션
- 기존 코드는 삭제하지 않고 이동/분리만
- 각 단계마다 빌드 테스트
- **각 Phase 완료 후 Git Commit 필수**

### 2. Import 경로

```typescript
// tsconfig.json paths 설정 필요
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "@/features/*": ["./src/features/*"],
      "@/shared/*": ["./src/shared/*"],
      "@/app/*": ["./src/app/*"]
    }
  }
}
```

### 3. 의존성 방향

```
pages → features → shared
         ↓
      (내부 의존성만)
```

- Pages는 features에 의존
- Features는 shared에 의존
- **Features 간 직접 의존 금지** (shared를 통해서만)

### 4. 보안

- 인증 정보는 메모리만 (Zustand store)
- localStorage/sessionStorage 사용 금지
- API 토큰은 httpOnly 쿠키 사용

### 5. Git Commit 전략

각 Phase 완료 시 Conventional Commits 형식으로 커밋:

```bash
# Phase 1
git add .
git commit -m "refactor(structure): phase 1 - 기반 폴더 구조 생성

- features, shared, app 폴더 구조 생성
- 각 feature 모듈 기본 index.ts 생성
- tsconfig path alias 추가 (@/features, @/shared, @/app)"

# Phase 2
git commit -m "refactor(shared): phase 2 - shared 폴더 구성

- 공통 타입, 유틸, API 클라이언트 분리
- UI 컴포넌트 및 레이아웃 이동
- PDF 서비스 분리"

# Phase 3
git commit -m "refactor(auth): phase 3 - auth 모듈 분리

- 인증 API, store, hooks 분리
- 로그인/회원가입 컴포넌트 모듈화"

# ... 이하 동일 패턴
```

---

## 🎓 리팩터링 후 기대효과

### 1. 개발 생산성 향상

- 관련 파일들이 한 곳에 모여있어 찾기 쉬움
- 기능 추가/수정 시 영향 범위 파악 용이
- 코드 재사용성 증가

### 2. 유지보수성 향상

- 파일 크기가 작아져 이해하기 쉬움
- 책임이 명확하게 분리
- 테스트 작성 용이

### 3. 확장성 향상

- 새 기능 추가 시 독립적인 feature로 추가
- 마이크로프론트엔드로 확장 가능
- 팀 협업 시 충돌 최소화

### 4. 코드 품질 향상

- 명확한 구조로 코드 리뷰 용이
- 컨벤션 준수 강제
- SSOT 원칙으로 버그 감소

---

## 📚 참고 자료

- [Feature-Sliced Design](https://feature-sliced.design/)
- [React Project Structure Best Practices](https://dev.to/itswillt/folder-structures-in-react-projects-3dp8)
- [Bulletproof React](https://github.com/alan2207/bulletproof-react)

---

**다음 단계:** Phase 1 부터 시작
**진행 상황:** `TODO.md` 참고
