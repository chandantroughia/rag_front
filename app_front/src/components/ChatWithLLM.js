import React, { useState } from "react";

function ChatWithLLM({ messages, setMessages }) {
  const [input, setInput] = useState(""); // To hold the current user input

  // Function to handle sending a message
  const handleSendMessage = () => {
    if (input.trim() !== "") {
      // Add the user message to the chat history
      setMessages((prevMessages) => [
        ...prevMessages,
        { type: "user", text: input },
      ]);
      setInput(""); // Clear the input box

      // Simulate LLM response (for now)
      setTimeout(() => {
        setMessages((prevMessages) => [
          ...prevMessages,
          { type: "llm", text: "This is a simulated LLM response." },
        ]);
      }, 1000);
    }
  };

  // Function to clear the chat
  const handleClearChat = () => {
    setMessages([]);
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
                  message.type === "user" ? "#007bff" : "#e6e6e6",
                color: message.type === "user" ? "#fff" : "#000",
                maxWidth: "80%",
              }}
            >
              {message.text}
            </div>
          </div>
        ))}
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
