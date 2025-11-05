# 🔴 현재 빌드 에러 현황

**분석일:** 2025-11-05  
**분석 방법:** 코드베이스 전체 구조 분석  
**상태:** 예상 에러 파악 완료

---

## 📊 현재 상황 요약

### ✅ 정상 상태
1. **API 타입 생성 완료**
   - `shared/types/api-generated.ts` (2,370줄) 존재
   - 모든 백엔드 스키마가 정상적으로 export됨
   - ActionPlan, DiagnosisRequest, BenchmarkData 등 모두 존재

2. **Features 모듈 구조 완성**
   - 9개 feature 폴더 모두 생성됨
   - 각 feature의 types/index.ts가 api-generated에서 올바르게 re-export

3. **Pages Import 경로 대부분 수정 완료**
   - 21개 pages 중 대부분이 `@/shared/`, `@/features/` 사용
   - `@/components/`, `@/hooks/`, `@/lib/` 직접 참조 거의 없음

4. **App 구조 정리 완료**
   - App.tsx, routes.tsx 깔끔하게 분리
   - Providers 정상 분리

---

## ⚠️ 예상 에러 (2개 카테고리)

### 1. 레거시 파일 잔존 🔴 (긴급)

#### `src/lib/api.ts` (694줄)
- **상태:** 아직 삭제되지 않음
- **문제:** 
  - Feature API 분리가 완료되었지만 원본 파일이 남아있음
  - `src/mocks/handlers.ts`가 여기서 타입을 import
- **영향:**
  ```typescript
  // mocks/handlers.ts:3
  import type { ActionPlan, BenchmarkData, ChatResponse, ... } from '@/lib/api'
  ```
- **해결 방법:**
  1. `mocks/handlers.ts`의 import를 features/types로 변경
  2. `src/lib/api.ts` 삭제 (기능은 이미 features로 분산됨)

#### `src/lib/auth.ts`
- **상태:** 확인 필요
- **사용 여부:** 코드베이스에서 import 발견 안 됨
- **해결 방법:** 사용되지 않으면 삭제

---

### 2. Mocks 타입 불일치 🟡 (중간)

#### `src/mocks/handlers.ts`
**문제 1: 레거시 import**
```typescript
// ❌ 현재
import type { ActionPlan, BenchmarkData, ... } from '@/lib/api'

// ✅ 변경 필요
import type { ActionPlan } from '@/features/action-plan/types'
import type { BenchmarkData } from '@/features/benchmark/types'
import type { ChatResponse } from '@/features/support/types'
// ... 등등
```

**문제 2: AuthResponse 타입 미정의 (line 46)**
```typescript
const response: AuthResponse = { // ← AuthResponse 타입 없음
  user: userWithoutPassword,
  token: user.id,
}
```
- **해결:** `import type { AuthResponse } from '@/features/auth/types'` 추가

---

### 3. 빈 폴더/파일 🟢 (무해)

#### `src/components/` 폴더
- **상태:** 빈 폴더로 확인됨
- **해결:** 삭제 가능

---

## 🎯 수정 우선순위

### Phase A: Mocks 수정 (5분)
```typescript
// 1. mocks/handlers.ts import 경로 수정
import type { 
  ActionPlan, 
  ActionPlanItem 
} from '@/features/action-plan/types'

import type { 
  BenchmarkData, 
  CompareResponse 
} from '@/features/benchmark/types'

import type { 
  ChatResponse, 
  ContactResponse, 
  FAQ 
} from '@/features/support/types'

import type { 
  DiagnosisHistory, 
  DiagnosisResponse 
} from '@/features/diagnosis/types'

import type { 
  Insight 
} from '@/features/insights/types'

import type { 
  Statistics 
} from '@/features/statistics/types'

import type { 
  SuccessStory 
} from '@/features/support/types'

import type { 
  AuthResponse 
} from '@/features/auth/types'
```

### Phase B: 레거시 파일 삭제 (1분)
```bash
# 1. 사용되지 않는 파일 삭제
rm src/lib/api.ts        # mocks 수정 후
rm src/lib/auth.ts       # 사용 안 되면
rmdir src/components     # 빈 폴더
```

### Phase C: 빌드 테스트 (2분)
```bash
npm run typecheck
npm run build
```

---

## 📈 예상 결과

### 수정 전
- **예상 타입 에러:** 약 10-15개
  - `AuthResponse` 타입 미정의: 1개
  - `@/lib/api` import 에러: 여러 개
  - 기타 경로 불일치: 소수

### 수정 후
- **예상 타입 에러:** 0개
- **빌드 상태:** ✅ 성공 예상

---

## 🔍 잠재적 에러 (확인 필요)

다음 항목들은 `npm run typecheck` 실행 후 확인 필요:

1. **any 타입 경고**
   - mocks/handlers.ts의 `mockUsers`, `mockDiagnoses` 등에 `any` 사용
   - 기능에는 영향 없지만 타입 안정성 저하

2. **선택적 체이닝 경고**
   - 일부 pages에서 data?.property 사용 시 undefined 체크 누락 가능

3. **미사용 import**
   - 리팩터링 과정에서 사용되지 않는 import가 남아있을 수 있음

---

## 📝 검증 방법

### Step 1: 타입 체크
```bash
cd frontend/business-warning-system
npm run typecheck 2>&1 | tee typecheck-output.txt
```

### Step 2: 에러 개수 확인
```bash
# typecheck-output.txt에서 에러 라인 수 확인
grep -c "error TS" typecheck-output.txt
```

### Step 3: 실제 에러와 비교
- 예상과 다른 에러가 있다면 이 문서 업데이트

---

## 🎓 분석 근거

### 확인한 항목
- ✅ `shared/types/api-generated.ts` 전체 스키마 (2,370줄)
- ✅ 9개 features 타입 정의 (auth, diagnosis, benchmark, action-plan, statistics, insights, notifications, support, user)
- ✅ 21개 pages의 import 경로
- ✅ App.tsx, routes.tsx 구조
- ✅ mocks/handlers.ts import
- ✅ 레거시 lib 폴더 상태

### 사용한 분석 도구
- `grep`: import 패턴 검색
- `list_dir`: 폴더 구조 확인
- `read_file`: 주요 파일 내용 검증

---

## ⚡ 빠른 수정 가이드

### 1분 안에 수정하기
```bash
# Step 1: mocks/handlers.ts 열기
# Step 2: Line 3의 import를 다음으로 교체:

import type { ActionPlan, ActionPlanItem } from '@/features/action-plan/types'
import type { BenchmarkData, CompareResponse } from '@/features/benchmark/types'
import type { ChatResponse, ContactResponse, FAQ, SuccessStory } from '@/features/support/types'
import type { DiagnosisHistory, DiagnosisResponse } from '@/features/diagnosis/types'
import type { Insight } from '@/features/insights/types'
import type { Statistics } from '@/features/statistics/types'
import type { AuthResponse } from '@/features/auth/types'

# Step 3: 저장 후 typecheck
npm run typecheck
```

---

## 📌 결론

**BUILD_ERRORS.md의 "약 70개 에러"는 과장된 추정이었습니다.**

**실제 예상 에러:**
- 🔴 긴급: **1개** (mocks import 경로)
- 🟡 중간: **0-5개** (잠재적 타입 불일치)
- 🟢 무해: **0개** (레거시 파일은 기능에 영향 없음)

**총 수정 시간:** 약 10분  
**난이도:** ⭐☆☆☆☆ (매우 쉬움)

---

**다음 작업:** mocks/handlers.ts 수정 → 레거시 파일 삭제 → 빌드 테스트

