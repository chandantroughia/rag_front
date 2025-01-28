import React, { useState } from "react";

function Home({ setIsLoggedIn }) {
  const [username, setUsername] = useState("");

  const handleLogin = () => {
    if (username.trim() !== "") {
      setIsLoggedIn(true); // Set the login state to true
    } else {
      alert("Please enter a valid username");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>Welcome to the Portal</h1>
      <p>Please log in to continue</p>
      <input
        type="text"
        placeholder="Enter your username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        style={{
          padding: "10px",
          width: "250px",
          margin: "10px 0",
          border: "1px solid #ccc",
          borderRadius: "5px",
        }}
      />
      <br />
      <button
        onClick={handleLogin}
        style={{
          padding: "10px 20px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Login
      </button>
    </div>
  );
}

export default Home;
