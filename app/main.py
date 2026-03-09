from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.service_routes import router as service_router
from app.utils.db_wait import wait_for_db
from app.routes.health import router as health_router
from app.routes.metrics import router as metrics_router
from app.routes.auth_routes import router as auth_router
from app.routes.admin_routes import router as admin_router

app = FastAPI(title="Reliability Platform")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3001", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(service_router)
app.include_router(health_router)
app.include_router(metrics_router)
app.include_router(auth_router)
app.include_router(admin_router)

@app.on_event("startup")
def startup():
    wait_for_db()


@app.get("/")
def health():
    return {"status": "running"}
