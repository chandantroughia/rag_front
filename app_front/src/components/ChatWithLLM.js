import React, { useState } from "react";
import { textSimilarity } from "../api/apiService";

function ChatWithLLM({ messages, setMessages }) {
  const [input, setInput] = useState(""); // User input
  const [topN, setTopN] = useState(5); // Top N similar results
  const [llmType, setLlmType] = useState("gpt-4o"); // Default LLM type
  const [vectorStoreType, setVectorStoreType] = useState("chroma"); // Default Vector Store Type
  const [loading, setLoading] = useState(false); // LLM is thinking

  // Function to handle sending a message
  const handleSendMessage = async () => {
    if (input.trim() !== "") {
      // Add user message to chat history
      setMessages((prevMessages) => [
        ...prevMessages,
        { type: "user", text: input },
      ]);

      // Show "LLM is thinking..." message
      setLoading(true);
      setMessages((prevMessages) => [
        ...prevMessages,
        { type: "system", text: "🤖 LLM is thinking..." },
      ]);

      try {
        // Call text similarity API
        const response = await textSimilarity(input, topN, llmType, vectorStoreType);

        // Extract LLM response
        const llmResponse = response?.llm_response || "No response from LLM.";

        // Extract grounding information
        let groundingInfo = "";
        if (response?.retrieved_documents && response.retrieved_documents.length > 0) {
          groundingInfo = `\n\n----------\n**Grounding:**`;
          response.retrieved_documents.forEach((doc, index) => {
            const source = doc?.metadata?.source || "Unknown Source";
            const page = doc?.metadata?.page !== undefined ? doc.metadata.page : "N/A";
            const score = doc?.score !== undefined ? doc.score.toFixed(6) : "N/A";

            groundingInfo += `\n${index + 1}. Source: ${source}, Page: ${page}, Score: ${score}`;
          });
        }

        // Remove "LLM is thinking..." and add real response
        setMessages((prevMessages) =>
          prevMessages
            .filter((msg) => msg.type !== "system") // Remove "LLM is thinking..."
            .concat({ type: "llm", text: `${llmResponse}${groundingInfo}` })
        );
      } catch (error) {
        console.error("Error fetching LLM response:", error);
        setMessages((prevMessages) =>
          prevMessages
            .filter((msg) => msg.type !== "system") // Remove "LLM is thinking..."
            .concat({ type: "llm", text: "Error: Unable to fetch response from the API." })
        );
      }

      // Hide "LLM is thinking..." message
      setLoading(false);
      setInput(""); // Clear the input box
    }
  };

  // Function to clear the chat
  const handleClearChat = () => {
    setMessages([]); // Reset the messages array
  };

  // Function to handle key presses
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      event.preventDefault(); // Prevent default behavior
      handleSendMessage(); // Trigger sending the message
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
        height: "80vh",
        backgroundColor: "#fff",
      }}
    >
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
                  message.type === "user"
                    ? "#007bff"
                    : message.type === "system"
                    ? "#f4c542"
                    : "#e6e6e6",
                color: message.type === "user" ? "#fff" : "#000",
                fontStyle: message.type === "system" ? "italic" : "normal",
                maxWidth: "80%",
              }}
            >
              {message.text}
            </div>
          </div>
        ))}
      </div>

      {/* Options Section */}
      <div
        style={{
          display: "flex",
          gap: "10px",
          padding: "10px",
          borderTop: "1px solid #ccc",
          backgroundColor: "#f5f5f5",
          alignItems: "center",
        }}
      >
        {/* Top N Dropdown */}
        <select
          value={topN}
          onChange={(e) => setTopN(Number(e.target.value))}
          style={{
            padding: "5px",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        >
          {[1, 3, 5, 10].map((n) => (
            <option key={n} value={n}>
              Top {n}
            </option>
          ))}
        </select>

        {/* LLM Type Dropdown */}
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

        {/* Vector Store Dropdown */}
        <select
          value={vectorStoreType}
          onChange={(e) => setVectorStoreType(e.target.value)}
          style={{
            padding: "5px",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        >
          <option value="chroma">Chroma</option>
          <option value="vertexai">Vertex AI</option>
          <option value="mongodb">MongoDB</option>
        </select>
      </div>

      {/* Input and Clear Chat */}
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
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress} // Listen for Enter key
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
            marginRight: "10px",
          }}
        >
          Send
        </button>
        <button
          onClick={handleClearChat}
          style={{
            padding: "10px 20px",
            backgroundColor: "#ff4d4d",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Clear Chat
        </button>
      </div>
    </div>
  );
}

export default ChatWithLLM;
