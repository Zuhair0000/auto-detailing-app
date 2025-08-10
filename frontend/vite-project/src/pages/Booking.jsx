import { useState } from "react";
import "./Booking.css";
import NavBar from "../components/NavBar";
import { useEffect } from "react";
import Footer from "../components/Footer";

export default function Booking() {
  // const services = ["Exerior", "Interior", "Full"];
  const [services, setServices] = useState([]);
  const [carType, setCarType] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [finalPrice, setFinalPrice] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    service_id: "",
    car_type: "",
    date: "",
    time: "",
  });

  useEffect(() => {
    const fetchCustomerInfo = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log("Token from localStorage:", token);
        const res = await fetch("http://localhost:3001/api/customer/me", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("Customer info fetch response status:", res.status);

        const data = await res.json();

        console.log("Customer info response data:", data);
        if (!res.ok) {
          console.log(data.message);
          return;
        }

        setFormData((prev) => ({
          ...prev,
          name: data.name,
          phone: data.phone,
        }));

        console.log("Form data updated with customer info:", formData);
      } catch (err) {
        console.error("Failed to fetch customer info:", err);
      }
    };

    fetchCustomerInfo();
  }, []);

  const isWeekend = (dateString) => {
    const day = new Date(dateString).getDay(); // Sunday: 0, Saturday: 6
    return day === 0 || day === 6;
  };

  const handleDateChange = (e) => {
    const selectedDate = e.target.value;
    if (isWeekend(selectedDate)) {
      alert("We do not accept bookings on weekends.");
      return;
    }
    setFormData({ ...formData, date: selectedDate });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:3001/api/customer/booking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Something went wrong");
        return;
      }

      alert("Booking successful");

      setFormData({
        name: "",
        phone: "",
        service_id: "",
        car_type: "",
        date: "",
        time: "",
      });
    } catch (error) {
      console.error("Booking error:", error);
      alert("Failed to send booking. Try again later.");
    }
  };

  useEffect(() => {
    const fetchFinalPrice = async () => {
      if (formData.service_id === "" || formData.car_type === "") {
        setFinalPrice(null);
        return;
      }
      try {
        const res = await fetch(
          `http://localhost:3001/api/customer/getprice?service=${formData.service_id}&car_type=${formData.car_type}`
        );

        const data = await res.json();
        if (!res.ok) {
          alert(data.message || "Something went wrong");
          return;
        }

        setFinalPrice(data.price);
      } catch (error) {
        console.error("fetching price error:", error);
      }
    };
    fetchFinalPrice();
  }, [formData.service_id, formData.car_type]);

  useEffect(() => {
    const fetchServiceAndCarType = async () => {
      try {
        const res1 = await fetch("http://localhost:3001/api/customer/services");
        const res2 = await fetch("http://localhost:3001/api/customer/cartypes");

        if (!res1.ok || !res2.ok) {
          alert("Something went wrong");
          return;
        }

        const data1 = await res1.json();
        const data2 = await res2.json();
        setServices(data1);
        setCarType(data2);
      } catch (error) {
        console.error("Booking error:", error);
        alert("Failed to send booking. Try again later.");
      }
    };
    fetchServiceAndCarType();
  }, []);

  useEffect(() => {
    const fetchSlots = async () => {
      if (!formData.date || !formData.service_id) return;

      try {
        const res = await fetch(
          `http://localhost:3001/api/customer/available-slots?date=${formData.date}&service=${formData.service_id}`
        );

        const data = await res.json();
        console.log("Available slots:", data);
        setAvailableSlots(data.slots);
      } catch (error) {
        console.error("Failed to fetch slots:", error);
      }
    };
    fetchSlots();
  }, [formData.date, formData.service_id]);
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
            name="service_id"
            value={formData.service_id}
            onChange={handleChange}
            required
          >
            <option value="" disabled>
              Select a service
            </option>
            {services.map((service) => (
              <option key={service.id} value={service.id}>
                {service.name}
              </option>
            ))}
          </select>

          <select
            name="car_type"
            value={formData.car_type}
            onChange={handleChange}
            required
          >
            <option value="">Select car type</option>
            {carType.map((type) => (
              <option key={type.id} value={type.id}>
                {type.type}
              </option>
            ))}
          </select>

          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleDateChange}
            min={new Date().toISOString().split("T")[0]} // disables past days
            required
          />

          <select
            name="time"
            value={formData.time}
            onChange={handleChange}
            required
          >
            <option value="">Select available time</option>
            {availableSlots.map((slot) => (
              <option key={slot} value={slot}>
                {slot}
              </option>
            ))}
          </select>
          {finalPrice && (
            <p className="mt-4 text-green-600 font-semibold">
              Total Price: RM {finalPrice}
            </p>
          )}

          <button type="submit">Confirm booking</button>
        </form>
      </div>
      <Footer />
    </>
  );
}
