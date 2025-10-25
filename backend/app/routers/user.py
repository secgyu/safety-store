from fastapi import APIRouter, Depends
from app.schemas import UserRead, UserUpdate, UserResponse
from app.core.auth import current_active_user
from app.models.user import UserTable


router = APIRouter()


@router.get("/profile", response_model=UserResponse)
async def get_profile(user: UserTable = Depends(current_active_user)):
    """프로필 조회"""
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


@router.put("/profile", response_model=UserResponse)
async def update_profile(
    update_data: UserUpdate,
    user: UserTable = Depends(current_active_user)
):
    """프로필 수정"""
    # 실제로는 DB 업데이트 필요
    if update_data.name:
        user.name = update_data.name
    if update_data.business_name is not None:
        user.business_name = update_data.business_name
    if update_data.industry is not None:
        user.industry = update_data.industry
    
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

