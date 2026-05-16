import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";

import api from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";

import useBackRedirect from "../../hooks/useBackRedirect";

import { toast } from "react-toastify"; // ✅ ADDED

const PatientLogin = () => {
  useBackRedirect("/");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/auth/login", {
        email,
        password
      });

      login(res.data.token, "patient");

      navigate("/patient/Profile");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Login failed"
      );
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "auto", marginTop: "80px" }}>
      <h2>Patient Login</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={inputStyle}
        />

        <button type="submit" style={buttonStyle}>Login</button>
      </form>

      {/* ✅ NEW REGISTER OPTION */}
      <p style={{ marginTop: "15px", textAlign: "center" }}>
        Not a member?{" "}
        <span
          onClick={() => navigate("/patient/register")}
          style={{ color: "#2563eb", cursor: "pointer", fontWeight: "500" }}
        >
          Register here
        </span>
      </p>

    </div>
  );
};

const inputStyle = {
  padding: "10px",
  borderRadius: "6px",
  border: "1px solid #ccc"
};

const buttonStyle = {
  padding: "10px",
  background: "#2563eb",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer"
};

export default PatientLogin;