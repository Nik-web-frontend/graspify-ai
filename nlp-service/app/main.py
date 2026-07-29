from fastapi import FastAPI
from app.routes.health import router as health_router
from app.routes.document import router as document_router

app = FastAPI(title="Graspify AI NLP Service")

app.include_router(health_router)
app.include_router(document_router)