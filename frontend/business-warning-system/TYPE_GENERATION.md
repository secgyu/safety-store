# OpenAPI 타입 자동 생성

이 프로젝트는 백엔드 OpenAPI 스키마에서 TypeScript 타입을 자동 생성하여 프론트엔드와 백엔드 간의 타입 안정성을 보장합니다.

## 🚀 타입 생성 방법

### 1. 백엔드 OpenAPI 스키마 추출

```bash
# 백엔드 가상환경의 Python으로 실행
C:\Users\USER\Desktop\safety-analystic\proj\backend\.venv\Scripts\python.exe C:\Users\USER\Desktop\safety-analystic\proj\backend\export_openapi_simple.py
```

이 명령은 `frontend/business-warning-system/openapi.json` 파일을 생성합니다.

### 2. TypeScript 타입 생성

```bash
cd frontend/business-warning-system
npm run generate-types:file
```

또는 백엔드 서버가 실행 중이라면:

```bash
npm run generate-types
```

이 명령은 `src/types/api-generated.ts` 파일을 생성합니다.

## 📦 사용된 패키지

- **openapi-typescript**: OpenAPI 스키마에서 TypeScript 타입 생성
- **openapi-fetch**: 타입 안전한 fetch 클라이언트

## ✅ 장점

1. **완벽한 타입 동기화**: 백엔드 스키마 변경 시 자동 반영
2. **수동 관리 불필요**: 스키마 불일치 방지
3. **IDE 자동완성**: 엔드포인트, 파라미터 자동 제안
4. **컴파일 타임 검증**: API 변경 사항 즉시 감지
5. **타입 안전성**: 모든 request/response가 생성된 타입 사용

## 🔄 워크플로우

1. 백엔드 스키마 변경 (`backend/app/schemas/__init__.py`)
2. `python backend/export_openapi_simple.py` 실행 → OpenAPI JSON 생성
3. `npm run generate-types:file` 실행 → TypeScript 타입 생성
4. TypeScript 컴파일러가 타입 오류 표시
5. `api.ts`에서 필요 시 타입 수정

## 📋 타입 사용 예시

### 1. Request/Response 타입

```typescript
import type { User, DiagnosisRequest, DiagnosisResponse } from "@/lib/api";

// 자동으로 생성된 타입 사용
const request: DiagnosisRequest = {
  encodedMct: "ABC123",
};

const response: DiagnosisResponse = await apiClient.predictDiagnosis(request);
```

### 2. API 클라이언트 타입 안전성

```typescript
// openapi-fetch가 자동으로 타입 체크
const { data, error } = await client.POST("/api/diagnose/predict", {
  body: { encodedMct: "ABC123" }, // 타입 체크됨
});
```

### 3. React Query Hooks

```typescript
// 완벽한 타입 추론
const { data } = usePredictDiagnosis();
// data의 타입이 DiagnosisResponse로 자동 추론됨
```

## 🎯 주요 타입

### Auth

- `LoginRequest`: 로그인 요청 (username, password)
- `SignupRequest`: 회원가입 요청
- `User`: 사용자 정보 (id는 number)
- `BearerResponse`: JWT 토큰 응답

### Diagnosis

- `DiagnosisRequest`: 진단 요청 (encodedMct)
- `DiagnosisResponse`: 진단 결과
- `DiagnosisHistory`: 진단 이력

### Action Plan

- `ActionPlanRequest`: 개선 계획 요청
- `ActionPlan`: 개선 계획 (userId는 number)
- `ActionPlanItem`: 개선 계획 항목

### 기타

- `Notification`: 알림 (userId는 number)
- `BenchmarkData`: 벤치마크 데이터
- `Statistics`: 통계 데이터

## ⚠️ 주의사항

### ID 타입

- **User.id**: `number` (fastapi-users 라이브러리 사용)
- **ActionPlan.userId**: `number`
- **Notification.userId**: `number`
- 기타 entity ID는 `string`

### 생성된 타입 파일

- `api-generated.ts`는 **절대 수동으로 수정하지 마세요**
- 변경이 필요하면 백엔드 스키마를 수정하고 재생성하세요

### 기존 파일

- 기존 수동 타입 파일은 `api.ts.backup`으로 백업되었습니다
- 참고용으로만 사용하세요

## 🐛 문제 해결

### 타입 불일치

1. 백엔드 스키마 확인: `backend/app/schemas/__init__.py`
2. OpenAPI 스키마 재생성: `python backend/export_openapi_simple.py`
3. TypeScript 타입 재생성: `npm run generate-types:file`
4. TypeScript 컴파일 에러 확인 및 수정

### camelCase vs snake_case

- 백엔드는 `CamelBaseModel`을 사용하여 자동으로 camelCase로 변환
- `to_camel` alias generator가 자동으로 처리
- 프론트엔드는 생성된 타입을 그대로 사용

## 📚 참고 자료

- [openapi-typescript 문서](https://openapi-ts.pages.dev/)
- [openapi-fetch 문서](https://openapi-ts.pages.dev/openapi-fetch/)
- [FastAPI OpenAPI](https://fastapi.tiangolo.com/advanced/extending-openapi/)
