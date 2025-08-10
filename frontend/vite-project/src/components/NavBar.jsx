import { NavLink, useNavigate } from "react-router-dom";
import "./NavBar.css";
import { useEffect, useState } from "react";

export default function NavBar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    navigate("/login");
  };
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <h2>RI Auto Detailing</h2>
      </div>

      <div className="navbar-links">
        <NavLink to="/" className="nav-link">
          Home
        </NavLink>
        <NavLink to="/booking" className="nav-link">
          Book
        </NavLink>

        <NavLink to="/customerbooking" className="nav-link">
          My Bookings
        </NavLink>

        {isLoggedIn ? (
          <button onClick={handleLogout} className="nav-link logout-button">
            Logout
          </button>
        ) : (
          <NavLink to="/login" className="nav-link">
            Login
          </NavLink>
        )}
      </div>
    </nav>
  );
}
