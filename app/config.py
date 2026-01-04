from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    app_name: str
    database_url: str
    jwt_secret: str

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()

