import React, { useState } from "react";
import { uploadDocument, documentSimilarity } from "../api/apiService";

function UploadDocument() {
  // States for Uploading (Embedding)
  const [uploadFile, setUploadFile] = useState(null);
  const [vectorStore, setVectorStore] = useState("chroma");

  // States for Document Similarity Search
  const [similarityFile, setSimilarityFile] = useState(null);
  const [topN, setTopN] = useState(5);
  const [llmType, setLlmType] = useState("gpt-4o");
  const [similarityVectorStore, setSimilarityVectorStore] = useState("chroma");

  const [embedStatus, setEmbedStatus] = useState(null);
  const [similarityResults, setSimilarityResults] = useState([]);
  const [loading, setLoading] = useState(false); // Loading state

  // Function to handle Upload (Embedding)
  const handleUpload = async () => {
    if (!uploadFile) {
      alert("Please select a file to upload.");
      return;
    }
    try {
      setEmbedStatus("Uploading...");
      const response = await uploadDocument(uploadFile, vectorStore);
      setEmbedStatus(`Upload successful: ${response.message}`);
    } catch (error) {
      console.error("Upload failed:", error);
      setEmbedStatus("Upload failed. Please try again.");
    }
  };

  // Function to handle Document Similarity Search
  const handleSearchSimilarity = async () => {
    if (!similarityFile) {
      alert("Please select a file for similarity search.");
      return;
    }
    try {
      setSimilarityResults([]); // Clear previous results
      setLoading(true); // Show "Processing..." message
      const response = await documentSimilarity(similarityFile, topN, llmType, similarityVectorStore);
      setLoading(false); // Hide "Processing..." message

      // Check if documents were retrieved
      if (response?.retrieved_documents?.length > 0) {
        setSimilarityResults(response.retrieved_documents);
      } else {
        setSimilarityResults([]);
        alert("No similar documents found.");
      }
    } catch (error) {
      console.error("Similarity search failed:", error);
      setSimilarityResults([]);
      setLoading(false); // Hide "Processing..." on error
      alert("Error: Unable to process similarity search.");
    }
  };

  return (
    <div style={{ maxWidth: "800px", margin: "50px auto", padding: "20px", border: "1px solid #ccc", borderRadius: "10px" }}>
      <h2>Upload and Search Document</h2>

      {/* Upload Document Section */}
      <div style={{ marginBottom: "20px", padding: "15px", border: "1px solid #ddd", borderRadius: "5px" }}>
        <h3>Upload & Embed Document</h3>
        <input type="file" onChange={(e) => setUploadFile(e.target.files[0])} />
        <select value={vectorStore} onChange={(e) => setVectorStore(e.target.value)} style={{ marginLeft: "10px" }}>
          <option value="chroma">Chroma</option>
          <option value="vertexai">Vertex AI</option>
          <option value="mongodb">MongoDB</option>
        </select>
        <button onClick={handleUpload} style={{ marginLeft: "10px", padding: "5px 10px", backgroundColor: "#007bff", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" }}>
          Embed
        </button>
        {embedStatus && <p style={{ marginTop: "10px", color: "green" }}>{embedStatus}</p>}
      </div>

      {/* Search Similarity Section */}
      <div style={{ padding: "15px", border: "1px solid #ddd", borderRadius: "5px" }}>
        <h3>Search Similarity</h3>
        <input type="file" onChange={(e) => setSimilarityFile(e.target.files[0])} />
        <select value={similarityVectorStore} onChange={(e) => setSimilarityVectorStore(e.target.value)} style={{ marginLeft: "10px" }}>
          <option value="chroma">Chroma</option>
          <option value="vertexai">Vertex AI</option>
          <option value="mongodb">MongoDB</option>
        </select>
        <select value={llmType} onChange={(e) => setLlmType(e.target.value)} style={{ marginLeft: "10px" }}>
          <option value="gpt-4o">GPT-4o</option>
          <option value="gemini flash">Gemini Flash</option>
          <option value="gemini pro">Gemini Pro</option>
        </select>
        <select value={topN} onChange={(e) => setTopN(Number(e.target.value))} style={{ marginLeft: "10px" }}>
          <option value={1}>Top 1</option>
          <option value={3}>Top 3</option>
          <option value={5}>Top 5</option>
          <option value={10}>Top 10</option>
        </select>
        <button onClick={handleSearchSimilarity} style={{ marginLeft: "10px", padding: "5px 10px", backgroundColor: "#007bff", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" }}>
          Search Similarity
        </button>
      </div>

      {/* Display Loading Indicator */}
      {loading && (
        <p style={{ marginTop: "10px", textAlign: "center", fontWeight: "bold", color: "#007bff" }}>
          Processing... Please wait.
        </p>
      )}

      {/* Display Similarity Results */}
      {!loading && similarityResults.length > 0 && (
        <div style={{ marginTop: "20px", padding: "15px", border: "1px solid #ccc", borderRadius: "5px" }}>
          <h3>Similar Documents Found:</h3>
          {similarityResults.map((doc, index) => (
            <div key={index} style={{ padding: "10px", marginBottom: "10px", border: "1px solid #ddd", borderRadius: "5px", backgroundColor: "#f9f9f9" }}>
              <p><strong>Document {index + 1}:</strong></p>
              <p>{doc.text.split(" ").slice(0, 1000).join(" ")}...</p>
              <p><strong>Source:</strong> {doc.metadata?.source || "Unknown Source"}</p>
              <p><strong>Page:</strong> {doc.metadata?.page !== undefined ? doc.metadata.page : "N/A"}</p>
              <p><strong>Score:</strong> {doc.score !== undefined ? doc.score.toFixed(6) : "N/A"}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default UploadDocument;
