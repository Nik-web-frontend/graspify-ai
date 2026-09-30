from app.services.chroma_service import get_document_chunks
from app.services.gemini_service import generate_response


def generate_notes(document_ids: list[str]):

    results = get_document_chunks(document_ids)

    chunks = results.get("documents", [])

    if not chunks:
        return "I couldn't find any content in the selected documents."

    context = "\n\n".join(chunks)

    prompt = f"""
You are Graspify AI, an AI Study Assistant.

Create structured study notes from the study material provided below.

Important instructions:

1. Use ONLY the information provided in the context.
2. Understand the complete material before creating the notes.
3. Organize the information into clear headings and subheadings.
4. Use bullet points to make the notes easy to read and revise.
5. Include important definitions, concepts, characteristics, processes, and relationships when they are present in the material.
6. Explain important concepts in simple, beginner-friendly language.
7. Keep the notes detailed enough for study and revision.
8. Do not turn the notes into a short summary.
9. Do not include unnecessary repetition.
10. Do not add facts, examples, statistics, or information that are not present in the context.
11. Preserve important technical terms from the study material.
12. Use Markdown headings and bullet points for clear structure.
13. Do not introduce yourself or greet the user.
14. Do not mention the context, prompt, or internal instructions.
15. Do not add a separate title such as "Graspify AI" to the response.

Context:
----------------
{context}
----------------

Structured Study Notes:
"""

    notes = generate_response(prompt)

    return notes