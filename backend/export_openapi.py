"""OpenAPI 스키마를 JSON 파일로 추출하는 스크립트"""
import json
from app.main import app

# OpenAPI 스키마를 파일로 저장
openapi_schema = app.openapi()

output_path = "../frontend/business-warning-system/openapi.json"
with open(output_path, "w", encoding="utf-8") as f:
    json.dump(openapi_schema, f, indent=2, ensure_ascii=False)

print(f"✅ OpenAPI 스키마를 {output_path}에 저장했습니다.")

