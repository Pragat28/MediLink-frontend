import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import useBackRedirect from "../../hooks/useBackRedirect";
import { toast } from "react-toastify";

const PatientRegister = () => {
  useBackRedirect("/");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [contactNumber, setContactNumber] = useState("");
  const [countryCode, setCountryCode] = useState("+91");

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  /* ================= VALIDATIONS ================= */

  const emailRegex =
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const isEmailValid = emailRegex.test(email);
  const isPasswordValid = password.length >= 6;

  const getPhoneValidation = () => {
    if (countryCode === "+91") return /^\d{10}$/.test(contactNumber);
    if (countryCode === "+1") return /^\d{10}$/.test(contactNumber);
    if (countryCode === "+44") return /^\d{10}$/.test(contactNumber);
    if (countryCode === "+61") return /^\d{9}$/.test(contactNumber);
    return false;
  };

  const isPhoneValid = getPhoneValidation();

  const isFormValid =
    name &&
    isEmailValid &&
    isPasswordValid &&
    isPhoneValid;

  /* ================= SUBMIT ================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isFormValid) {
      return toast.error("Please fill all fields correctly");
    }

    try {
      setLoading(true);

      const fullPhone = `${countryCode}${contactNumber}`;

      await axios.post(
        "http://localhost:5000/api/auth/register",
        {
          name,
          email,
          password,
          contactNumber: fullPhone
        }
      );

      // ✅ OTP SENT
      toast.success("Registered successfully");

      // ✅ REDIRECT TO OTP PAGE
      navigate("/patient/profile");

    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "auto", marginTop: "80px" }}>
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "10px" }}
      >
        <h2>Patient Register</h2>

        {/* NAME */}
        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={inputStyle}
        />

        {/* EMAIL */}
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
        />

        {/* PASSWORD */}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={inputStyle}
        />

        {password && (
          <p
            style={{
              fontSize: "12px",
              marginTop: "-5px",
              color: isPasswordValid ? "green" : "red"
            }}
          >
            {isPasswordValid
              ? "Password looks good ✅"
              : "Password must be at least 6 characters"}
          </p>
        )}

        {/* PHONE */}
        <div style={{ display: "flex", gap: "10px" }}>
          <select
            value={countryCode}
            onChange={(e) => setCountryCode(e.target.value)}
            style={{ ...inputStyle, width: "30%" }}
          >
            <option value="+91">+91 (India)</option>
            <option value="+1">+1 (USA)</option>
            <option value="+44">+44 (UK)</option>
            <option value="+61">+61 (Australia)</option>
          </select>

          <input
            placeholder="Phone Number"
            value={contactNumber}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "");
              setContactNumber(value);
            }}
            style={{ ...inputStyle, width: "70%" }}
          />
        </div>

        {/* BUTTON */}
        <button
          type="submit"
          disabled={!isFormValid || loading}
          style={{
            ...buttonStyle,
            opacity: isFormValid ? 1 : 0.6,
            cursor: isFormValid ? "pointer" : "not-allowed"
          }}
        >
          {loading ? "Registering" : "Register"}
        </button>
      </form>

      {/* LOGIN */}
      <p style={{ marginTop: "15px", textAlign: "center" }}>
        Already a member?{" "}
        <span
          onClick={() => navigate("/patient/login")}
          style={{ color: "#2563eb", cursor: "pointer", fontWeight: "500" }}
        >
          Login here
        </span>
      </p>
    </div>
  );
};

/* ================= STYLES ================= */

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
  borderRadius: "6px"
};

export default PatientRegister;
