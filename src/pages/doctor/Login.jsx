import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import useBackRedirect from "../../hooks/useBackRedirect";
import { toast } from "react-toastify";

const DoctorLogin = () => {
  useBackRedirect("/");

  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);

  /* ================= AUTO REDIRECT ================= */
  useEffect(() => {
    const token = localStorage.getItem("doctorToken");
    if (token) {
      navigate("/doctor/profile");
    }
  }, [navigate]);

  /* ================= HANDLE INPUT ================= */
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  /* ================= LOGIN ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await axios.post(
        "https://medilink-j44r.onrender.com/api/doctor/login", // ✅ FIXED ROUTE
        {
          email: form.email.trim(),
          password: form.password
        }
      );

      // ✅ STORE TOKEN
      localStorage.setItem("doctorToken", res.data.token);

      toast.success("Login successful");

      // ✅ DIRECT REDIRECT
      navigate("/doctor");

    } catch (err) {
      console.error(err.response?.data || err);

      const message = err.response?.data?.message;

      if (message === "Account not approved yet") {
        toast.warning("Your account is under admin verification.");
      } else if (message === "Invalid credentials") {
        toast.error("Invalid email or password");
      } else {
        toast.error(message || "Login failed");
      }

    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */
  return (
    <div style={{ maxWidth: "400px", margin: "auto", marginTop: "80px" }}>
      <h2>Doctor Login</h2>

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "10px" }}
      >
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          style={inputStyle}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          style={inputStyle}
        />

        <button
          type="submit"
          disabled={loading}
          style={buttonStyle}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <p style={{ marginTop: "15px", textAlign: "center" }}>
        Not registered?{" "}
        <span
          onClick={() => navigate("/doctor/register")}
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
  backgroundColor: "#1e293b",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer"
};

export default DoctorLogin;
