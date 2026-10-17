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
    delete_document,
)
from app.services.gemini_service import generate_response
from app.services.rag_service import answer_question
from app.services.summary_service import generate_summary
from app.services.notes_service import generate_notes
from app.services.flashcard_service import generate_flashcards
from app.services.quiz_service import generate_quiz

router = APIRouter()


class PDFRequest(BaseModel):
    file_path: str
    document_id: str
    user_id: str
    title: str


class QueryRequest(BaseModel):
    query: str


class QuestionRequest(BaseModel):
    document_ids: list[str]
    question: str


class SummaryRequest(BaseModel):
    document_ids: list[str]


@router.post("/extract-text")
def extract_text(request: PDFRequest):
    extracted_pages = extract_text_from_pdf(request.file_path)

    all_chunks = []
    chunk_metadata = []

    for page in extracted_pages:
        cleaned_text = clean_text(page["text"])

        if not cleaned_text.strip():
            continue

        page_chunks = chunk_text(cleaned_text)

        for chunk in page_chunks:
            all_chunks.append(chunk)

            chunk_metadata.append(
                {
                    "document_id": request.document_id,
                    "user_id": request.user_id,
                    "title": request.title,
                    "page_number": page["page_number"],
                }
            )

    if not all_chunks:
        return {
            "success": False,
            "total_chunks": 0,
            "message": "No readable text found in the PDF.",
        }

    embeddings = create_embeddings(all_chunks)

    metadata = {
        "document_id": request.document_id,
        "user_id": request.user_id,
        "title": request.title,
    }

    store_embeddings(
        all_chunks,
        embeddings,
        metadata,
        chunk_metadata=chunk_metadata,
    )

    stored_documents = get_all_documents()

    return {
        "success": True,
        "document_id": request.document_id,
        "total_chunks": len(all_chunks),
        "message": "Page-aware embeddings stored successfully",
    }


@router.post("/search")
def search(request: QueryRequest):
    question_embedding = create_query_embedding(request.query)

    results = search_similar_chunks(question_embedding)

    return {
        "success": True,
        "results": results,
    }


@router.get("/test-gemini")
def test_gemini():
    answer = generate_response("What is Artificial Intelligence?")

    return {
        "success": True,
        "answer": answer,
    }


@router.post("/ask")
def ask_question(request: QuestionRequest):
    result = answer_question(
        request.document_ids,
        request.question,
    )

    return {
        "success": True,
        "question": request.question,
        "answer": result["answer"],
        "sources": result["sources"],
    }


@router.post("/summary")
def create_summary(request: SummaryRequest):

    summary = generate_summary(request.document_ids)

    return {
        "success": True,
        "summary": summary,
    }


@router.post("/notes")
def create_notes(request: SummaryRequest):

    notes = generate_notes(request.document_ids)

    return {
        "success": True,
        "notes": notes,
    }


@router.post("/flashcards")
def create_flashcards(request: SummaryRequest):

    flashcards = generate_flashcards(request.document_ids)

    return {
        "success": True,
        "flashcards": flashcards,
    }


@router.post("/quiz")
def create_quiz(request: SummaryRequest):

    quiz = generate_quiz(request.document_ids)

    return {
        "success": True,
        "quiz": quiz,
    }


@router.delete("/document/{document_id}")
def delete_document_embeddings(document_id: str):

    delete_document(document_id)

    return {"success": True, "message": "Document embeddings deleted successfully."}
