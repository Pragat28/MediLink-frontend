import { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const { email, role } = location.state || {};

  const handleReset = async (e) => {
    e.preventDefault();

    if (!password || password.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }

    try {
      setLoading(true);

      await axios.post(
        "https://medilink-j44r.onrender.com/api/forgot-password/reset-password",
        {
          email,
          newPassword: password,
          role
        }
      );

      toast.success("Password reset successful");

      navigate("/");

    } catch (err) {
      toast.error(err.response?.data?.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={container}>
      <div style={card}>
        <h2 style={{ textAlign: "center" }}>Reset Password</h2>

        <p style={{ textAlign: "center", fontSize: "14px", marginBottom: "10px" }}>
          Enter your new password
        </p>

        <form onSubmit={handleReset} style={form}>
          <input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={input}
          />

          {password && (
            <p
              style={{
                fontSize: "12px",
                marginTop: "-5px",
                color: password.length >= 6 ? "green" : "red"
              }}
            >
              {password.length >= 6
                ? "Password looks good ✅"
                : "Minimum 6 characters required"}
            </p>
          )}

          <button type="submit" style={button} disabled={loading}>
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        {/* BACK TO LOGIN */}
        <p
          onClick={() => navigate("/")}
          style={{
            marginTop: "15px",
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
  border: "1px solid #ccc"
};

const button = {
  padding: "12px",
  background: "#2563eb",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer"
};

export default ResetPassword;