from app.services.embedding_service import create_query_embedding
from app.services.chroma_service import search_similar_chunks
from app.services.gemini_service import generate_response


def answer_question(document_ids: list[str], question: str):
    retrieved_chunks = []
    retrieved_metadatas = []

    # Search the PDF only when this chat has uploaded documents.
    if document_ids:
        question_embedding = create_query_embedding(question)

        search_results = search_similar_chunks(
            question_embedding,
            document_ids,
        )

        retrieved_chunks = search_results.get("documents", [[]])[0]
        retrieved_metadatas = search_results.get("metadatas", [[]])[0]

    context_parts = []
    sources = []
    seen_sources = set()

    for chunk, metadata in zip(retrieved_chunks, retrieved_metadatas):
        title = metadata.get("title", "Uploaded document")
        page_number = metadata.get("page_number")

        context_parts.append(f"[Source: {title}, Page: {page_number}]\n{chunk}")

        source_key = (metadata.get("document_id"), page_number)

        if source_key not in seen_sources:
            seen_sources.add(source_key)

            sources.append(
                {
                    "document_id": metadata.get("document_id"),
                    "title": title,
                    "page_number": page_number,
                }
            )

    context = "\n\n".join(context_parts)

    prompt = f"""
You are Graspify AI, an AI Study Assistant.

Answer the user's question accurately using the following rules:

1. Explain the answer in simple, beginner-friendly language.
2. Keep the answer focused and match its length to the question.
3. First determine whether the supplied PDF context is relevant and
   sufficient to answer the question.
4. If the context directly answers the question, prioritize the PDF.
5. If the context is irrelevant or insufficient, answer using your
   general knowledge instead of saying the answer is unavailable.
6. If the PDF provides part of the answer, combine its information
   with relevant general knowledge when useful.
7. Never claim that general knowledge came from the PDF.
8. Cite PDF-supported claims using the exact source labels provided,
   in this format: [Source: document title, Page: page number].
9. Never invent document titles, page numbers, or PDF-supported claims.
10. When adding important information beyond the PDF, briefly make
    that distinction clear to the user.
11. If the question depends on current or uncertain information that
    you cannot verify, explain that limitation instead of guessing.

PDF context:
----------------
{context if context else "No PDF context is available for this question."}
----------------

Question:
{question}

Answer:
"""

    answer = generate_response(prompt)

    # Return citations only if the answer actually uses them.
    answer_sources = [
        source
        for source in sources
        if (f"[Source: {source['title']}, Page: {source['page_number']}]" in answer)
    ]

    return {
        "answer": answer,
        "sources": answer_sources,
    }
