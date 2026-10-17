import fitz


def extract_text_from_pdf(file_path):
    document = fitz.open(file_path)

    extracted_pages = []

    try:
        for page_number, page in enumerate(document, start=1):
            page_text = page.get_text().strip()

            if page_text:
                extracted_pages.append({"page_number": page_number, "text": page_text})
    finally:
        document.close()

    return extracted_pages
