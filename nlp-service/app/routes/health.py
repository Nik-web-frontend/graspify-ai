from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def root():
    return {
        "success": True,
        "message": "Graspify AI NLP Service is running 🚀"
    }

@router.get("/health")
def health():
    return {
        "status": "healthy",
        "service": "Graspify AI NLP Service"
    }