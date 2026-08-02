from app.services.embedding_service import create_query_embedding
from app.services.chroma_service import search_similar_chunks
from app.services.gemini_service import generate_response


def answer_question(question: str):
    question_embedding = create_query_embedding(question)
    search_results = search_similar_chunks(question_embedding)
    retrieved_chunks = search_results["documents"][0]

    context = "\n\n".join(retrieved_chunks)

    prompt = f"""
You are an AI Study Assistant.

Answer the user's question using ONLY the context provided below.

If the answer is not present in the context, reply exactly:
"I couldn't find that information in the uploaded document."

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
