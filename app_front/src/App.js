import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Home from "./components/Home";
import ChatWithLLM from "./components/ChatWithLLM";
import UploadDocument from "./components/UploadDocument";
import ChatWithDocument from "./components/ChatWithDocument";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login state
  const [messages, setMessages] = useState([]); // Chat messages state

  return (
    <Router>
      <Routes>
        {/* Login Page */}
        <Route
          path="/"
          element={
            isLoggedIn ? (
              <Navigate to="/chat-llm" replace /> // Redirect if already logged in
            ) : (
              <Home setIsLoggedIn={setIsLoggedIn} />
            )
          }
        />

        {/* Portal */}
        {isLoggedIn && (
          <Route
            path="/*"
            element={
              <div style={{ display: "flex" }}>
                <Sidebar />
                <div style={{ marginLeft: "200px", padding: "20px", flex: 1 }}>
                  <Routes>
                    <Route
                      path="/chat-llm"
                      element={
                        <ChatWithLLM
                          messages={messages}
                          setMessages={setMessages}
                        />
                      }
                    />
                    <Route path="/upload-document" element={<UploadDocument />} />
                    <Route path="/chat-document" element={<ChatWithDocument />} />
                  </Routes>
                </div>
              </div>
            }
          />
        )}

        {/* Redirect unauthenticated users */}
        {!isLoggedIn && <Route path="*" element={<Navigate to="/" replace />} />}
      </Routes>
    </Router>
  );
}

export default App;
