import React, { useEffect, useState } from "react";
import "./AdminWorker.css";

function Worker() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:3001/api/work/bookings", {
          headers: {
            Authorization: `Bearer ${token}`, // Add auth header if needed
          },
        });

        if (res.status === 401) {
          alert("Unauthorized, please log in.");
          // Optionally redirect to login
          return;
        }

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        setBookings(Array.isArray(data) ? data : []);
      } catch (err) {
        console.log("Error fetching bookings: ", err);
        setBookings([]); // Clear bookings on error
      }
    };
    fetchData();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await fetch(
        `http://localhost:3001/api/work/bookings/${id}/status`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (res.ok) {
        setBookings((prev) =>
          prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
        );
      }
    } catch (err) {
      console.log("Failed to update status", err);
    }
  };
  return (
    <>
      <nav className="navbar">
        <div className="navbar-logo">
          <h2>RI Auto Detailing</h2>
          <button
            onClick={() => {
              localStorage.clear();
              window.location.href = "/login";
            }}
          >
            Logout
          </button>
        </div>
      </nav>
      <h2 className="admin-title"> Work Dashboard</h2>

      <div className="admin-container">
        <h2 className="admin-title">📋 Bookings</h2>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>Service</th>
              <th>Date</th>
              <th>Time</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b.id}>
                <td>{b.name}</td>
                <td>{b.phone}</td>
                <td>{b.service}</td>
                <td>{b.date}</td>
                <td>{b.time}</td>

                <td>
                  <select
                    value={b.status}
                    onChange={(e) => handleStatusChange(b.id, e.target.value)}
                  >
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default Worker;
