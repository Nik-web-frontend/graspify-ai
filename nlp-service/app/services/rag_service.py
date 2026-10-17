from app.services.embedding_service import create_query_embedding
from app.services.chroma_service import search_similar_chunks
from app.services.gemini_service import generate_response


def answer_question(document_ids: list[str], question: str):
    question_embedding = create_query_embedding(question)

    search_results = search_similar_chunks(
        question_embedding,
        document_ids,
    )

    retrieved_chunks = search_results.get("documents", [[]])[0]
    retrieved_metadatas = search_results.get("metadatas", [[]])[0]

    if not retrieved_chunks:
        return {
            "answer": "I couldn't find that information in the uploaded documents.",
            "sources": [],
        }

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

Answer the user's question using ONLY the supplied context.

Instructions:
1. Explain the answer in simple, beginner-friendly language.
2. Keep the answer focused and match its length to the question.
3. Do not add facts that are unsupported by the context.
4. Use the source labels supplied with the context when citing claims.
5. Cite supporting claims using [Source: document title, Page: page number].
6. Never invent document titles or page numbers.
7. If the answer cannot be found in the context, reply exactly:
"I couldn't find that information in the uploaded documents."

Context:
----------------
{context}
----------------

Question:
{question}

Answer:
"""

    answer = generate_response(prompt)

    return {
        "answer": answer,
        "sources": sources,
    }
