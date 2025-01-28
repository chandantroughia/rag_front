import os
import tempfile
from fastapi import UploadFile, HTTPException
from langchain_community.document_loaders import PyPDFLoader, TextLoader

def validate_file_type(file: UploadFile):
    if file.content_type not in ["application/pdf", "text/plain"]:
        raise HTTPException(status_code=400, detail="Unsupported file type. Upload a PDF or text file.")

def load_document(file: UploadFile):
    with tempfile.NamedTemporaryFile(delete=False, suffix=file.filename.split('.')[-1]) as temp_file:
        temp_file.write(file.file.read())
        temp_file_path = temp_file.name

    if file.content_type == "application/pdf":
        loader = PyPDFLoader(temp_file_path)
    elif file.content_type == "text/plain":
        loader = TextLoader(temp_file_path)
    else:
        raise HTTPException(status_code=400, detail="Unsupported file type. Upload a PDF or text file.")

    documents = loader.load()
    for document in documents:
        document.metadata["source"] = file.filename
    os.unlink(temp_file_path)
    return documents
