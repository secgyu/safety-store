from fastapi import APIRouter, Depends
from app.core.auth import fastapi_users, auth_backend
from app.models.user import UserTable
from fastapi_users import schemas as fastapi_users_schemas
from pydantic import EmailStr


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


router = APIRouter()

# FastAPI Users 기본 라우터 (사용하지 않음 - main.py에서 직접 등록)


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

