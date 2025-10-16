import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { logoutUser } from "../store/slices/authSlice";
import "./css/Auth.css";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { user, isLoading } = useSelector((state) => state.auth);

  const handleLogout = () => {
    const loadingToast = toast.loading("Logging out...");
    dispatch(logoutUser()).then(() => {
      toast.success("Logged out successfully!", { id: loadingToast });
    });
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Welcome to Dashboard</h1>
          <p>You are successfully logged in!</p>
        </div>

        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <p style={{ color: "#94a3b8", marginBottom: "10px" }}>
            <strong>Name:</strong> {user?.username}
          </p>
          <p style={{ color: "#94a3b8", marginBottom: "10px" }}>
            <strong>Email:</strong> {user?.email}
          </p>
          <p style={{ color: "#94a3b8", marginBottom: "10px" }}>
            <strong>Role:</strong> {user?.role}
          </p>
          <p style={{ color: "#94a3b8" }}>
            <strong>Verified:</strong> {user?.isVerified ? "Yes" : "No"}
          </p>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <Link
            to="/profile"
            className="auth-button"
            style={{
              display: "inline-block",
              textDecoration: "none",
              textAlign: "center",
              marginBottom: "10px",
              background: "linear-gradient(45deg, #8b5cf6, #06b6d4)",
            }}
          >
            UPDATE PROFILE
          </Link>
        </div>

        <button
          onClick={handleLogout}
          className="auth-button"
          disabled={isLoading}
        >
          {isLoading ? "LOGGING OUT..." : "LOGOUT"}
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
