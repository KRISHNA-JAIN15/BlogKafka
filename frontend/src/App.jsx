import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { loadUserFromStorage } from "./store/slices/authSlice";
import Homepage from "./components/Homepage";
import Login from "./components/Login";
import Signup from "./components/Signup";
import VerifyEmail from "./components/VerifyEmail";
import Dashboard from "./components/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import "./App.css";

function App() {
  const dispatch = useDispatch();

  // Load user from localStorage on app startup
  useEffect(() => {
    dispatch(loadUserFromStorage());
  }, [dispatch]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
