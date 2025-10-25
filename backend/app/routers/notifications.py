from fastapi import APIRouter, Depends, HTTPException
from app.schemas import Notification, NotificationSettings, SuccessResponse, NotificationSettingsResponse
from app.core.auth import current_active_user
from app.models.user import UserTable


router = APIRouter()


# Mock 저장소
mock_notifications: dict[int, list[Notification]] = {}


@router.get("", response_model=list[Notification])
async def get_notifications(user: UserTable = Depends(current_active_user)):
    """알림 목록 조회"""
    return mock_notifications.get(user.id, [])


@router.delete("/{notification_id}", response_model=SuccessResponse)
async def delete_notification(
    notification_id: str,
    user: UserTable = Depends(current_active_user)
):
    """알림 삭제"""
    notifications = mock_notifications.get(user.id, [])
    mock_notifications[user.id] = [n for n in notifications if n.id != notification_id]
    return {"success": True}


@router.put("/{notification_id}/read", response_model=SuccessResponse)
async def mark_notification_as_read(
    notification_id: str,
    user: UserTable = Depends(current_active_user)
):
    """알림을 읽음으로 표시"""
    notifications = mock_notifications.get(user.id, [])
    for notification in notifications:
        if notification.id == notification_id:
            notification.is_read = True
            return {"success": True}
    raise HTTPException(status_code=404, detail="알림을 찾을 수 없습니다")


@router.put("/settings", response_model=NotificationSettingsResponse)
async def update_notification_settings(
    settings: NotificationSettings,
    user: UserTable = Depends(current_active_user)
):
    """알림 설정 업데이트"""
    return {"success": True, "settings": settings}

