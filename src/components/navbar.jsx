import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./navbar.css";

export default function Navbar({ role }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const updateCartCount = () => {
      // Use in-memory cart simulation instead of localStorage
      const cart = []; // Replace with your state management solution
      setCartCount(cart.reduce((sum, item) => sum + item.quantity, 0));
    };

    updateCartCount();
    // Remove localStorage event listener as it won't work in this environment
  }, []);

  const handleCartClick = () => {
    setMenuOpen(false);
    navigate("/cart");
  };

  return (
    <header className="navbar">
      {/* Mobile Header Row */}
      <div className="navbar-header">
        <div className="navbar-title">Hayat Store</div>
        <div className="navbar-right">
          <div className="navbar-cart" onClick={handleCartClick}>
            🛒
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </div>
          <button
            className="navbar-toggle"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="Toggle Menu"
          >
            ☰
          </button>
        </div>
      </div>

      {/* Center Links */}
      <nav className={`navbar-center ${menuOpen ? "active" : ""}`}>
        <Link to="/home" onClick={() => setMenuOpen(false)}>Home</Link>
        <Link to="/profile" onClick={() => setMenuOpen(false)}>Profile</Link>
        <Link to="/contact" onClick={() => setMenuOpen(false)}>Contact</Link>
        {role === "admin" && (
          <Link to="/admin" onClick={() => setMenuOpen(false)}>Admin</Link>
        )}
      </nav>
    </header>
  );
}