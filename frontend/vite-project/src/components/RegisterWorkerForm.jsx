import React, { useState } from "react";
import "./RegisterWorkerForm.css";

const token = localStorage.getItem("token");

const RegisterWorkerForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    password: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await fetch("http://localhost:3001/api/admin/addWorker", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(data.message || "Worker registered successfully!");
        setFormData({ name: "", phone: "", password: "" });
      } else {
        setMessage(data.message || "Failed to register worker");
      }
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="register-worker-wrapper">
      <form className="register-worker-container" onSubmit={handleSubmit}>
        <h2>Register New Worker</h2>

        <input
          type="text"
          name="name"
          placeholder="Worker Name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <button type="submit">Register Worker</button>

        {message && <p className="register-worker-message">{message}</p>}
      </form>
    </div>
  );
};

export default RegisterWorkerForm;
