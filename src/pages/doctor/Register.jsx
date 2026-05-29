import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import useBackRedirect from "../../hooks/useBackRedirect";
import { toast } from "react-toastify";

const DoctorRegister = () => {
  useBackRedirect("/");

  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    countryCode: "+91",
    specialty: "",
    consultationFee: "",
    mode: "online",
    street: "",
    area: "",
    gender: "",
    about: "",
    photo: null,
    registrationNumber: "",
    councilName: "",
    degree: ""
  });

  const [loading, setLoading] = useState(false);

  /* ================= VALIDATIONS ================= */

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const isEmailValid = emailRegex.test(form.email);
  const isPasswordValid = form.password.length >= 6;
  const isPhoneValid = form.phone.length >= 8;

  const isFormValid =
    form.name &&
    isEmailValid &&
    isPasswordValid &&
    isPhoneValid &&
    form.specialty &&
    form.consultationFee &&
    form.gender &&
    form.registrationNumber &&
    form.councilName &&
    form.degree;

  /* ================= HANDLERS ================= */

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 5 * 1024 * 1024) {
      toast.error("Photo must be smaller than 5MB.");
      return;
    }
    setForm({ ...form, photo: file });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) return toast.error("Full name is required.");
    if (!isEmailValid) return toast.error("Please enter a valid email address.");
    if (!isPasswordValid) return toast.error("Password must be at least 6 characters.");
    if (!isPhoneValid) return toast.error("Please enter a valid phone number.");
    if (!form.specialty) return toast.error("Please select a specialty.");
    if (!form.gender) return toast.error("Please select a gender.");
    if (!form.consultationFee) return toast.error("Please enter a consultation fee.");
    if (!form.registrationNumber.trim()) return toast.error("Medical registration number is required.");
    if (!form.councilName.trim()) return toast.error("Medical council name is required.");
    if (!form.degree.trim()) return toast.error("Degree is required.");

    try {
      setLoading(true);

      const formData = new FormData();
      const fullPhone = `${form.countryCode}${form.phone}`;

      Object.keys(form).forEach((key) => {
        if (key !== "countryCode" && form[key]) {
          formData.append(key, form[key]);
        }
      });

      formData.set("phone", fullPhone);

      await axios.post(
        "https://medilink-j44r.onrender.com/api/doctor-auth/register",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      toast.success("Registration submitted! Awaiting admin approval. You can try logging in after some time.");
      navigate("/");

    } catch (error) {
      if (!error.response) {
        toast.error("Network error — please check your internet connection and try again.");
      } else {
        const msg = error.response?.data?.message;
        if (msg === "Doctor already exists") {
          toast.error("This email is already registered. Please log in instead.");
        } else if (msg === "Invalid email format") {
          toast.error("Please enter a valid email address.");
        } else if (msg === "Password must be at least 6 characters long") {
          toast.error("Password must be at least 6 characters long.");
        } else if (msg === "Phone must include country code") {
          toast.error("Phone number must include country code (e.g. +91).");
        } else {
          toast.error(msg || "Registration failed. Please try again.");
        }
      }
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */

  return (
    <div style={pageContainer}>
      <div style={card}>

        <h2 style={{ textAlign: "center", marginBottom: "15px" }}>
          Doctor Registration
        </h2>

        <form onSubmit={handleSubmit} style={formStyle}>

          <input name="name" placeholder="Full Name" onChange={handleChange} required style={input} />

          <input type="email" name="email" placeholder="Email" onChange={handleChange} required style={input} />
          {form.email && !isEmailValid && (
            <p style={{ fontSize: "12px", color: "red" }}>Please enter a valid email.</p>
          )}

          <input type="password" name="password" placeholder="Password" onChange={handleChange} required style={input} />
          {form.password && (
            <p style={{ fontSize: "12px", color: isPasswordValid ? "green" : "red" }}>
              {isPasswordValid ? "Password looks good ✅" : "Minimum 6 characters required"}
            </p>
          )}

          {/* PHONE */}
          <div style={{ display: "flex", gap: "10px" }}>
            <select
              name="countryCode"
              value={form.countryCode}
              onChange={handleChange}
              style={{ ...input, width: "30%" }}
            >
              <option value="+91">+91 (India)</option>
              <option value="+1">+1 (USA)</option>
              <option value="+44">+44 (UK)</option>
              <option value="+61">+61 (Australia)</option>
              <option value="+971">+971 (UAE)</option>
            </select>

            <input
              name="phone"
              placeholder="Phone Number"
              onChange={handleChange}
              required
              style={{ ...input, width: "70%" }}
            />
          </div>

          {/* VERIFICATION */}
          <h4 style={{ marginTop: "10px" }}>Verification Details</h4>

          <input name="registrationNumber" placeholder="Medical Registration Number" onChange={handleChange} required style={input} />
          <input name="councilName" placeholder="Medical Council Name" onChange={handleChange} required style={input} />
          <input name="degree" placeholder="Degree (MBBS, MD, etc.)" onChange={handleChange} required style={input} />

          {/* SPECIALTY */}
          <select name="specialty" value={form.specialty} onChange={handleChange} required style={input}>
            <option value="">Select Specialty</option>
            <option>Neurologist</option>
            <option>General Physician</option>
            <option>Cardiologist</option>
            <option>ENT Specialist</option>
            <option>Pulmonologist</option>
            <option>Allergist</option>
            <option>Vascular Specialist</option>
            <option>Gastroenterologist</option>
            <option>Endocrinologist</option>
            <option>Orthopedic</option>
            <option>Dermatologist</option>
            <option>Psychiatrist</option>
            <option>Nephrologist</option>
            <option>Gynecologist</option>
            <option>Pediatrician</option>
          </select>

          <select name="gender" value={form.gender} onChange={handleChange} required style={input}>
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>

          <input type="number" name="consultationFee" placeholder="Consultation Fee" onChange={handleChange} required style={input} />

          <select name="mode" value={form.mode} onChange={handleChange} style={input}>
            <option value="online">Online</option>
            <option value="offline">Offline</option>
            <option value="both">Both</option>
          </select>

          <textarea name="about" placeholder="Tell patients about yourself" value={form.about} onChange={handleChange} rows="3" style={input} />

          <input name="street" placeholder="Clinic Address" onChange={handleChange} required style={input} />
          <input name="area" placeholder="Area" onChange={handleChange} required style={input} />

          {/* PHOTO */}
          <div>
            <label style={{ fontSize: "14px", fontWeight: "500" }}>
              Choose profile photo (max 5MB)
            </label>
            <input type="file" accept="image/*" onChange={handleFileChange} style={{ marginTop: "5px" }} />
          </div>

          <button
            type="submit"
            disabled={!isFormValid || loading}
            style={{
              ...button,
              opacity: isFormValid && !loading ? 1 : 0.6,
              cursor: isFormValid && !loading ? "pointer" : "not-allowed"
            }}
          >
            {loading ? "Registering... please wait" : "Register"}
          </button>

        </form>

        <p style={{ textAlign: "center", marginTop: "15px" }}>
          Already registered?{" "}
          <Link to="/doctor/login" style={link}>
            Login here
          </Link>
        </p>

      </div>
    </div>
  );
};

/* ================= STYLES ================= */

const pageContainer = {
  height: "100vh",
  overflowY: "scroll",
  padding: "20px",
  background: "#f1f5f9"
};

const card = {
  maxWidth: "500px",
  margin: "0 auto",
  background: "white",
  padding: "25px",
  borderRadius: "10px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
};

const formStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "12px"
};

const input = {
  padding: "10px",
  borderRadius: "6px",
  border: "1px solid #ccc"
};

const button = {
  padding: "12px",
  background: "#2563eb",
  color: "white",
  border: "none",
  borderRadius: "6px"
};

const link = {
  color: "#2563eb",
  fontWeight: "500",
  textDecoration: "none"
};

export default DoctorRegister;
