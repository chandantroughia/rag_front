import React from "react";
import { NavLink } from "react-router-dom";
import { IoChatboxEllipsesOutline, IoDocumentAttachOutline } from "react-icons/io5";
import { MdOutlineDriveFolderUpload } from "react-icons/md";
import logo from "../assets/logo.png";

function Sidebar() {
  return (
    <div
      style={{
        width: "200px",
        backgroundColor: "#f0f0f0",
        color: "#333",
        padding: "20px",
        borderRadius: "8px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        position: "fixed",
        top: 0,
        left: 0,
      }}
    >
      <img
        src={logo}
        alt="App Logo"
        style={{
          width: "100px",
          marginBottom: "20px",
        }}
      />
      <nav>
        <ul style={{ listStyleType: "none", padding: 0 }}>
          <li style={{ marginBottom: "20px" }}>
            <NavLink
              to="/chat-llm"
              title="Chat with RAG"
              style={({ isActive }) => ({
                color: isActive ? "#007bff" : "#333",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "10px",
                borderRadius: "5px",
                backgroundColor: isActive ? "#e6f0ff" : "transparent",
              })}
            >
              <IoChatboxEllipsesOutline size={24} />
              <span>Chat with LLM</span>
            </NavLink>
          </li>
          <li style={{ marginBottom: "20px" }}>
            <NavLink
              to="/upload-document"
              title="Upload Document"
              style={({ isActive }) => ({
                color: isActive ? "#007bff" : "#333",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "10px",
                borderRadius: "5px",
                backgroundColor: isActive ? "#e6f0ff" : "transparent",
              })}
            >
              <MdOutlineDriveFolderUpload size={24} />
              <span>Upload Document</span>
            </NavLink>
          </li>
          <li style={{ marginBottom: "20px" }}>
            <NavLink
              to="/chat-document"
              title="Chat with Document"
              style={({ isActive }) => ({
                color: isActive ? "#007bff" : "#333",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "10px",
                borderRadius: "5px",
                backgroundColor: isActive ? "#e6f0ff" : "transparent",
              })}
            >
              <IoDocumentAttachOutline size={24} />
              <span>Chat with Document</span>
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Sidebar;
