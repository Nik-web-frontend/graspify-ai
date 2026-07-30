from fastapi import APIRouter
from pydantic import BaseModel

from app.services.pdf_service import extract_text_from_pdf
from app.services.text_service import clean_text
from app.services.chunk_service import chunk_text
from app.services.embedding_service import create_embeddings

router = APIRouter()


class PDFRequest(BaseModel):
    file_path: str


@router.post("/extract-text")
def extract_text(request: PDFRequest):
    extracted_text = extract_text_from_pdf(request.file_path)
    cleaned_text = clean_text(extracted_text)
    chunks = chunk_text(cleaned_text)
    embeddings = create_embeddings(chunks)

    return {
        "success": True,
        "total_chunks": len(chunks),
        "embedding_dimension": len(embeddings[0])
    }