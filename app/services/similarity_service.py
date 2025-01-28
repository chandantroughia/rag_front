from fastapi import HTTPException
from app.utils.vector_store import initialize_vector_store
from app.utils.file_utils import validate_file_type, load_document
from loguru import logger
import openai
from openai import AsyncOpenAI
import os

async def perform_document_similarity(file, top_n, vector_store_type, llm_type):
    try:
        logger.info("Starting document similarity process with LLM: {}, Vector Store: {}", llm_type, vector_store_type)

        # Step 1: Validate and process the document file
        logger.info("Processing file: '{}'", file.filename)
        validate_file_type(file)
        documents = load_document(file)

        # Combine all document content into a single query
        query = " ".join([doc.page_content for doc in documents])
        logger.info("File processed successfully, query generated from file content.")

        # Step 2: Initialize the vector store
        vectorstore = initialize_vector_store(vector_store_type)
        logger.info("Vector store initialized successfully.")

        # Step 3: Perform similarity search
        logger.info("Performing similarity search with top_n: {}", top_n)
        results = vectorstore.similarity_search_with_score(query, k=top_n)
        logger.info("Similarity search completed. Retrieved {} results.", len(results))

        # Step 4: Prepare context for LLM
        context = "\n\n".join(
            [f"Source: {item[0].metadata.get('source', '')}, Page: {item[0].metadata.get('page', '')}\n{item[0].page_content}"
             for item in results]
        )
        if not context:
            logger.warning("No relevant documents found in similarity search.")
            return {"message": "No relevant documents found.", "data": []}
        logger.info("Context prepared for LLM.")

        # Step 5: Initialize and call LLM
        logger.info("Initializing LLM: {}", llm_type)
        if llm_type == "gpt-4o":
            client = AsyncOpenAI()
            openai.api_key = os.getenv("OPENAI_API_KEY")
            logger.info("Calling GPT-4 with the prepared context.")
            llm_response = await client.chat.completions.create(
                model="gpt-4o",
                messages=[
                    {"role": "system", "content": "You are a highly intelligent assistant."},
                    {"role": "user", "content": f"""
                    Using the provided context, perform the following tasks:
                    1. Answer the query: "{query}".
                    2. If the context doesn't contain relevant information, respond with: 'The context does not contain sufficient information to answer the query.'

                    Context:
                    {context}

                    Your response:
                    """}
                ]
            )
            llm_response_content = llm_response.choices[0].message.content
            logger.info("GPT-4 response received.")
        elif llm_type == "gemini":
            logger.error("Google Gemini is not implemented.")
            raise NotImplementedError("Google Gemini support is not implemented yet.")
        else:
            logger.error("Invalid LLM type specified: {}", llm_type)
            raise ValueError("Invalid LLM type specified.")

        # Step 6: Format response
        formatted_results = [
            {
                "text": item[0].page_content,
                "metadata": item[0].metadata,
                "score": item[1]
            }
            for item in results
        ]
        logger.info("Document similarity process completed successfully.")

        return {
            "message": "Document similarity process completed successfully.",
            "retrieved_documents": formatted_results,
            "llm_response": llm_response_content
        }

    except Exception as e:
        logger.error("An error occurred during document similarity: {}", str(e))
        raise HTTPException(status_code=500, detail=f"An error occurred during document similarity: {str(e)}")

async def perform_text_similarity(query, top_n, llm_type, vector_store_type):
    try:
        logger.info("Starting text similarity process with LLM: {}, Vector Store: {}", llm_type, vector_store_type)
        
        # Step 1: Initialize the vector store
        vectorstore = initialize_vector_store(vector_store_type)
        logger.info("Vector store initialized successfully.")

        # Step 2: Perform similarity search
        logger.info("Performing similarity search for query: {}", query)
        results = vectorstore.similarity_search_with_score(query, k=top_n)
        logger.info("Similarity search completed. Retrieved {} results.", len(results))

        # Step 3: Prepare context for LLM
        context = "\n\n".join(
            [f"Source: {item[0].metadata.get('source', '')}, Page: {item[0].metadata.get('page', '')}\n{item[0].page_content}"
             for item in results]
        )
        if not context:
            logger.warning("No relevant documents found in similarity search.")
            return {"message": "No relevant documents found.", "data": []}
        logger.info("Context prepared for LLM.")

        # Step 4: Initialize and call LLM
        logger.info("Initializing LLM: {}", llm_type)
        if llm_type == "gpt-4o":
            client = AsyncOpenAI()
            openai.api_key = os.getenv("OPENAI_API_KEY")
            logger.info("Calling GPT-4 with the prepared context.")
            llm_response = await client.chat.completions.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": "You are a highly intelligent assistant."},
                    {"role": "user", "content": f"""
                    Using the provided context, perform the following tasks:
                    1. Answer the query: "{query}".
                    2. If the context doesn't contain relevant information, respond with: 'The context does not contain sufficient information to answer the query.'

                    Context:
                    {context}

                    Your response:
                    """}
                ]
            )
            llm_response_content = llm_response.choices[0].message.content
            logger.info("GPT-4 response received.")
        elif llm_type == "gemini":
            logger.error("Google Gemini is not implemented.")
            raise NotImplementedError("Google Gemini support is not implemented yet.")
        else:
            logger.error("Invalid LLM type specified: {}", llm_type)
            raise ValueError("Invalid LLM type specified.")

        # Step 5: Format response
        formatted_results = [
            {
                "text": item[0].page_content,
                "metadata": item[0].metadata,
                "score": item[1]
            }
            for item in results
        ]
        logger.info("Text similarity process completed successfully.")

        return {
            "message": "Text similarity process completed successfully.",
            "retrieved_documents": formatted_results,
            "llm_response": llm_response_content
        }

    except Exception as e:
        logger.error("An error occurred during text similarity: {}", str(e))
        raise HTTPException(status_code=500, detail=f"An error occurred during text similarity: {str(e)}")