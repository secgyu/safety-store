from fastapi import APIRouter, HTTPException, Depends
from app.schemas import DiagnosisRequest, DiagnosisResponse, DiagnosisHistory, BusinessSearchResponse
from app.services.diagnosis_service import diagnosis_service
from app.core.auth import current_active_user
from app.models.user import UserTable


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
    user: UserTable = Depends(current_active_user)
):
    """
    진단 예측 API
    ENCODED_MCT를 받아서 해당하는 최신 진단 데이터를 반환
    """
    diagnosis_data = diagnosis_service.get_latest_diagnosis(request.encoded_mct)
    
    if not diagnosis_data:
        raise HTTPException(status_code=404, detail="해당 사업체의 데이터를 찾을 수 없습니다.")
    
    return diagnosis_service.parse_diagnosis_response(diagnosis_data)


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

