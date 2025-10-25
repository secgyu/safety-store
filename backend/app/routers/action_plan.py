from fastapi import APIRouter, Depends, HTTPException
from typing import Optional
from app.schemas import (
    ActionPlan,
    ActionPlanRequest,
    SuccessResponse,
)
from app.core.auth import current_active_user
from app.models.user import UserTable
from datetime import datetime


router = APIRouter()

# Mock 저장소 (실제로는 DB 사용)
mock_action_plans: dict[int, list[ActionPlan]] = {}


@router.get("", response_model=list[ActionPlan])
async def get_action_plans(user: UserTable = Depends(current_active_user)):
    """사용자의 모든 개선 계획 조회"""
    return mock_action_plans.get(user.id, [])


@router.post("", response_model=ActionPlan, status_code=201)
async def create_action_plan(
    request: ActionPlanRequest,
    user: UserTable = Depends(current_active_user)
):
    """새로운 개선 계획 생성"""
    plan = ActionPlan(
        id=f"plan-{datetime.now().timestamp()}",
        user_id=user.id,
        diagnosis_id=request.diagnosis_id,
        items=request.items,
        created_at=datetime.now().isoformat(),
        updated_at=datetime.now().isoformat(),
    )
    
    if user.id not in mock_action_plans:
        mock_action_plans[user.id] = []
    mock_action_plans[user.id].append(plan)
    
    return plan


@router.put("/{plan_id}", response_model=ActionPlan)
async def update_action_plan(
    plan_id: str,
    request: ActionPlanRequest,
    user: UserTable = Depends(current_active_user)
):
    """개선 계획 수정"""
    plans = mock_action_plans.get(user.id, [])
    
    for i, plan in enumerate(plans):
        if plan.id == plan_id:
            plans[i].items = request.items
            plans[i].updated_at = datetime.now().isoformat()
            return plans[i]
    
    raise HTTPException(status_code=404, detail="개선 계획을 찾을 수 없습니다")


@router.delete("/{plan_id}", response_model=SuccessResponse)
async def delete_action_plan_item(
    plan_id: str,
    item_id: str,
    user: UserTable = Depends(current_active_user)
):
    """개선 계획 항목 삭제"""
    plans = mock_action_plans.get(user.id, [])
    
    for plan in plans:
        if plan.id == plan_id:
            plan.items = [item for item in plan.items if item.id != item_id]
            plan.updated_at = datetime.now().isoformat()
            return {"success": True}
    
    raise HTTPException(status_code=404, detail="개선 계획을 찾을 수 없습니다")

