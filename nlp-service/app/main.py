from fastapi import FastAPI

app = FastAPI()


@app.get("/")
def root():
    return {
        "success": True,
        "message": "Graspify AI NLP Service is running 🚀"
    }



@app.get("/health")
def health():
    return {
        "status": "healthy",
        "service": "Graspify AI NLP Service"
    }