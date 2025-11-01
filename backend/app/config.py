from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "Business Warning System API"
    debug: bool = True
    
    # Database
    database_url: str = "sqlite+aiosqlite:///./app.db"
    
    # Security
    secret_key: str = "your-secret-key-here-change-in-production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 15  # 15분
    refresh_token_expire_days: int = 7  # 7일
    
    # CORS
    cors_origins: list = ["http://localhost:5173", "http://localhost:3000"]
    
    # OpenAI
    openai_api_key: str = ""
    
    model_config = SettingsConfigDict(env_file=".env")


settings = Settings()

