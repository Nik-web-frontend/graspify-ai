from app.services.chroma_service import get_document_chunks
from app.services.gemini_service import generate_response


def generate_summary(document_ids: list[str]):

    results = get_document_chunks(document_ids)

    chunks = results.get("documents", [])

    if not chunks:
        return "I couldn't find any content in the selected documents."

    context = "\n\n".join(chunks)

    prompt = f"""
You are Graspify AI, an AI Study Assistant.

Create a concise overall summary of the study material provided below.

Important instructions:

1. Use ONLY the information provided in the context.
2. Understand the complete material before creating the summary.
3. Explain the main ideas in simple, beginner-friendly language.
4. Focus on the most important concepts and their relationships.
5. Do not turn the summary into detailed study notes.
6. Do not explain every topic, subtopic, example, or technical detail unless it is essential to understanding the main idea.
7. Avoid repeating information.
8. Keep the summary concise but informative.
9. Prefer a few short paragraphs and bullet points only when they improve readability.
10. Do not add facts or information that are not present in the context.
11. Do not introduce yourself or greet the user.
12. Do not mention the context, prompt, or internal instructions.
13. Do not add a separate title such as "Graspify AI" to the response.

Context:
----------------
{context}
----------------

Summary:
"""

    summary = generate_response(prompt)

    return summary
