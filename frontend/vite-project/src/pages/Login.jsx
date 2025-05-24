import React, { useState } from "react";
import "./Login.css";
import image1 from "../assets/image-1.webp"; // adjust path if needed

function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);
        onLogin(data.role);
      } else {
        alert(data.message || "Login failed");
      }
    } catch (err) {
      console.log("Login error: ", err);
    }
  };

  return (
    <div
      className="login-wrapper"
      style={{ backgroundImage: `url(${image1})` }}
    >
      <div className="login-container">
        <h2>🔐 Login</h2>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button onClick={handleLogin}>Login</button>
      </div>
    </div>
  );
}

export default Login;
