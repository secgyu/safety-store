"""간단한 OpenAPI 스키마 추출 스크립트 - 최소 의존성"""
import json
import sys
import os

# 현재 디렉토리를 sys.path에 추가
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# FastAPI 앱 임포트 전에 환경 변수 설정 (DB 연결 방지)
os.environ.setdefault("DATABASE_URL", "sqlite+aiosqlite:///:memory:")

try:
    from app.main import app
    
    # OpenAPI 스키마 생성
    openapi_schema = app.openapi()
    
    # 저장 경로
    output_path = os.path.join(
        os.path.dirname(__file__),
        "..",
        "frontend",
        "business-warning-system",
        "openapi.json"
    )
    
    # 디렉토리 생성
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    
    # JSON 파일로 저장
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(openapi_schema, f, indent=2, ensure_ascii=False)
    
    print(f"[SUCCESS] OpenAPI schema saved to {output_path}")
    print(f"[INFO] Total {len(openapi_schema.get('paths', {}))} endpoints")
    
except Exception as e:
    print(f"[ERROR] Failed: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)

