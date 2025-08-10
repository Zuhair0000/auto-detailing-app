import { Route, Routes, Navigate, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import HomeScreen from "./components/HomeScreen";
import Booking from "./pages/Booking";
import Admin from "./pages/Admin";
import Worker from "./pages/Worker";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import CustomerBookings from "./pages/CustomerBookings";

function App() {
  const navigate = useNavigate();
  const [initialized, setInitialized] = useState(false);

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // Only redirect right after login
  const handleLogin = (newRole) => {
    localStorage.setItem("role", newRole);
    if (newRole === "admin") navigate("/admin");
    else if (newRole === "worker") navigate("/work");
    else if (newRole === "customer") navigate("/");
  };

  // On initial load, redirect based on role just once
  useEffect(() => {
    if (token && role && !initialized) {
      if (role === "admin") navigate("/admin");
      else if (role === "worker") navigate("/work");
      else if (role === "customer") navigate("/");
      setInitialized(true); // avoid infinite loop
    }
  }, [token, role, initialized, navigate]);

  return (
    <Routes>
      <Route path="/" element={<HomeScreen />} />
      <Route
        path="/booking"
        element={
          token && role === "customer" ? <Booking /> : <Navigate to="/login" />
        }
      />
      <Route
        path="/customerbooking"
        element={
          token && role === "customer" ? (
            <CustomerBookings />
          ) : (
            <Navigate to="/login" />
          )
        }
      />
      <Route
        path="/admin"
        element={
          token && role === "admin" ? <Admin /> : <Navigate to="/login" />
        }
      />
      <Route
        path="/work"
        element={
          token && role === "worker" ? <Worker /> : <Navigate to="/login" />
        }
      />
      <Route
        path="/login"
        element={
          token && role ? <Navigate to="/" /> : <Login onLogin={handleLogin} />
        }
      />
      <Route path="/signup" element={<Signup />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
