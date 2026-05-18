import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("patient");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      return toast.error("Please enter email");
    }

    try {
      setLoading(true);

      await axios.post(
        "http://localhost:5000/api/forgot-password/forgot-password",
        { email, role }
      );

      toast.success("OTP sent to your email");

      navigate("/verify-forgot-otp", {
        state: { email, role }
      });

    } catch (err) {
      toast.error(err.response?.data?.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={container}>
      <div style={card}>
        <h2 style={{ textAlign: "center" }}>Forgot Password</h2>

        <p style={{ textAlign: "center", fontSize: "14px", marginBottom: "10px" }}>
          Enter your email to receive OTP
        </p>

        <form onSubmit={handleSubmit} style={form}>
          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={input}
          />

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            style={input}
          >
            <option value="patient">Patient</option>
            <option value="doctor">Doctor</option>
          </select>

          <button type="submit" style={button} disabled={loading}>
            {loading ? "Sending..." : "Send OTP"}
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

export default ForgotPassword;