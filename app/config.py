from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    app_name: str
    database_url: str
    jwt_secret: str
    
    email_from: str = "noreply@example.com"
    smtp_host: str = "localhost"
    smtp_port: int = 587
    smtp_user: str = "user"
    smtp_password: str = "password"

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()

