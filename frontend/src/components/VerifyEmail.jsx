import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  verifyEmail,
  resendVerificationCode,
  clearError,
  clearMessage,
} from "../store/slices/authSlice";
import "./css/Auth.css";

const VerifyEmail = () => {
  const [verificationCode, setVerificationCode] = useState("");
  const [canResend, setCanResend] = useState(true);
  const [countdown, setCountdown] = useState(0);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoading, error, message } = useSelector((state) => state.auth);

  const email = location.state?.email || "";

  // Countdown timer for resend button
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else {
      setCanResend(true);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  // Handle successful verification
  useEffect(() => {
    if (message && message.includes("successfully")) {
      const timer = setTimeout(() => {
        navigate("/login");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [message, navigate]);

  // Clear messages when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearError());
      dispatch(clearMessage());
    };
  }, [dispatch]);

  const handleVerificationChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6); // Only numbers, max 6 digits
    setVerificationCode(value);
  };

  const handleVerifyEmail = async (e) => {
    e.preventDefault();

    if (verificationCode.length !== 6) {
      return;
    }

    dispatch(clearError());
    dispatch(clearMessage());

    dispatch(
      verifyEmail({
        email: email,
        verificationCode: verificationCode,
      })
    );
  };

  const handleResendCode = async () => {
    if (!canResend || !email) return;

    dispatch(clearError());
    dispatch(clearMessage());

    dispatch(resendVerificationCode({ email }));

    setCanResend(false);
    setCountdown(60); // 60 seconds countdown
    setVerificationCode(""); // Clear current code
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Verify Your Email</h1>
          <p>
            We've sent a 6-digit verification code to <br />
            <strong>{email || "your email address"}</strong>
          </p>
        </div>

        {message && <div className="message success">{message}</div>}
        {error && <div className="message error">{error}</div>}

        <form onSubmit={handleVerifyEmail} className="auth-form">
          <div className="form-group">
            <label htmlFor="verificationCode">VERIFICATION CODE</label>
            <input
              type="text"
              id="verificationCode"
              name="verificationCode"
              placeholder="000000"
              value={verificationCode}
              onChange={handleVerificationChange}
              className="verification-input"
              maxLength="6"
              required
            />
          </div>

          <button
            type="submit"
            className="auth-button"
            disabled={isLoading || verificationCode.length !== 6}
          >
            {isLoading ? "VERIFYING..." : "VERIFY EMAIL"}
          </button>

          <button
            type="button"
            className="auth-button-secondary"
            onClick={handleResendCode}
            disabled={!canResend || isLoading || !email}
          >
            {isLoading && countdown === 0
              ? "SENDING..."
              : canResend
              ? "RESEND CODE"
              : `RESEND IN ${countdown}s`}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Remember your password?{" "}
            <Link to="/login" className="auth-link">
              SIGN IN
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
