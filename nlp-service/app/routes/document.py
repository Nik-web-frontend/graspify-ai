from fastapi import APIRouter
from pydantic import BaseModel

from app.services.pdf_service import extract_text_from_pdf
from app.services.text_service import clean_text
from app.services.chunk_service import chunk_text
from app.services.embedding_service import create_embeddings, create_query_embedding
from app.services.chroma_service import (
    store_embeddings,
    get_all_documents,
    search_similar_chunks,
)

router = APIRouter()


class PDFRequest(BaseModel):
    file_path: str


class QueryRequest(BaseModel):
    query: str


@router.post("/extract-text")
def extract_text(request: PDFRequest):
    extracted_text = extract_text_from_pdf(request.file_path)
    cleaned_text = clean_text(extracted_text)
    chunks = chunk_text(cleaned_text)
    embeddings = create_embeddings(chunks)

    metadata = {
        "document_id": "test_document",
        "user_id": "test_user",
        "title": "Test PDF",
    }

    store_embeddings(chunks, embeddings, metadata)

    storedDocuments = get_all_documents()

    return {
        "success": True,
        "total_chunks": len(chunks),
        "message": "Embeddings stored successfully",
        "storedData": storedDocuments,
    }


@router.post("/search")
def search(request: QueryRequest):
    question_embedding = create_query_embedding(request.query)

    results = search_similar_chunks(question_embedding)

    return {
        "success": True,
        "results": results,
    }
