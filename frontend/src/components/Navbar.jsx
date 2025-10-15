import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./css/Navbar.css";
import "./css/Navbar.css";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

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
          <Link to="/login" className="nav-auth" onClick={closeMenu}>
            Sign In
          </Link>
        </div>

        {/* Mobile Menu Overlay */}
        {isMenuOpen && <div className="nav-overlay" onClick={closeMenu}></div>}
      </div>
    </nav>
  );
};

export default Navbar;
