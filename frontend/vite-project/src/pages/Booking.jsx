import React, { useState } from "react";
import "./Booking.css";
import NavBar from "../components/NavBar";
import { AreaChart } from "lucide-react";
const API_URL = import.meta.env.VITE_API_URL;

export default function Booking() {
  const services = ["Exerior", "Interior", "Full"];
  const carType = ["Sedan", "SUV"];
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    service: "Select...",
    car_type: "Select...",
    date: "",
    time: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_URL}/api/customer/booking`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Something went wrong");
      }

      alert("Booking successful");

      setFormData({
        name: "",
        phone: "",
        service: "Select...",
        car_type: "Select...",
        date: "",
        time: "",
      });
    } catch (error) {
      console.error("Booking error:", error);
      alert("Failed to send booking. Try again later.");
    }
  };
  return (
    <>
      <NavBar />
      <div className="booking-container">
        <h1>Book your car wash now!</h1>
        <form onSubmit={handleSubmit} className="booking-form">
          <input
            value={formData.name}
            name="name"
            type="text"
            placeholder="Enter Your Name"
            onChange={handleChange}
          />
          <input
            value={formData.phone}
            name="phone"
            type="tel"
            placeholder="Enter your number"
            onChange={handleChange}
          />

          <select
            name="service"
            value={formData.service}
            onChange={handleChange}
            required
          >
            <option value="">Select a service</option>
            {services.map((service) => (
              <option key={service} value={service}>
                {service}
              </option>
            ))}
          </select>

          <select
            name="car_type"
            value={formData.carType}
            onChange={handleChange}
            required
          >
            <option value="">Select car type</option>
            {carType.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>

          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />

          <input
            type="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            required
          />

          <button type="submit">Confirm booking</button>
        </form>
      </div>
    </>
  );
}
