import { useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../../api/axios";
import useBackRedirect from "../../hooks/useBackRedirect";

import { toast } from "react-toastify";

const PatientLogin = () => {
  useBackRedirect("/");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      return toast.error("Please enter email and password");
    }

    try {
      setLoading(true);

      // 🔥 DEBUG LOG (important)
      console.log("Sending login request:", { email, password });

      const res = await api.post("/auth/login", {
        email,
        password
      });

      console.log("LOGIN RESPONSE:", res.data);

      localStorage.setItem("patientToken",res.data.token);
      // ✅ OTP SENT
      toast.success(res.data.message || "Logged in successfully");

      navigate("/patient/profile");

    } catch (err) {
      console.log("FULL ERROR:", err);
      console.log("ERROR RESPONSE:", err.response);

      toast.error(
        err.response?.data?.message ||
        err.message ||
        "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={container}>
      <div style={card}>
        <h2 style={{ textAlign: "center" }}>Patient Login</h2>

        <form onSubmit={handleSubmit} style={form}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={input}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={input}
          />

          <button
            type="submit"
            disabled={loading}
            style={button}
          >
            {loading ? "Logging in" : "Login"}
          </button>
        </form>

        {/* REGISTER */}
        <p style={linkText}>
          Not a member?{" "}
          <span
            onClick={() => navigate("/patient/register")}
            style={link}
          >
            Register here
          </span>
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
  gap: "15px",
  marginTop: "15px"
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

const linkText = {
  marginTop: "12px",
  textAlign: "center",
  fontSize: "14px",
  color: "#2563eb",
  cursor: "pointer"
};

const link = {
  fontWeight: "500"
};

export default PatientLogin;
