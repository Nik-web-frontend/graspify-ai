import chromadb

client = chromadb.PersistentClient(path="./chroma_db")

collection = client.get_or_create_collection(name="study_materials")


def store_embeddings(chunks, embeddings, metadata):
    ids = []

    metadatas = []

    for index, chunk in enumerate(chunks):
        ids.append(f"{metadata['document_id']}_chunk_{index}")

        metadatas.append(metadata)

    collection.add(
        ids=ids, documents=chunks, embeddings=embeddings.tolist(), metadatas=metadatas
    )


def get_all_documents():
    return collection.get()
