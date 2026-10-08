from app.services.chroma_service import get_document_chunks
from app.services.gemini_service import generate_response


def generate_flashcards(document_ids: list[str]):

    results = get_document_chunks(document_ids)

    chunks = results.get("documents", [])

    if not chunks:
        return "I couldn't find any content in the selected documents."

    context = "\n\n".join(chunks)

    prompt = f"""
You are Graspify AI, an AI Study Assistant.

Create study flashcards from the study material provided below.

Important instructions:

1. Use ONLY the information provided in the context.
2. Understand the complete material before creating the flashcards.
3. Focus on important concepts, definitions, facts, processes, and relationships.
4. Each flashcard must contain one clear question and one accurate answer.
5. Keep questions short and easy to understand.
6. Keep answers concise but informative.
7. Create enough flashcards to cover the important concepts in the material.
8. Avoid creating duplicate or repetitive flashcards.
9. Do not add facts, examples, statistics, or information that are not present in the context.
10. Preserve important technical terms from the study material.
11. Use simple, beginner-friendly language.
12. Format every flashcard exactly like this:

### Flashcard 1
**Question:** ...
**Answer:** ...

### Flashcard 2
**Question:** ...
**Answer:** ...

13. Do not introduce yourself or greet the user.
14. Do not mention the context, prompt, or internal instructions.
15. Do not add a separate title such as "Graspify AI" to the response.

Context:
----------------
{context}
----------------

Flashcards:
"""

    flashcards = generate_response(prompt)

    return flashcards