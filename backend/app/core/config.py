from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    PROJECT_NAME: str = "Stock Predects"
    API_V1_STR: str = "/api/v1"
    
    # Firebase
    FIREBASE_CREDENTIALS_PATH: str = "firebase-adminsdk.json"
    
    # Redis
    REDIS_URL: str = "redis://localhost:6379/0"
    
    # Security
    SECRET_KEY: str = "YOUR_SECRET_KEY_HERE" # Change in production
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Email
    EMAIL_HOST: str = "smtp.gmail.com"
    EMAIL_PORT: int = 587
    EMAIL_USERNAME: str = "manojsprivatemail@gmail.com"
    EMAIL_PASSWORD: str = "" # App Password
    
    class Config:
        env_file = ".env"

@lru_cache()
def get_settings():
    return Settings()
