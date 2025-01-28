import shutil
from app.utils.file_utils import validate_file_type, load_document
from app.utils.vector_store import initialize_vector_store, get_chroma_db_file
from langchain.text_splitter import RecursiveCharacterTextSplitter
from fastapi import HTTPException
from loguru import logger

def process_and_upload_document(file, vector_store_type):
    try:
        logger.info("Starting document upload and processing with vector store type: '{}'", vector_store_type)

        # Step 1: Validate file type
        logger.info("Validating file type for file: '{}'", file.filename)
        validate_file_type(file)
        logger.info("File type validated successfully.")

        # Step 2: Load document content
        logger.info("Loading document content from file: '{}'", file.filename)
        documents = load_document(file)
        logger.info("Document loaded successfully. {} documents found.", len(documents))

        # Step 3: Initialize the vector store
        logger.info("Initializing vector store.")
        vectorstore = initialize_vector_store(vector_store_type)
        logger.info("Vector store initialized successfully.")

        # Step 4: Chunk the document
        logger.info("Splitting documents into chunks with chunk_size=28000 and chunk_overlap=1000.")
        text_splitter = RecursiveCharacterTextSplitter(chunk_size=28000, chunk_overlap=1000)
        chunks = text_splitter.split_documents(documents)
        logger.info("Document split into {} chunks.", len(chunks))

        # Step 5: Add chunks to the vector store
        logger.info("Adding chunks to the vector store.")
        for chunk in chunks:
            metadata = {"source": chunk.metadata.get("source", ""), "page": chunk.metadata.get("page", 0)}
            vectorstore.add_texts([chunk.page_content], [metadata])
        # vectorstore.persist()
        logger.info("Chunks added to vector store and persisted successfully.")

        # Step 6: Create a backup
        logger.info("Creating backup of the vector store.")
        backup_path = get_chroma_db_file().replace("database", "backup")
        shutil.copy(get_chroma_db_file(), backup_path)
        logger.info("Backup created successfully at: {}", backup_path)

        return {"message": "Document uploaded and processed successfully.", "chunks": len(chunks)}

    except Exception as e:
        logger.error("An error occurred during document upload and processing: {}", str(e))
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")
