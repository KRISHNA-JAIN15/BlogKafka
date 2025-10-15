import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../store/slices/authSlice";
import "./css/Auth.css";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { user, isLoading } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logoutUser());
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
