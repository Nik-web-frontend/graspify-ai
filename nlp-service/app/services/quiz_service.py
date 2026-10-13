import json
from app.services.chroma_service import get_document_chunks
from app.services.gemini_service import generate_response


def generate_quiz(document_ids: list[str]):

    results = get_document_chunks(document_ids)

    chunks = results.get("documents", [])

    if not chunks:
        return []

    context = "\n\n".join(chunks)

    prompt = f"""
You are Graspify AI, an AI Study Assistant.

Create a multiple-choice quiz from the study material below.

Important instructions:

1. Use ONLY information present in the provided material.
2. Generate 10 questions covering important concepts.
3. Each question must have exactly four options.
4. There must be exactly one correct answer per question.
5. Make the questions clear and beginner-friendly.
6. Avoid duplicate questions.
7. Include a short explanation of the correct answer.
8. Return ONLY a valid JSON array. Do not use Markdown code fences.
9. Follow this exact format:

[
  {{
    "question": "What is ...?",
    "options": [
      "Option A",
      "Option B",
      "Option C",
      "Option D"
    ],
    "correct_answer": "Option B",
    "explanation": "Explanation based on the study material."
  }}
]

Context:
----------------
{context}
----------------

Quiz JSON:
"""

    quiz = generate_response(prompt)

    try:
        quiz_data = json.loads(quiz)
    except json.JSONDecodeError:
        raise ValueError("The AI generated an invalid quiz format. Please try again.")

    if not isinstance(quiz_data, list) or not quiz_data:
        raise ValueError("The AI did not generate a valid quiz.")

    for question in quiz_data:
        if not isinstance(question, dict):
            raise ValueError("Invalid question format.")

        if not all(
            key in question
            for key in [
                "question",
                "options",
                "correct_answer",
                "explanation",
            ]
        ):
            raise ValueError("A question is missing required fields.")

        if not isinstance(question["options"], list) or len(question["options"]) != 4:
            raise ValueError("Each question must contain exactly four options.")

        if question["correct_answer"] not in question["options"]:
            raise ValueError("The correct answer must match one of the options.")

    return quiz_data
