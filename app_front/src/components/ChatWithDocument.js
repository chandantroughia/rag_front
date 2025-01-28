import React, { useState } from "react";
import { documentMultimodal } from "../api/apiService";

function ChatWithDocument() {
  const [uploadedFile, setUploadedFile] = useState(null); // File uploaded by the user
  const [input, setInput] = useState(""); // User query input
  const [messages, setMessages] = useState([]); // Chat history
  const [loading, setLoading] = useState(false); // Loading state for API responses
  const [llmType, setLlmType] = useState("gpt-4o"); // Default LLM type

  // Function to handle file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedFile(file);
      setMessages([]); // Reset chat history when a new file is uploaded
    }
  };

  // Function to handle sending a query
  const handleSendMessage = async () => {
    if (!uploadedFile) {
      alert("Please upload a document first.");
      return;
    }

    if (input.trim() === "") {
      alert("Please enter a question.");
      return;
    }

    // Add user query to chat history
    setMessages((prevMessages) => [
      ...prevMessages,
      { type: "user", text: input },
    ]);

    setLoading(true); // Show loading indicator

    try {
      // Call the API with the query, file, and selected LLM
      const response = await documentMultimodal(input, uploadedFile, llmType);

      // Extract LLM response
      const llmResponse = response?.llm_response || "No response from LLM.";

      // Add LLM response to chat history
      setMessages((prevMessages) => [
        ...prevMessages,
        { type: "llm", text: llmResponse },
      ]);
    } catch (error) {
      console.error("Error fetching LLM response:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { type: "llm", text: "Error: Unable to fetch response from the API." },
      ]);
    }

    setLoading(false); // Hide loading indicator
    setInput(""); // Clear input field
  };

  // Function to handle key presses
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div
      style={{
        maxWidth: "1500px",
        margin: "50px auto",
        border: "1px solid #ccc",
        borderRadius: "10px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        height: "85vh",
        backgroundColor: "#fff",
      }}
    >
      {/* Header Section */}
      <div
        style={{
          padding: "20px",
          borderBottom: "1px solid #ccc",
          backgroundColor: "#f5f5f5",
          textAlign: "center",
        }}
      >
        <h2 style={{ margin: "5px 0", color: "#333" }}>Document Chat Assistant</h2>
        <p style={{ margin: 0, color: "#666", fontSize: "14px" }}>
          {uploadedFile
            ? `You're now chatting using: ${uploadedFile.name}`
            : "Upload a document to ask questions based on its content"}
        </p>
      </div>

      {/* File Upload Section */}
      <div
        style={{
          padding: "10px",
          borderBottom: "1px solid #ccc",
          backgroundColor: "#f9f9f9",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          <input
            type="file"
            accept=".pdf,.txt,.docx"
            onChange={handleFileUpload}
            style={{
              padding: "5px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          />
          {uploadedFile && (
            <span style={{ marginLeft: "10px", fontWeight: "bold" }}>
              File: {uploadedFile.name}
            </span>
          )}
        </div>

        {/* LLM Selection Dropdown */}
        <select
          value={llmType}
          onChange={(e) => setLlmType(e.target.value)}
          style={{
            padding: "5px",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        >
          <option value="gpt-4o">GPT-4o</option>
          <option value="gemini flash">Gemini Flash</option>
          <option value="gemini pro">Gemini Pro</option>
        </select>
      </div>

      {/* Chat History */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "20px",
          backgroundColor: "#f9f9f9",
        }}
      >
        {messages.map((message, index) => (
          <div
            key={index}
            style={{
              margin: "10px 0",
              textAlign: message.type === "user" ? "right" : "left",
            }}
          >
            <div
              style={{
                display: "inline-block",
                padding: "10px 15px",
                borderRadius: "15px",
                backgroundColor:
                  message.type === "user" ? "#007bff" : "#e6e6e6",
                color: message.type === "user" ? "#fff" : "#000",
                maxWidth: "80%",
              }}
            >
              {message.text}
            </div>
          </div>
        ))}
        {loading && (
          <p
            style={{
              textAlign: "center",
              fontStyle: "italic",
              color: "#007bff",
            }}
          >
            🤖 Processing your query... Please wait.
          </p>
        )}
      </div>

      {/* Input and Send Section */}
      <div
        style={{
          display: "flex",
          padding: "10px",
          borderTop: "1px solid #ccc",
          backgroundColor: "#fff",
          alignItems: "center",
        }}
      >
        <input
          type="text"
          placeholder="Ask a question about the document..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          style={{
            flex: 1,
            padding: "10px",
            borderRadius: "5px",
            border: "1px solid #ccc",
            marginRight: "10px",
          }}
        />
        <button
          onClick={handleSendMessage}
          style={{
            padding: "10px 20px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatWithDocument;
