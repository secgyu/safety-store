from fastapi import APIRouter, Depends, HTTPException
from app.schemas import (
    LoginRequest,
    SignupRequest,
    AuthResponse,
    UserRead,
)
from app.core.auth import fastapi_users, auth_backend
from app.models.user import UserTable
from fastapi_users import schemas


router = APIRouter()

# FastAPI Users 기본 라우터
auth_router = fastapi_users.get_auth_router(auth_backend)
register_router = fastapi_users.get_register_router(schemas.UserRead, schemas.UserCreate)
users_router = fastapi_users.get_users_router(schemas.UserRead, schemas.UserUpdate)


# 커스텀 엔드포인트
@router.get("/me", response_model=dict)
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

