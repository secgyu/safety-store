from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "Business Warning System API"
    debug: bool = False  # 프로덕션에서는 False
    
    # Database
    database_url: str = "sqlite+aiosqlite:///./app.db"
    
    # Security
    secret_key: str = "your-secret-key-here-change-in-production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 15  # 15분
    refresh_token_expire_days: int = 7  # 7일
    
    # CORS - 환경변수로 설정 가능 (쉼표로 구분)
    cors_origins_str: str = "http://localhost:5173,http://localhost:3000"
    
    @property
    def cors_origins(self) -> list:
        return [origin.strip() for origin in self.cors_origins_str.split(",")]
    
    # OpenAI
    openai_api_key: str = ""
    
    model_config = SettingsConfigDict(env_file=".env")


settings = Settings()

