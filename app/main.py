from fastapi import FastAPI
from app.api.routes import router
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
load_dotenv()
"""
Create a FastAPI Instance:
This initializes the FastAPI app.
You can pass optional metadata such as title, description, and version to make the API more informative.
These details appear in the automatically generated API documentation (/docs).
"""

# Initialize the FastAPI application
app = FastAPI(
    title="RAG Application",
    description="A Retrieval-Augmented Generation (RAG) API",
    version="0.1.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include the router for API endpoints
# app.include_router(router, prefix="/api/health", tags=["Health"])
# app.include_router(router, prefix="/api/documents", tags=["Documents"])
app.include_router(router, prefix="/api", tags=["RAG"])

# Root endpoint to check the service
@app.get("/")
async def root():
    """
    Root endpoint that provides a welcome message.

    Returns:
        dict: A welcome message.
    """
    return {"message": "Welcome to the RAG Application API!"}