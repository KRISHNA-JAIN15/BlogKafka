import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, clearError, clearMessage } from "../store/slices/authSlice";
import "./css/Auth.css";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error, message, isAuthenticated, pendingVerification } =
    useSelector((state) => state.auth);

  // Handle navigation after successful login
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard"); // Redirect to dashboard
    }
  }, [isAuthenticated, navigate]);

  // Handle unverified user - redirect to verification
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

  const handleSubmit = (e) => {
    e.preventDefault();

    // Clear any previous errors
    dispatch(clearError());
    dispatch(clearMessage());

    // Dispatch login action
    dispatch(
      loginUser({
        email: formData.email,
        password: formData.password,
      })
    );
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Welcome Back</h1>
          <p>Sign in to your account</p>
        </div>

        {message && <div className="message success">{message}</div>}
        {error && <div className="message error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
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

          <button type="submit" className="auth-button" disabled={isLoading}>
            {isLoading ? "SIGNING IN..." : "SIGN IN"}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Don't have an account?{" "}
            <Link to="/signup" className="auth-link">
              SIGN UP
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
