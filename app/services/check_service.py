from fastapi import HTTPException
from app.utils.vector_store import initialize_vector_store
from loguru import logger

def vector_store_check():
    try:
        logger.info("Starting vector store inspection.")

        # Load the existing vector store
        vectorstore = initialize_vector_store("chroma")
        logger.info("Vector store successfully initialized.")

        # Access all stored embeddings and associated data
        items = vectorstore._collection.get(include=["embeddings", "metadatas", "documents"])
        logger.info("Retrieved items from the vector store.")

        # Format the results for display
        results = []
        for text, metadata, embedding in zip(items["documents"], items["metadatas"], items["embeddings"]):
            results.append({
                "text": text,
                "metadata": metadata,
                # "embedding": embedding.tolist() if isinstance(embedding, np.ndarray) else embedding  # Uncomment if embeddings are needed
            })

        logger.info("Vector store inspection completed successfully.")
        return {"message": "Retrieved vector store contents successfully.", "data": results}

    except Exception as e:
        logger.error(f"An error occurred while inspecting the vector store: {str(e)}")
        raise HTTPException(status_code=500, detail=f"An error occurred while inspecting the vector store: {str(e)}")
