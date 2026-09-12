from app.services.embedding_service import create_query_embedding
from app.services.chroma_service import search_similar_chunks
from app.services.gemini_service import generate_response


def answer_question(document_ids: list[str], question: str):

    question_embedding = create_query_embedding(question)

    search_results = search_similar_chunks(question_embedding, document_ids)

    retrieved_chunks = search_results.get("documents", [[]])[0]

    if not retrieved_chunks:
        return "I couldn't find that information in the uploaded documents."

    context = "\n\n".join(retrieved_chunks)

    prompt = f"""
You are Graspify AI, an AI Study Assistant.

Your job is to help students understand their uploaded study material.

Use ONLY the information provided in the context below to answer the user's question.

Important instructions:

1. Understand the provided context before answering.
2. Explain the answer in simple, clear and beginner-friendly language.
3. Do not simply copy or repeat the sentences from the context.
4. Rephrase the information naturally so the student can understand it easily.
5. Match the length of the answer to the user's question.
6. For simple definition questions, give a short and clear explanation first.
7. Use bullet points or examples only when they are useful for understanding the answer.
8. Do not add additional facts, statistics, characteristics, examples, or background information unless they are supported by the provided context.
9. Do not introduce yourself or greet the user unless they explicitly greet you.
10. Keep the answer focused on the user's question.
11. Do not use information that is not present in the provided context.
12. If the answer cannot be found in the provided context, reply exactly:
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

    return answer
