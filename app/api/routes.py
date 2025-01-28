from fastapi import APIRouter, Query, HTTPException, File, UploadFile
from typing import Union
from app.services.upload_service import process_and_upload_document
from app.services.check_service import vector_store_check
from app.services.similarity_service import perform_text_similarity, perform_document_similarity
from app.utils.logger import logger

router = APIRouter()

# @router.get("/health")
# async def health_check():
#     logger.info("Health check endpoint accessed.")
#     return {"status": "healthy"}

@router.post("/upload/")
async def upload_document(
    file: UploadFile = File(...),
    vector_store_type: str = Query("chroma", description="The vector store to use: 'chroma', 'vertexai', or 'mongodb'")
):
    """
    Endpoint to upload and process a document (PDF or text).

    Args:
        file (UploadFile): The document file to upload.
        vector_store_type (str): The type of vector store to use.

    Returns:
        dict: Response message with the number of chunks processed.
    """
    logger.info(f"Upload endpoint accessed with file: {file.filename} and vector_store_type: {vector_store_type}")
    try:
        response = process_and_upload_document(file, vector_store_type)
        logger.info(f"Document uploaded and processed successfully: {file.filename}")
        return response
    except Exception as e:
        logger.error(f"Error in upload_document: {e}")
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")

@router.post("/text_similarity/")
async def text_similarity(
    query: str = Query(..., description="Query string for similarity search.", min_length=1),
    top_n: int = Query(5, description="Number of top similar documents to return."),
    llm_type: str = Query("gpt-4", description="LLM to use: 'gpt-4' or 'gemini'"),
    vector_store_type: str = Query("chroma", description="The vector store to use: 'chroma', 'vertexai', or 'mongodb'")
):
    """
    Endpoint for Text-Based Similarity Search and LLM Inference.
    """
    logger.info(f"Text similarity endpoint accessed with query: '{query}', top_n: {top_n}, llm_type: {llm_type}, vector_store_type: {vector_store_type}")
    
    try:
        if not query.strip():
            raise HTTPException(status_code=400, detail="Query cannot be empty.")
        # Process the similarity logic
        response = await perform_text_similarity(query, top_n, llm_type, vector_store_type)
        return response
    except Exception as e:
        logger.error(f"Error in text_similarity: {e}")
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")
        
# @router.get("/inspect/")
# async def inspect_vector_store():
#     """
#     Endpoint to inspect the contents of the vector store.

#     Returns:
#         dict: A dictionary containing the stored texts, metadata, and embeddings.
#     """
#     logger.info("Inspect vector store endpoint accessed.")
#     try:
#         response = vector_store_check()
#         logger.info("Vector store inspection completed successfully.")
#         return response
#     except Exception as e:
#         logger.error(f"Error in inspect_vector_store: {e}")
#         raise HTTPException(status_code=500, detail=f"An error occurred while inspecting the vector store: {str(e)}")

@router.post("/document_similarity/")
async def document_similarity_search(
    file: UploadFile = File(..., description="Document file for similarity search."),
    top_n: int = Query(5, description="Number of top similar documents to return."),
    llm_type: str = Query("gpt-4", description="LLM to use: 'gpt-4' or 'gemini'"),
    vector_store_type: str = Query("chroma", description="The vector store to use: 'chroma', 'vertexai', or 'mongodb'")
):
    """
    Endpoint for Document Similarity Search.
    This endpoint is designed specifically for file-based queries.
    """
    logger.info(f"Document similarity endpoint accessed with file: '{file.filename}', top_n: {top_n}, vector_store_type: {vector_store_type}")
    
    try:
        # Validate file input
        if not file or not file.filename.strip():
            logger.error("Validation failed: File must be provided.")
            raise HTTPException(status_code=400, detail="File must be provided.")
        
        # Perform document similarity search
        response = await perform_document_similarity(file, top_n, vector_store_type, llm_type)
        logger.info("Document similarity search completed successfully.")
        return response

    except Exception as e:
        logger.error(f"Error in document_similarity_search: {e}")
        raise HTTPException(status_code=500, detail=f"An error occurred during document similarity search: {str(e)}")