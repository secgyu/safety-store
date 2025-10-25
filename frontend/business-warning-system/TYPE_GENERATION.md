# OpenAPI 타입 자동 생성

이 프로젝트는 백엔드 OpenAPI 스키마에서 TypeScript 타입을 자동 생성합니다.

## 🚀 타입 생성 방법

### 1. 백엔드 OpenAPI 스키마 추출

```bash
cd backend
python export_openapi_simple.py
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

## 🔄 워크플로우

1. 백엔드 스키마 변경
2. `python backend/export_openapi_simple.py` 실행
3. `npm run generate-types:file` 실행
4. TypeScript 타입이 자동으로 업데이트됨
5. IDE가 타입 오류를 표시하여 수정 필요 부분을 알려줌

## 📝 참고

- 생성된 타입 파일(`api-generated.ts`)은 직접 수정하지 마세요
- `api.ts`에서 생성된 타입을 import하여 사용합니다
- 기존 수동 타입 파일은 `api.ts.backup`으로 백업되었습니다
