import { NavLink } from "react-router-dom";
import "./NavBar.css";

export default function NavBar() {
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
          Booking
        </NavLink>

        <NavLink to="/about" className="nav-link">
          About
        </NavLink>
      </div>
    </nav>
  );
}
