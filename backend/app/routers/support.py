from fastapi import APIRouter
from app.schemas import ContactRequest, ContactResponse
from datetime import datetime


router = APIRouter()


@router.post("/contact", response_model=ContactResponse, status_code=201)
async def submit_contact(request: ContactRequest):
    """문의 제출"""
    return ContactResponse(
        success=True,
        id=f"contact-{datetime.now().timestamp()}",
    )

