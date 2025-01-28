import axios from "axios";

const BASE_URL = "http://127.0.0.1:8001/api";

const api = axios.create({
  baseURL: BASE_URL,
});

// Upload Document API (Embedding)
export const uploadDocument = async (file, vectorStoreType) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("vector_store_type", vectorStoreType);

  const response = await api.post("/upload/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return response.data;
};

// Perform text similarity search
export const textSimilarity = async (query, topN, llmType, vectorStoreType) => {
  try {
    const response = await api.post(
      "/text_similarity/",
      {
        query: query, // Ensure correct JSON structure
        top_n: topN,
        llm_type: llmType,
        vector_store_type: vectorStoreType,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error in textSimilarity API call:", error.message || error);
    throw error;
  }
};


// Document Similarity API
export const documentSimilarity = async (file, topN, llmType, vectorStoreType) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("top_n", topN);
  formData.append("llm_type", llmType);
  formData.append("vector_store_type", vectorStoreType);

  const response = await api.post("/document_similarity/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return response.data;
};
export default api;

