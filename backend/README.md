# Business Warning System API

FastAPI 기반의 자영업 위기 예측 시스템 백엔드 API

## 📋 주요 기능

### 🔐 인증 시스템 (FastAPI Users)

- JWT 토큰 기반 인증
- 회원가입 / 로그인
- 사용자 프로필 관리
- 비밀번호 암호화

### 📊 진단 API

- `POST /api/diagnose/predict`: ENCODED_MCT 기반 사업체 리스크 진단
  - `risk_output.csv` 데이터 활용
  - 매출, 고객, 시장 리스크 분석
  - 종합 리스크 스코어 및 등급 제공
  - 맞춤형 추천사항 생성
- `GET /api/diagnose/history`: 진단 이력 조회

### 🎯 기타 API

- **개선 계획 (Action Plan)**: 진단 기반 개선 계획 생성 및 관리
- **벤치마크**: 업종별 벤치마크 데이터 및 비교 분석
- **블로그**: 경영 팁 및 가이드 제공
- **챗봇**: AI 기반 질의응답
- **FAQ**: 자주 묻는 질문
- **인사이트**: 업종별 트렌드 및 분석
- **알림**: 사용자 알림 관리
- **통계**: 자영업 통계 데이터
- **성공 사례**: 실제 성공 사례 공유
- **지원**: 문의 접수

## 🚀 설치 및 실행

### 1. 가상환경 생성 및 활성화

```bash
# Windows
python -m venv .venv
.venv\Scripts\activate

# Linux/Mac
python3 -m venv .venv
source .venv/bin/activate
```

### 2. 의존성 설치

```bash
pip install -r requirements.txt
```

### 3. 환경 변수 설정

`.env.example`을 참고하여 `.env` 파일 생성:

```env
SECRET_KEY=your-secret-key-here-please-change-in-production
DATABASE_URL=sqlite+aiosqlite:///./app.db
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
ACCESS_TOKEN_EXPIRE_MINUTES=10080
```

### 4. 서버 실행

```bash
uvicorn app.main:app --reload
```

서버가 `http://127.0.0.1:8000`에서 실행됩니다.

## 📚 API 문서

서버 실행 후 다음 URL에서 API 문서를 확인할 수 있습니다:

- **Swagger UI**: http://127.0.0.1:8000/docs
- **ReDoc**: http://127.0.0.1:8000/redoc

## 🏗️ 프로젝트 구조

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI 애플리케이션 진입점
│   ├── config.py            # 설정 관리
│   ├── database.py          # 데이터베이스 연결
│   ├── core/
│   │   ├── __init__.py
│   │   └── auth.py          # 인증 관련 설정 (fastapi-users)
│   ├── models/
│   │   ├── __init__.py
│   │   └── user.py          # SQLAlchemy 모델
│   ├── schemas/
│   │   └── __init__.py      # Pydantic 스키마 (요청/응답 모델)
│   ├── routers/
│   │   ├── __init__.py
│   │   ├── auth.py          # 인증 API
│   │   ├── diagnosis.py     # 진단 API
│   │   ├── action_plan.py   # 개선 계획 API
│   │   ├── benchmark.py     # 벤치마크 API
│   │   ├── blog.py          # 블로그 API
│   │   ├── chat.py          # 챗봇 API
│   │   ├── faq.py           # FAQ API
│   │   ├── insights.py      # 인사이트 API
│   │   ├── notifications.py # 알림 API
│   │   ├── statistics.py    # 통계 API
│   │   ├── success_stories.py # 성공 사례 API
│   │   ├── support.py       # 지원 API
│   │   └── user.py          # 사용자 프로필 API
│   └── services/
│       ├── __init__.py
│       └── diagnosis_service.py  # 진단 비즈니스 로직
├── risk_output.csv          # 진단 데이터 (86,592 rows)
├── requirements.txt         # Python 의존성
├── .env.example            # 환경 변수 예제
└── README.md               # 문서
```

## 🔑 주요 엔드포인트

### 인증

- `POST /api/auth/register` - 회원가입
- `POST /api/auth/login` - 로그인
- `GET /api/auth/me` - 현재 사용자 정보

### 진단

- `POST /api/diagnose/predict` - 진단 실행
  ```json
  {
    "encoded_mct": "000F03E44A"
  }
  ```
- `GET /api/diagnose/history?encoded_mct=000F03E44A` - 진단 이력

### 개선 계획

- `GET /api/action-plan` - 개선 계획 목록
- `POST /api/action-plan` - 개선 계획 생성
- `PUT /api/action-plan/{id}` - 개선 계획 수정
- `DELETE /api/action-plan/{id}` - 개선 계획 삭제

### 벤치마크

- `GET /api/benchmark?industry=음식점&region=서울` - 벤치마크 데이터
- `POST /api/benchmark/compare` - 벤치마크 비교

### 기타

- `GET /api/blog` - 블로그 목록
- `POST /api/chat` - 챗봇 메시지
- `GET /api/faq` - FAQ 목록
- `GET /api/insights?industry=음식점` - 인사이트
- `GET /api/statistics` - 통계 데이터
- `GET /api/success-stories` - 성공 사례
- `POST /api/support/contact` - 문의 제출

## 📊 진단 데이터 구조

`risk_output.csv` 파일 구조:

- `ENCODED_MCT`: 사업체 ID (익명화)
- `TA_YM`: 기준 연월
- `Sales_Risk`: 매출 리스크 (0-1)
- `Customer_Risk`: 고객 리스크 (0-1)
- `Market_Risk`: 시장 리스크 (0-1)
- `RiskScore`: 종합 리스크 스코어 (0-1)
- `p_model`: 모델 예측값
- `p_final`: 최종 예측값 (0-1)
- `Alert`: 경고 등급 (GREEN, YELLOW, ORANGE, RED)

## 🔧 기술 스택

- **FastAPI**: 고성능 웹 프레임워크
- **FastAPI Users**: 인증 및 사용자 관리
- **SQLAlchemy**: ORM
- **SQLite**: 데이터베이스 (aiosqlite)
- **Pydantic**: 데이터 검증
- **Pandas**: CSV 데이터 처리
- **JWT**: 토큰 기반 인증
- **Uvicorn**: ASGI 서버

## 🔒 보안

- 비밀번호는 bcrypt로 해시화
- JWT 토큰 기반 인증
- CORS 설정
- 환경 변수를 통한 설정 관리

## 📝 개발 참고사항

- 모든 API는 `/api` prefix 사용
- 인증이 필요한 API는 Bearer 토큰 사용
- 프론트엔드 API 클라이언트: `frontend/business-warning-system/src/lib/api.ts`
- Mock 데이터 참고: `frontend/business-warning-system/src/mocks/handlers.ts`

## 🚧 향후 개선사항

- [ ] PostgreSQL 지원 추가
- [ ] 실제 데이터베이스를 활용한 Action Plan 저장
- [ ] 실제 AI 챗봇 통합
- [ ] 이메일 알림 시스템
- [ ] 관리자 대시보드
- [ ] API 레이트 리미팅
- [ ] 로깅 시스템

## 📞 문의

API 관련 문의사항은 `/api/support/contact` 엔드포인트를 통해 제출해주세요.
