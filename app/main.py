from fastapi import FastAPI
from app.routes.service_routes import router as service_router
from app.utils.db_wait import wait_for_db
from app.routes.health import router as health_router
from app.routes.metrics import router as metrics_router
from app.routes.auth_routes import router as auth_router

app = FastAPI(title="Reliability Platform")

app.include_router(service_router)
app.include_router(health_router)
app.include_router(metrics_router)
app.include_router(auth_router)

@app.on_event("startup")
def startup():
    wait_for_db()


@app.get("/")
def health():
    return {"status": "running"}
