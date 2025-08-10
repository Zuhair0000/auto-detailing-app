import React, { useEffect, useState } from "react";
import "./CustomerBookings.css";
import NavBar from "../components/NavBar";

function CustomerBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // const customerRaw = localStorage.getItem("customer");
  // const customerData = customerRaw ? JSON.parse(customerRaw) : null;
  // const customerId = customerData?.id; // make sure this is set on login
  // console.log("Customer ID:", customerId);
  // const token = localStorage.getItem("token");
  // console.log("Token:", token);

  useEffect(() => {
    const fetchBookings = async () => {
      const customerRaw = localStorage.getItem("customer");
      const customerData = customerRaw ? JSON.parse(customerRaw) : null;
      const customerId = customerData?.id;
      const token = localStorage.getItem("token");

      if (!customerId || !token) {
        setError("Customer ID or token not found. Please login again.");
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(
          `http://localhost:3001/api/customer/booking/${customerId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch bookings");
        }

        setBookings(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading) return <p>Loading your bookings...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <>
      <NavBar />
      <div className="bookings-container">
        <h2>📅 Your Bookings</h2>
        {bookings.length === 0 ? (
          <p>No bookings found.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Service</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id}>
                  <td>{booking.id}</td>
                  <td>{booking.service}</td>
                  <td>{new Date(booking.date).toLocaleDateString()}</td>
                  <td>{booking.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}

export default CustomerBookings;
