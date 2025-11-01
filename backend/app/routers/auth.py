from fastapi import APIRouter, Depends, HTTPException, Response, Request, Cookie
from app.core.auth import (
    fastapi_users, 
    auth_backend, 
    create_refresh_token, 
    create_access_token,
    verify_refresh_token,
    get_user_db
)
from app.models.user import UserTable
from app.schemas import UserResponse
from fastapi_users import schemas as fastapi_users_schemas
from pydantic import EmailStr, BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_async_session
from typing import Optional


# FastAPI Users용 스키마 정의
class UserRead(fastapi_users_schemas.BaseUser[int]):
    name: str
    business_name: str | None = None
    industry: str | None = None


class UserCreate(fastapi_users_schemas.BaseUserCreate):
    name: str
    business_name: str | None = None
    industry: str | None = None


class UserUpdate(fastapi_users_schemas.BaseUserUpdate):
    name: str | None = None
    business_name: str | None = None
    industry: str | None = None


# 로그인 요청 스키마
class LoginRequest(BaseModel):
    email: str
    password: str


router = APIRouter()

# FastAPI Users 기본 라우터 (사용하지 않음 - main.py에서 직접 등록)


# 커스텀 로그인 엔드포인트 (Refresh Token 쿠키 추가)
@router.post("/login-custom")
async def custom_login(
    response: Response,
    login_data: LoginRequest,
    session: AsyncSession = Depends(get_async_session),
    user_db = Depends(get_user_db)
):
    """로그인: Access Token 반환 + Refresh Token을 httpOnly 쿠키에 저장"""
    from fastapi_users.password import PasswordHelper
    
    # 사용자 조회
    user = await user_db.get_by_email(login_data.email)
    if not user or not user.is_active:
        raise HTTPException(status_code=400, detail="Invalid credentials")
    
    # 비밀번호 검증
    password_helper = PasswordHelper()
    verified, updated_password_hash = password_helper.verify_and_update(
        login_data.password, user.hashed_password
    )
    
    if not verified:
        raise HTTPException(status_code=400, detail="Invalid credentials")
    
    # Access Token 생성
    access_token = create_access_token(user.id)
    
    # Refresh Token 생성
    refresh_token = create_refresh_token(user.id)
    
    # Refresh Token을 httpOnly 쿠키에 저장
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,  # JavaScript 접근 불가
        secure=False,    # Production에서는 True (HTTPS only)
        samesite="lax",  # CSRF 방어
        max_age=7 * 24 * 60 * 60,  # 7일
        path="/"
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer"
    }


# Refresh Token으로 Access Token 재발급
@router.post("/refresh")
async def refresh_access_token(
    request: Request,
    session: AsyncSession = Depends(get_async_session),
    user_db = Depends(get_user_db)
):
    """Refresh Token으로 새로운 Access Token 발급"""
    # 쿠키에서 Refresh Token 가져오기
    refresh_token = request.cookies.get("refresh_token")
    
    if not refresh_token:
        raise HTTPException(status_code=401, detail="Refresh token missing")
    
    # Refresh Token 검증
    user_id = verify_refresh_token(refresh_token)
    
    if user_id is None:
        raise HTTPException(status_code=401, detail="Invalid or expired refresh token")
    
    # 사용자 확인
    user = await user_db.get(user_id)
    if not user or not user.is_active:
        raise HTTPException(status_code=401, detail="User not found or inactive")
    
    # 새로운 Access Token 발급
    new_access_token = create_access_token(user.id)
    
    return {
        "access_token": new_access_token,
        "token_type": "bearer"
    }


# 로그아웃 (Refresh Token 쿠키 삭제)
@router.post("/logout")
async def logout(response: Response):
    """로그아웃: Refresh Token 쿠키 삭제"""
    response.delete_cookie(key="refresh_token", path="/")
    return {"message": "Logged out successfully"}


# 커스텀 엔드포인트
@router.get("/me", response_model=UserResponse)
async def get_me(user: UserTable = Depends(fastapi_users.current_user(active=True))):
    return {
        "user": {
            "id": user.id,
            "email": user.email,
            "name": user.name,
            "business_name": user.business_name,
            "industry": user.industry,
            "created_at": user.created_at.isoformat(),
            "is_active": user.is_active,
            "is_superuser": user.is_superuser,
            "is_verified": user.is_verified,
        }
    }

