import React, { useEffect, useState } from "react";
import "./AdminWorker.css";

function Admin() {
  const [bookings, setBookings] = useState([]);
  const [deleted, setDeleted] = useState([]);

  const token = localStorage.getItem("token"); // Or wherever you store it

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res1 = await fetch("http://localhost:3001/api/admin/bookings", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const res2 = await fetch(
        "http://localhost:3001/api/admin/bookings/deleted",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Check if both requests succeeded
      if (!res1.ok) throw new Error(`Bookings fetch error: ${res1.status}`);
      if (!res2.ok) throw new Error(`Deleted fetch error: ${res2.status}`);

      const data1 = await res1.json();
      const data2 = await res2.json();

      setBookings(Array.isArray(data1) ? data1 : []);
      setDeleted(Array.isArray(data2) ? data2 : []);
    } catch (error) {
      console.error("Fetch error:", error);
      setBookings([]);
      setDeleted([]);
      // Optionally show error message or redirect to login
    }
  };

  const handleDelete = async (id) => {
    await fetch(`http://localhost:3001/api/admin/bookings/${id}`, {
      method: "DELETE",
    });
    fetchData(); // Refresh data
  };

  const generateReport = async () => {
    const response = await fetch("http://localhost:3001/api/admin/report");
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "report.csv";
    a.click();
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
      <h2 className="admin-title"> Admin Dashboard</h2>

      <div className="admin-container">
        <h2 className="admin-title">📋 Active Bookings</h2>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>Service</th>
              <th>Date</th>
              <th>Time</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {(Array.isArray(bookings) ? bookings : []).map((b) => (
              <tr key={b.id}>
                <td>{b.name}</td>
                <td>{b.phone}</td>
                <td>{b.service}</td>
                <td>{b.date}</td>
                <td>{b.time}</td>
                <td>{b.status}</td>
                <td>
                  <button onClick={() => handleDelete(b.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2 className="admin-title">🗑️ Deleted Bookings</h2>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>Service</th>
              <th>Date</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {deleted.map((b) => (
              <tr key={b.id}>
                <td>{b.name}</td>
                <td>{b.phone}</td>
                <td>{b.service}</td>
                <td>{b.date}</td>
                <td>{b.time}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <button className="report-button" onClick={generateReport}>
          📄 Generate CSV Report
        </button>
      </div>
    </>
  );
}

export default Admin;
