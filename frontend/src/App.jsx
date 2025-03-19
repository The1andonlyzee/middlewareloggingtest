// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'
import React, { useState } from "react";

function App() {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [username, setUsername] = useState("");  // To hold username input
  const [password, setPassword] = useState("");  // To hold password input
  const [message, setMessage] = useState("");    // To display success or error message
  const [isLoading, setIsLoading] = useState(false);  // To manage loading state while logging in

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);  // Set loading state to true before API call
    try {
      const response = await fetch(`${API_BASE_URL}/api/login`, {
        // const response = await fetch(`http://localhost:3000/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),  // Sending username and password to the server
      });

      if (!response.ok) {  // Check if the response is successful
        throw new Error("Login failed");
      }

      const data = await response.json();  // Parse JSON response
      setMessage(data.message);  // Display the response message (e.g., success or error message)
    } catch (error) {
      console.error("Error logging in:", error);
      setMessage("Login failed");  // Set error message if something goes wrong
    } finally {
      setIsLoading(false);  // Set loading state to false after API call is done
    }
  };

  return (
    <div className="login-container">
      <div className="header-container">
        <p className="title">Admin Panel Pengelolaan Buku Perpustakaan</p>
      </div>
      <div className="form-container">
        <div className="login-card">
          <div className="login-header">
            <h1>Login Admin</h1>
          </div>
          {message && (
            <div className="error-message">
              {message}
            </div>
          )}
          <div className="input-group">
            <p className="label">Username</p>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              className="input-field"
            />
          </div>
          <div className="input-group">
            <p className="label">Password</p>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="input-field"
            />
          </div>
          <button 
            onClick={handleLogin} 
            className="login-button"
            disabled={isLoading}
          >
            {isLoading ? "Logging In..." : "Login"}
          </button>
        </div>
      </div>
    </div>
  );
}


export default App;
