from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.schemas import DiagnosisRequest, DiagnosisResponse, DiagnosisHistory, BusinessSearchResponse, DiagnosisRecordSimple, DiagnosisRecordList
from app.services.diagnosis_service import diagnosis_service
from app.core.auth import current_active_user
from app.models.user import UserTable
from app.models.diagnosis import DiagnosisRecord
from app.database import get_async_session


router = APIRouter()


@router.get("/search", response_model=BusinessSearchResponse)
async def search_businesses(
    keyword: str,
    user: UserTable = Depends(current_active_user)
):
    """
    가게 이름으로 검색하는 API
    keyword: 검색할 가게 이름
    """
    if not keyword or len(keyword.strip()) == 0:
        raise HTTPException(status_code=400, detail="검색어를 입력해주세요.")
    
    results = diagnosis_service.search_businesses(keyword)
    
    if not results:
        return {"results": []}
    
    return {"results": results}


@router.post("/predict", response_model=DiagnosisResponse)
async def predict_diagnosis(
    request: DiagnosisRequest,
    user: UserTable = Depends(current_active_user),
    db: AsyncSession = Depends(get_async_session)
):
    """
    진단 예측 API
    ENCODED_MCT를 받아서 해당하는 최신 진단 데이터를 반환하고 기록 저장
    """
    diagnosis_data = diagnosis_service.get_latest_diagnosis(request.encoded_mct)
    
    if not diagnosis_data:
        raise HTTPException(status_code=404, detail="해당 사업체의 데이터를 찾을 수 없습니다.")
    
    result = diagnosis_service.parse_diagnosis_response(diagnosis_data)
    
    # 가게 정보 가져오기 (business_name 저장용)
    businesses = diagnosis_service.search_businesses("")
    business_info = next((b for b in businesses if b['encoded_mct'] == request.encoded_mct), None)
    business_name = business_info['name'] if business_info else "Unknown"
    
    # 진단 기록 저장 (이미 있으면 업데이트)
    stmt = select(DiagnosisRecord).where(
        DiagnosisRecord.user_id == user.id,
        DiagnosisRecord.encoded_mct == request.encoded_mct
    )
    result_db = await db.execute(stmt)
    existing_record = result_db.scalar_one_or_none()
    
    if existing_record:
        # 이미 있으면 시간만 업데이트 (updated_at은 자동 업데이트)
        existing_record.business_name = business_name  # 이름이 바뀌었을수도
        await db.commit()
    else:
        # 새로 생성
        new_record = DiagnosisRecord(
            user_id=user.id,
            encoded_mct=request.encoded_mct,
            business_name=business_name
        )
        db.add(new_record)
        await db.commit()
    
    return result


@router.get("/recent", response_model=DiagnosisRecordSimple | None)
async def get_recent_diagnosis(
    user: UserTable = Depends(current_active_user),
    db: AsyncSession = Depends(get_async_session)
):
    """
    사용자의 가장 최근 진단 기록 조회
    """
    stmt = select(DiagnosisRecord)\
        .where(DiagnosisRecord.user_id == user.id)\
        .order_by(DiagnosisRecord.updated_at.desc())\
        .limit(1)
    
    result = await db.execute(stmt)
    record = result.scalar_one_or_none()
    
    if not record:
        return None
    
    return {
        "encoded_mct": record.encoded_mct,
        "business_name": record.business_name,
        "created_at": record.updated_at.isoformat()
    }


@router.get("/my-records", response_model=DiagnosisRecordList)
async def get_my_diagnosis_records(
    limit: int = 10,
    user: UserTable = Depends(current_active_user),
    db: AsyncSession = Depends(get_async_session)
):
    """
    사용자의 모든 진단 기록 목록
    """
    # 기록 조회
    stmt = select(DiagnosisRecord)\
        .where(DiagnosisRecord.user_id == user.id)\
        .order_by(DiagnosisRecord.updated_at.desc())\
        .limit(limit)
    
    result = await db.execute(stmt)
    records = result.scalars().all()
    
    # 전체 개수 조회
    count_stmt = select(DiagnosisRecord).where(DiagnosisRecord.user_id == user.id)
    count_result = await db.execute(count_stmt)
    total = len(count_result.scalars().all())
    
    return {
        "records": [
            {
                "id": r.id,
                "encoded_mct": r.encoded_mct,
                "business_name": r.business_name,
                "created_at": r.updated_at.isoformat()
            }
            for r in records
        ],
        "total": total
    }


@router.get("/history", response_model=DiagnosisHistory)
async def get_diagnosis_history(
    encoded_mct: str,
    user: UserTable = Depends(current_active_user)
):
    """
    진단 이력 조회 API
    """
    records = diagnosis_service.get_diagnosis_history(encoded_mct)
    
    if not records:
        return {"diagnoses": []}
    
    diagnoses = [diagnosis_service.parse_diagnosis_response(record) for record in records]
    return {"diagnoses": diagnoses}

