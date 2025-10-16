import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { logoutUser } from "../store/slices/authSlice";
import "./css/Navbar.css";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
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
    const loadingToast = toast.loading("Logging out...");
    dispatch(logoutUser()).then(() => {
      toast.success("Logged out successfully!", { id: loadingToast });
      navigate("/"); // Redirect to homepage immediately after logout
    });
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
          <Link to="/news" onClick={closeMenu}>
            News
          </Link>
          <Link to="/saved" onClick={closeMenu}>
            BookMarks & Liked
          </Link>
          {user && user.role === "admin" && (
            <Link to="/admin" onClick={closeMenu}>
              Admin Dashboard
            </Link>
          )}

          {isAuthenticated ? (
            <div className="nav-auth-group">
              <Link to="/profile" onClick={closeMenu}>
                Profile
              </Link>
              <span className="nav-auth">Welcome, {user?.username}</span>
              <button onClick={handleLogout} className="logout-btn ">
                Logout
              </button>
            </div>
          ) : (
            <div className="nav-auth-group">
              <Link to="/login" className="nav-auth" onClick={closeMenu}>
                Sign In
              </Link>
              <Link to="/signup" className="nav-auth" onClick={closeMenu}>
                {/*signup-btn*/}
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
