from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    app_name: str = "Minimalist Blog"
    debug: bool = False
    secret_key: str = "change-me-in-production"
    database_url: str = "sqlite+aiosqlite:///./blog.db"
    host: str = "0.0.0.0"
    port: int = 8000
    allowed_origins: str = "http://localhost:3000"
    
    # JWT
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 60 * 24 * 7  # 7 days
    
    class Config:
        env_file = ".env"
        extra = "ignore"

@lru_cache()
def get_settings() -> Settings:
    return Settings()
