import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import useBackRedirect from "../../hooks/useBackRedirect";
import { toast } from "react-toastify"; // ✅ ADDED

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
        "http://localhost:5000/api/doctor-auth/login",
        {
          email: form.email.trim(),
          password: form.password
        }
      );

      localStorage.setItem("doctorToken", res.data.token);
      localStorage.setItem("doctorData", JSON.stringify(res.data.doctor));

      toast.success("Login successful!"); // ✅ ADDED

      navigate("/doctor/profile");

    } catch (err) {
      console.error(err.response?.data || err);

      const message = err.response?.data?.message;

      // ✅ HANDLE ALL CASES WITH TOAST
      if (message === "Your account has been rejected by admin") {
        toast.error(
          "Your registration request has been rejected by the admin. Please register again with correct details."
        );
      }
      else if (message === "Your account is under admin verification") {
        toast.warning(
          "Your account is still under verification. Please try again later."
        );
      }
      else {
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

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
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

      {/* ✅ REGISTER OPTION */}
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