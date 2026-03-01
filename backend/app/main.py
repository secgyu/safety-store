from contextlib import asynccontextmanager
import time
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from app.config import settings
from app.database import engine, Base
from app.core.auth import auth_backend, fastapi_users
from app.models.user import UserTable  # UserTable import 추가
from app.models.diagnosis import DiagnosisRecord  # DiagnosisRecord import 추가
from app.routers import (
    auth,
    diagnosis,
    action_plan,
    benchmark,
    chat,
    faq,
    insights,
    notifications,
    statistics,
    success_stories,
    support,
    user,
)
from app.schemas import UserRead, UserCreate, UserUpdate


# Custom JSON Response - by_alias=True로 자동 직렬화
class CamelCaseJSONResponse(JSONResponse):
    def render(self, content) -> bytes:
        if isinstance(content, BaseModel):
            return super().render(
                content.model_dump(by_alias=True, mode='json')
            )
        elif isinstance(content, list) and content and isinstance(content[0], BaseModel):
            return super().render(
                [item.model_dump(by_alias=True, mode='json') for item in content]
            )
        return super().render(content)


@asynccontextmanager
async def lifespan(app: FastAPI):
    print(f"🔧 CORS origins: {settings.cors_origins_list}")
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield


# FastAPI 앱 생성 - 기본 응답 클래스를 CamelCase용으로 설정
app = FastAPI(
    title=settings.app_name,
    debug=settings.debug,
    lifespan=lifespan,
    default_response_class=CamelCaseJSONResponse,  # camelCase 응답
)

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# 디버깅용 로깅 미들웨어
@app.middleware("http")
async def log_requests(request: Request, call_next):
    print(f"\n{'='*50}")
    print(f"🔵 {request.method} {request.url.path}")
    
    # Body 읽기 (POST, PUT, PATCH 요청만)
    if request.method in ["POST", "PUT", "PATCH"]:
        body = await request.body()
        if body:
            try:
                body_str = body.decode('utf-8')
                print(f"📦 Body: {body_str}")
            except Exception as e:
                print(f"❌ Body decode error: {e}")
            
            # body를 다시 사용할 수 있도록 재설정
            async def receive():
                return {"type": "http.request", "body": body}
            
            from starlette.requests import Request as StarletteRequest
            request = StarletteRequest(request.scope, receive)
    
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    
    print(f"🟢 Status: {response.status_code} | Time: {process_time:.3f}s")
    print(f"{'='*50}\n")
    
    return response


# FastAPI Users 라우터 등록
app.include_router(
    fastapi_users.get_auth_router(auth_backend),
    prefix="/api/auth",
    tags=["auth"],
)

app.include_router(
    fastapi_users.get_register_router(UserRead, UserCreate),
    prefix="/api/auth",
    tags=["auth"],
)

app.include_router(
    fastapi_users.get_users_router(UserRead, UserUpdate),
    prefix="/api/users",
    tags=["users"],
)

# 커스텀 인증 라우터
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])

# API 라우터 등록
app.include_router(diagnosis.router, prefix="/api/diagnose", tags=["diagnosis"])
app.include_router(action_plan.router, prefix="/api/action-plan", tags=["action-plan"])
app.include_router(benchmark.router, prefix="/api/benchmark", tags=["benchmark"])
app.include_router(chat.router, prefix="/api/chat", tags=["chat"])
app.include_router(faq.router, prefix="/api/faq", tags=["faq"])
app.include_router(insights.router, prefix="/api/insights", tags=["insights"])
app.include_router(notifications.router, prefix="/api/notifications", tags=["notifications"])
app.include_router(statistics.router, prefix="/api/statistics", tags=["statistics"])
app.include_router(success_stories.router, prefix="/api/success-stories", tags=["success-stories"])
app.include_router(support.router, prefix="/api/support", tags=["support"])
app.include_router(user.router, prefix="/api/user", tags=["user"])


@app.get("/")
async def root():
    return {"message": "Business Warning System API", "version": "1.0.0"}


@app.get("/health")
async def health_check():
    return {"status": "healthy"}

