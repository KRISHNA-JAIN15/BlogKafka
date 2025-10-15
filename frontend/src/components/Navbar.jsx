import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../store/slices/authSlice";
import "./css/Navbar.css";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    closeMenu();
  };

  return (
    <nav className={`navbar ${isScrolled ? "scrolled" : ""}`}>
      <div className="nav-container">
        <div className="nav-brand">
          <Link to="/" onClick={closeMenu}>
            <h2>NewsNet</h2>
          </Link>
        </div>

        <button
          className={`nav-toggle ${isMenuOpen ? "active" : ""}`}
          onClick={toggleMenu}
          aria-label="Toggle navigation menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div className={`nav-links ${isMenuOpen ? "active" : ""}`}>
          <a href="#categories" onClick={closeMenu}>
            Categories
          </a>
          <a href="#featured" onClick={closeMenu}>
            Featured
          </a>
          <a href="#trending" onClick={closeMenu}>
            Trending
          </a>

          {isAuthenticated ? (
            <div className="nav-auth-group">
              <Link to="/dashboard" className="nav-auth" onClick={closeMenu}>
                Welcome, {user?.username}
              </Link>
              <button onClick={handleLogout} className="nav-auth logout-btn">
                Logout
              </button>
            </div>
          ) : (
            <div className="nav-auth-group">
              <Link to="/login" className="nav-auth" onClick={closeMenu}>
                Sign In
              </Link>
              <Link
                to="/signup"
                className="nav-auth signup-btn"
                onClick={closeMenu}
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Overlay */}
        {isMenuOpen && <div className="nav-overlay" onClick={closeMenu}></div>}
      </div>
    </nav>
  );
};

export default Navbar;
