import React, { useEffect, useState } from "react";
import "./Services.css";
import sedanImg from "../assets/sedan.png";
import suvImg from "../assets/SUV.png";
import mpvImg from "../assets/MPV1.png";
import { useNavigate } from "react-router-dom";

export default function Services() {
  const [services, setServices] = useState([]);
  const [selectedServiceId, setSelectedServiceId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const carTypeImages = {
    Sedan: sedanImg,
    SUV: suvImg,
    MPV: mpvImg,
  };
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch(
          "http://localhost:3001/api/customer/homeservices"
        );
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

        const data = await res.json();
        setServices(data);
        if (data.length > 0) setSelectedServiceId(data[0].id);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (loading) return <p>Loading services...</p>;
  if (error) return <p>Error: {error}</p>;
  if (services.length === 0) return <p>No services available.</p>;

  const selectedService = services.find((s) => s.id === selectedServiceId);

  return (
    <div>
      <h1>Services</h1>
      {/* Tabs */}
      <div className="tabs">
        {services.map((service) => (
          <button
            key={service.id}
            onClick={() => setSelectedServiceId(service.id)}
            className={`tab-button ${
              service.id === selectedServiceId ? "active" : ""
            }`}
          >
            {service.name}
          </button>
        ))}
      </div>

      {/* Car Type Cards */}
      <div className="cards-container">
        {selectedService?.carTypes.map((car) => (
          <div key={car.id} className="card">
            <img src={carTypeImages[car.name]} alt={car.name} />
            <h3>{car.name}</h3>
            <p>Price: {car.price} RM</p>
          </div>
        ))}
      </div>
      <button onClick={() => navigate("/booking")} className="book-btn">
        Book Now!
      </button>
    </div>
  );
}
