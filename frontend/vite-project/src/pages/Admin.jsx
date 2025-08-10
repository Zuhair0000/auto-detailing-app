import React, { useEffect, useState } from "react";
import "./AdminWorker.css";
import AllWorkers from "../components/allWorkers";
import AllCustomers from "../components/AllCustomers";
import RegisterWorkerForm from "../components/RegisterWorkerForm";

function Admin() {
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState("bookings");
  const [deleted, setDeleted] = useState([]);
  const [allWorkers, setAllWorkers] = useState([]);
  const [allCustomers, setAllCustomers] = useState([]);

  const token = localStorage.getItem("token"); // Or wherever you store it

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res1 = await fetch(`http://localhost:3001/api/admin/bookings`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const res2 = await fetch(
        `http://localhost:3001/api/admin/bookings/deleted`,
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

  useEffect(() => {
    const getAllUsers = async () => {
      try {
        const res1 = await fetch("http://localhost:3001/api/admin/allWorkers", {
          headers: {
            Authorization: `Bearer ${token}`, // include the token
          },
        });

        if (!res1.ok) throw new Error("Failed to fetch workers");
        const res2 = await fetch(
          "http://localhost:3001/api/admin/allCustomers",
          {
            headers: {
              Authorization: `Bearer ${token}`, // include the token
            },
          }
        );

        if (!res2.ok) throw new Error("Failed to fetch customers");

        const data1 = await res1.json();
        const data2 = await res2.json();

        setAllWorkers(data1);
        setAllCustomers(data2);
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };
    getAllUsers();
  }, []);

  const handleDelete = async (id) => {
    await fetch(`http://localhost:3001/api/admin/bookings/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    fetchData(); // Refresh data
  };

  const generateReport = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/admin/report`, {
        headers: {
          Authorization: `Bearer ${token}`, // include the token
        },
      });

      if (!response.ok) throw new Error("Failed to fetch report");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "report.csv";
      a.click();
    } catch (error) {
      console.error("Report generation error:", error);
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
      <h2 className="admin-title"> Admin Dashboard</h2>

      <div className="admin-container">
        <div className="admin-tabs">
          <button
            className={
              activeTab === "bookings" ? "tab-button active" : "tab-button"
            }
            onClick={() => setActiveTab("bookings")}
          >
            Bookings
          </button>
          <button
            className={
              activeTab === "customers" ? "tab-button active" : "tab-button"
            }
            onClick={() => setActiveTab("customers")}
          >
            All Customers
          </button>
          <button
            className={
              activeTab === "workers" ? "tab-button active" : "tab-button"
            }
            onClick={() => setActiveTab("workers")}
          >
            All Workers
          </button>
          <button
            className={
              activeTab === "newWorkers" ? "tab-button active" : "tab-button"
            }
            onClick={() => setActiveTab("newWorkers")}
          >
            Add New Worker
          </button>
        </div>

        {activeTab === "bookings" && (
          <>
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
                  <th>Price</th>
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
                    <td>{b.total_price}</td>
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
          </>
        )}

        {activeTab === "workers" && <AllWorkers allWorkers={allWorkers} />}
        {activeTab === "customers" && (
          <AllCustomers allCustomers={allCustomers} />
        )}
        {activeTab === "newWorkers" && <RegisterWorkerForm />}
      </div>
    </>
  );
}

export default Admin;
