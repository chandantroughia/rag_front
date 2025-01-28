import os
import shutil
from langchain_chroma import Chroma
from langchain_openai import OpenAIEmbeddings
from loguru import logger

# Define directories for database and backup
DATABASE_DIR = "app/database"
BACKUP_DIR = "app/backup"

# Ensure necessary directories exist
os.makedirs(DATABASE_DIR, exist_ok=True)
os.makedirs(BACKUP_DIR, exist_ok=True)

def get_chroma_db_file():
    """Locate Chroma's database file."""
    return os.path.join(DATABASE_DIR, "chroma.sqlite3")

def initialize_vector_store(store_type="chroma"):
    """
    Initialize vector store based on user choice.

    Args:
        store_type (str): The type of vector store to use.

    Returns:
        vectorstore: Initialized vector store object.

    Raises:
        NotImplementedError: If the vector store is not implemented.
        ValueError: If an invalid vector store type is specified.
    """
    if store_type == "chroma":
        db_file = get_chroma_db_file()
        
        if os.path.exists(db_file):
            logger.info(f"Database file found in the database folder. Loading from: {db_file}")
            vectorstore = Chroma(
                persist_directory=DATABASE_DIR,
                embedding_function=OpenAIEmbeddings(openai_api_key=os.getenv("OPENAI_API_KEY"))
            )
        else:
            backup_file = os.path.join(BACKUP_DIR, "chroma.sqlite3")
            if os.path.exists(backup_file):
                logger.info(f"Database file not found in the database folder. Loading from backup: {backup_file}")
                shutil.copy(backup_file, db_file)
            else:
                logger.info("Neither database file nor backup found. Creating a new database file.")
            
            vectorstore = Chroma(
                persist_directory=DATABASE_DIR,
                embedding_function=OpenAIEmbeddings(openai_api_key=os.getenv("OPENAI_API_KEY"))
            )
            logger.info(f"New database file created and persisted at: {db_file}")

            # Create a backup
            shutil.copy(db_file, backup_file)
            logger.info(f"Database file copied to backup folder: {backup_file}")
        
        return vectorstore

    elif store_type == "vertexai":
        raise NotImplementedError("VertexAI vector store is not implemented yet.")
    elif store_type == "mongodb":
        raise NotImplementedError("MongoDB vector store is not implemented yet.")
    else:
        raise ValueError("Invalid vector store type specified.")
