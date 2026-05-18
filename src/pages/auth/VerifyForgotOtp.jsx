import { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const VerifyForgotOtp = () => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const { email, role } = location.state || {};

  const handleVerify = async (e) => {
    e.preventDefault();

    if (!otp || otp.length !== 6) {
      return toast.error("Enter valid 6-digit OTP");
    }

    try {
      setLoading(true);

      await axios.post(
        "http://localhost:5000/api/forgot-password/verify-otp",
        { email, otp, role }
      );

      toast.success("OTP verified");

      navigate("/reset-password", {
        state: { email, role }
      });

    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  /* 🔥 RESEND OTP */
  const handleResend = async () => {
    try {
      setResendLoading(true);

      await axios.post(
        "http://localhost:5000/api/forgot-password/forgot-password",
        { email, role }
      );

      toast.success("OTP resent");

    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to resend OTP");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div style={container}>
      <div style={card}>
        <h2 style={{ textAlign: "center" }}>Verify OTP</h2>

        <p style={{ textAlign: "center", fontSize: "14px" }}>
          Enter the OTP sent to <b>{email}</b>
        </p>

        <form onSubmit={handleVerify} style={form}>
          <input
            placeholder="Enter 6-digit OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            maxLength={6}
            style={input}
          />

          <button type="submit" style={button} disabled={loading}>
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        {/* 🔥 RESEND OTP */}
        <p
          onClick={handleResend}
          style={{
            marginTop: "12px",
            textAlign: "center",
            color: "#2563eb",
            cursor: "pointer",
            fontWeight: "500",
            opacity: resendLoading ? 0.6 : 1
          }}
        >
          {resendLoading ? "Resending..." : "Resend OTP"}
        </p>

        {/* BACK */}
        <p
          onClick={() => navigate("/")}
          style={{
            marginTop: "10px",
            textAlign: "center",
            color: "#2563eb",
            cursor: "pointer",
            fontWeight: "500"
          }}
        >
          Back to Login
        </p>
      </div>
    </div>
  );
};

/* ================= STYLES ================= */

const container = {
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "#f1f5f9"
};

const card = {
  width: "350px",
  padding: "25px",
  background: "#fff",
  borderRadius: "10px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
};

const form = {
  display: "flex",
  flexDirection: "column",
  gap: "12px",
  marginTop: "10px"
};

const input = {
  padding: "10px",
  borderRadius: "6px",
  border: "1px solid #ccc",
  textAlign: "center",
  fontSize: "18px",
  letterSpacing: "5px"
};

const button = {
  padding: "12px",
  background: "#2563eb",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer"
};

export default VerifyForgotOtp;