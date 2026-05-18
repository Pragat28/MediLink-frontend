import React, { useState, useContext } from "react";
import api from "../../api/axios";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AuthContext } from "../../context/AuthContext";

const DoctorVerifyOtp = () => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const email = location.state?.email;
  const type = location.state?.type; // register / login

  const handleVerify = async (e) => {
    e.preventDefault();

    if (!otp || otp.length !== 6) {
      return toast.error("Enter valid 6-digit OTP");
    }

    try {
      setLoading(true);

      if (type === "login") {
        const res = await api.post(
          "/doctor-auth/verify-login-otp",
          { email, otp }
        );

        toast.success("Login successful!");

        // ✅ STORE TOKEN VIA CONTEXT (handles localStorage + state together)
        login(res.data.token, "doctor");
        localStorage.setItem("doctorData", JSON.stringify(res.data.doctor));

        navigate("/doctor/profile");

      } else {
        await api.post(
          "/doctor-auth/verify-otp",
          { email, otp }
        );

        toast.success(
          "OTP verified! Your account is now awaiting admin approval."
        );

        navigate("/doctor/login");
      }

    } catch (error) {
      console.error(error.response?.data || error);
      toast.error(
        error.response?.data?.message || "OTP verification failed"
      );
    } finally {
      setLoading(false);
    }
  };

  /* 🔥 RESEND OTP */
  const handleResend = async () => {
    try {
      setResendLoading(true);

      await api.post("/doctor-auth/resend-otp", { email });

      toast.success("OTP resent");

    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to resend OTP"
      );
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
            type="text"
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

        {/* 🔥 FORGOT PASSWORD (only for login) */}
        {type === "login" && (
          <p
            onClick={() =>
              navigate("/forgot-password", {
                state: { email, role: "doctor" }
              })
            }
            style={{
              marginTop: "10px",
              textAlign: "center",
              color: "#dc2626",
              cursor: "pointer",
              fontWeight: "500"
            }}
          >
            Forgot Password?
          </p>
        )}
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
  gap: "15px",
  marginTop: "15px"
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

export default DoctorVerifyOtp;