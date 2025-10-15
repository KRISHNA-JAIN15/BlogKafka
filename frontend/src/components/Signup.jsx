import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  signupUser,
  clearError,
  clearMessage,
} from "../store/slices/authSlice";
import "./css/Auth.css";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error, message, pendingVerification } = useSelector(
    (state) => state.auth
  );

  // Handle navigation when signup is successful
  useEffect(() => {
    if (pendingVerification) {
      navigate("/verify-email", { state: { email: pendingVerification } });
    }
  }, [pendingVerification, navigate]);

  // Clear messages when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearError());
      dispatch(clearMessage());
    };
  }, [dispatch]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      // Could dispatch a custom error here, but for now we'll handle it locally
      alert("Passwords do not match!");
      return;
    }

    // Clear any previous errors
    dispatch(clearError());
    dispatch(clearMessage());

    // Dispatch signup action
    dispatch(
      signupUser({
        username: formData.name,
        email: formData.email,
        password: formData.password,
      })
    );
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Create Account</h1>
          <p>Join the future of tech community</p>
        </div>

        {message && (
          <div className={`message ${error ? "error" : "success"}`}>
            {message}
          </div>
        )}
        {error && <div className="message error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="name">NAME</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">EMAIL</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">PASSWORD</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">CONFIRM PASSWORD</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="auth-button" disabled={isLoading}>
            {isLoading ? "CREATING ACCOUNT..." : "SIGN UP"}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account?{" "}
            <Link to="/login" className="auth-link">
              SIGN IN
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
