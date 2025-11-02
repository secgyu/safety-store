# 🔧 빌드 에러 수정 및 타입 재생성 완료

**작업일:** 2025-11-02  
**상태:** 진행 중

---

## ✅ 완료된 작업

### 1. API 타입 재생성
```bash
✅ 백엔드에서 OpenAPI 스펙 생성
✅ openapi-typescript로 타입 파일 재생성
✅ src/shared/types/api-generated.ts 업데이트
```

### 2. 파일 정리
```bash
✅ 78개 중복 파일 삭제 (10,539줄 감소)
✅ Import 경로 수정 시작 (features 컴포넌트)
```

---

## ⚠️ 현재 빌드 에러 (약 70개)

### 주요 문제 분류

#### 1. API 타입 누락 (백엔드 스키마 문제)
다음 타입들이 백엔드 API 스키마에서 export되지 않음:
- `ActionPlan`, `ActionPlanItem`, `ActionPlanRequest`
- `DiagnosisRequest`, `DiagnosisResponse`, `DiagnosisHistory`
- `BenchmarkData`, `CompareRequest`, `CompareResponse`
- `BearerResponse`, `UserResponse`, `SuccessResponse`
- `Notification`, `NotificationSettings`
- `FAQ`, `ContactRequest`, `ChatRequest`
- `Statistics`, `Insight`, `SuccessStory`

**해결방법:** 백엔드에서 Pydantic 모델을 OpenAPI 스키마에 제대로 노출하거나, 프론트에서 임시로 정의

#### 2. Import 경로 (pages/ 폴더 - 50+개)
```typescript
// ❌ 현재
import { Button } from '@/components/ui/button'
import { AppHeader } from '@/components/app-header'
import { useToast } from '@/hooks/use-toast'

// ✅ 변경 필요
import { Button } from '@/shared/components/ui/button'
import { AppHeader } from '@/shared/components/layout/AppHeader'
import { useToast } from '@/shared/hooks/use-toast'
```

#### 3. 기타 타입 에러
- 일부 컴포넌트의 any 타입 파라미터
- mocks/handlers.ts의 AuthResponse 타입 미정의

---

## 🎯 다음 단계 (우선순위)

### Phase A: 임시 타입 정의 (빠른 빌드 성공)
`src/shared/types/legacy-types.ts` 생성:
```typescript
// 백엔드 스키마에서 누락된 타입들을 임시로 정의
export interface ActionPlan { ... }
export interface DiagnosisRequest { ... }
// etc.
```

### Phase B: Import 경로 일괄 수정
```bash
# pages/ 폴더의 모든 파일 import 경로 업데이트
find src/pages -name "*.tsx" -exec sed -i 's|@/components/|@/shared/components/|g' {} \;
find src/pages -name "*.tsx" -exec sed -i 's|@/hooks/|@/shared/hooks/|g' {} \;
```

### Phase C: 백엔드 스키마 수정 (근본 해결)
백엔드에서 Pydantic 모델을 OpenAPI 컴포넌트로 제대로 export

---

## 📝 권장 접근

### 옵션 1: 빠른 해결 (임시)
1. 임시 타입 파일 생성
2. Feature types에서 임시 타입 import
3. Import 경로 일괄 수정
4. 빌드 성공 → 커밋

### 옵션 2: 근본 해결 (시간 소요)
1. 백엔드 schemas/__init__.py 수정
2. OpenAPI 스펙 재생성
3. 타입 재생성
4. Import 경로 수정

---

## 💡 현재 선택

**옵션 1 추천** - 리팩터링 완료가 목표이므로 임시 타입으로 빠르게 빌드 성공시키고, 백엔드 스키마는 별도 이슈로 처리

---

**다음 작업:** 임시 타입 정의 또는 import 경로 일괄 수정?

