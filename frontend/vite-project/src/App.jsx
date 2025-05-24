import { Route, Routes, Navigate, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import HomeScreen from "./components/HomeScreen";
import Booking from "./pages/Booking";
import Admin from "./pages/Admin";
import Worker from "./pages/Worker";
import Login from "./pages/Login"; // ✅ Create this component (see next section)

function App() {
  const [role, setRole] = useState(localStorage.getItem("role"));
  const navigate = useNavigate();

  useEffect(() => {
    // If there's a token but no role, logout
    const token = localStorage.getItem("token");
    if (token && !role) {
      localStorage.clear();
      navigate("/login");
    }
  }, [role, navigate]);

  const handleLogin = (newRole) => {
    setRole(newRole);
    if (newRole === "admin") navigate("/admin");
    else if (newRole === "worker") navigate("/work");
  };

  return (
    <Routes>
      <Route path="/" element={<HomeScreen />} />
      <Route path="/booking" element={<Booking />} />
      <Route path="/login" element={<Login onLogin={handleLogin} />} />
      <Route
        path="/admin"
        element={role === "admin" ? <Admin /> : <Navigate to="/login" />}
      />
      <Route
        path="/work"
        element={role === "worker" ? <Worker /> : <Navigate to="/login" />}
      />
      {/* Catch invalid routes */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
