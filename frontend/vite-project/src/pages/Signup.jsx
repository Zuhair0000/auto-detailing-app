import React, { useState } from "react";
import "./Login.css";
import image1 from "../assets/image-1.webp"; // adjust path if needed
import NavBar from "../components/NavBar";

function Signup() {
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async () => {
    if (!username || !phone || !password) {
      alert("Please fill in all fields");
      return;
    }
    try {
      const res = await fetch(`http://localhost:3001/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, phone, password }),
      });

      console.log("Response status:", res.status); // 🧪 Step 1

      const data = await res.json();

      console.log("Signup response data:", data);

      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);
        localStorage.setItem("customer", JSON.stringify(data.customer));

        alert("Signup successful! Redirecting to dashboard...");
        window.location.href = "/customer-dashboard"; // change this as needed
      } else {
        alert(data.message || "Signup failed");
      }
    } catch (err) {
      console.log("Signup error: ", err);
    }
  };

  return (
    <>
      <NavBar />
      <div
        className="login-wrapper"
        style={{ backgroundImage: `url(${image1})` }}
      >
        <div className="login-container">
          <h2>🔐 Sign up</h2>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
          />
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Phone Number"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
          <button onClick={handleSignup}>Sign up</button>
          <a href="/login">Already have account? Login</a>
        </div>
      </div>
    </>
  );
}

export default Signup;
