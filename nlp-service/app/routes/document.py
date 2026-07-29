from fastapi import APIRouter
from pydantic import BaseModel

from app.services.pdf_service import extract_text_from_pdf

router = APIRouter()


class PDFRequest(BaseModel):
    file_path: str


@router.post("/extract-text")
def extract_text(request: PDFRequest):
    extracted_text = extract_text_from_pdf(request.file_path)

    return {
        "success": True,
        "text": extracted_text
    }