/* eslint-disable no-unused-vars */
import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext"; // ✅ import AuthContext
import pic from "../assets/user.webp";
import { motion, AnimatePresence } from "framer-motion";

function Header() {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext); // ✅ get user and logout
  const { cartCount } = useContext(CartContext);

  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out of your account.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Logout",
    }).then((result) => {
      if (result.isConfirmed) {
        logout(); // ✅ use context logout
        Swal.fire(
          "Logged Out!",
          "You have been logged out successfully.",
          "success"
        );
        navigate("/login");
      }
    });
  };

  return (
    <header className="header">
      <Link to="/" className="brand">
        🛒 <strong>SanC@rt</strong>
      </Link>

      <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        ☰
      </div>

      <nav className={`nav-links ${menuOpen ? "open" : ""}`}>
        {/* Centered links */}
        <div className="nav-center">
          <Link to="/" className="nav-item">
            Home
          </Link>
          <Link to="/manageproducts" className="nav-item">
            Products
          </Link>
        </div>

        {/* Cart */}
        <Link to="/cart" className="nav-item cart-icon">
          <i className="fas fa-shopping-cart"></i>
          {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </Link>

        {/* User info + Logout */}
        {user ? (
          <>
            {/* Optional: user dropdown */}
            <div className="user-dropdown">
              <div
                className="user-info"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <img src={pic} alt="avatar" className="avatar" />
                <strong>Hello, {user.name}</strong>
              </div>
              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    className="dropdown-menu"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <button onClick={handleLogout} className="logout-btn">
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Direct Logout button on navbar */}
            <button
              className="nav-item logout-btn"
              style={{ marginLeft: "15px" }}
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-item">
              Login
            </Link>
            <Link to="/register" className="nav-item">
              Register
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}

export default Header;
