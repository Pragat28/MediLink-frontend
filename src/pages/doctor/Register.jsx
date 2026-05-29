import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import useBackRedirect from "../../hooks/useBackRedirect";
import { toast } from "react-toastify";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  html, body {
    overflow-y: auto !important;
    height: auto !important;
  }

  .dr-root {
    min-height: 100vh;
    font-family: 'Inter', sans-serif;
    background: #0a0f1e;
    display: flex;
    flex-direction: column;
  }

  /* ── Orbs ── */
  .dr-bg {
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 0;
  }
  .dr-orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(80px);
    opacity: 0.15;
    animation: dr-orb-float 10s ease-in-out infinite;
  }
  .dr-orb-1 { width: 500px; height: 500px; background: #2d5a4e; top: -120px; left: -100px; animation-delay: 0s; }
  .dr-orb-2 { width: 400px; height: 400px; background: #065f46; bottom: -100px; right: -80px; animation-delay: -4s; }
  .dr-orb-3 { width: 280px; height: 280px; background: #0f766e; top: 40%; left: 55%; animation-delay: -7s; }
  @keyframes dr-orb-float {
    0%,100% { transform: translate(0,0) scale(1); }
    33%      { transform: translate(30px,-40px) scale(1.05); }
    66%      { transform: translate(-20px,20px) scale(0.97); }
  }

  /* ── Header ── */
  .dr-header {
    position: relative; z-index: 10;
    padding: 14px 32px;
    display: flex; align-items: center;
    border-bottom: 1px solid rgba(255,255,255,0.06);
    flex-shrink: 0;
    cursor: pointer;
  }
  .dr-logo-mark {
    width: 34px; height: 34px;
    background: linear-gradient(135deg, #2d5a4e, #3d8b77);
    border-radius: 9px;
    display: flex; align-items: center; justify-content: center;
    font-size: 17px; margin-right: 9px;
    box-shadow: 0 0 0 1px rgba(255,255,255,0.1);
  }
  .dr-logo-name {
    font-size: 18px; font-weight: 800; color: #fff; letter-spacing: -.03em;
  }
  .dr-logo-name span { color: #4ade80; }

  /* ── Main ── */
  .dr-main {
    position: relative; z-index: 10;
    flex: 1;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    padding: 40px 20px;
  }

  /* ── Pill ── */
  .dr-pill {
    display: inline-flex; align-items: center; gap: 7px;
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.1);
    color: #a3e6ca;
    font-size: 11px; font-weight: 600;
    letter-spacing: .06em; text-transform: uppercase;
    padding: 5px 12px; border-radius: 20px;
    margin-bottom: 20px;
  }
  .dr-pill-dot {
    width: 6px; height: 6px; background: #4ade80;
    border-radius: 50%; box-shadow: 0 0 8px #4ade80;
    animation: dr-pdot 2s ease-in-out infinite;
  }
  @keyframes dr-pdot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(.8)} }

  .dr-heading {
    font-size: 32px; font-weight: 800; color: #fff;
    letter-spacing: -.04em; line-height: 1.1;
    margin-bottom: 8px; text-align: center;
  }
  .dr-heading .green { color: #4ade80; }

  .dr-sub {
    font-size: 13px; color: rgba(255,255,255,0.38);
    margin-bottom: 32px; text-align: center;
  }

  /* ── Card ── */
  .dr-card {
    width: 100%; max-width: 480px;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.09);
    border-radius: 20px;
    padding: 28px 28px 24px;
    backdrop-filter: blur(12px);
  }

  /* ── Section heading ── */
  .dr-section-title {
    font-size: 11px; font-weight: 700;
    letter-spacing: .08em; text-transform: uppercase;
    color: rgba(74,222,128,0.6);
    margin-top: 6px; margin-bottom: -2px;
    padding-bottom: 8px;
    border-bottom: 1px solid rgba(74,222,128,0.1);
  }

  /* ── Form ── */
  .dr-form {
    display: flex; flex-direction: column;
    gap: 14px;
  }

  .dr-field {
    display: flex; flex-direction: column;
    gap: 6px;
  }
  .dr-label {
    font-size: 11.5px; font-weight: 600;
    letter-spacing: .04em; text-transform: uppercase;
    color: rgba(255,255,255,0.4);
  }
  .dr-input {
    padding: 11px 14px;
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 10px;
    color: #fff;
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    outline: none;
    transition: border-color .2s, background .2s;
    width: 100%;
  }
  .dr-input::placeholder { color: rgba(255,255,255,0.22); }
  .dr-input:focus {
    border-color: rgba(74,222,128,0.5);
    background: rgba(74,222,128,0.06);
  }
  .dr-input option { background: #1a2235; color: #fff; }

  /* ── Phone row ── */
  .dr-phone-row {
    display: flex; gap: 10px;
  }
  .dr-select {
    padding: 11px 10px;
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 10px;
    color: #fff;
    font-family: 'Inter', sans-serif;
    font-size: 13px;
    outline: none;
    cursor: pointer;
    transition: border-color .2s, background .2s;
    flex: 0 0 38%;
  }
  .dr-select option { background: #1a2235; color: #fff; }
  .dr-select:focus {
    border-color: rgba(74,222,128,0.5);
    background: rgba(74,222,128,0.06);
  }

  /* ── Textarea ── */
  .dr-textarea {
    padding: 11px 14px;
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 10px;
    color: #fff;
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    outline: none;
    resize: vertical;
    transition: border-color .2s, background .2s;
    width: 100%;
  }
  .dr-textarea::placeholder { color: rgba(255,255,255,0.22); }
  .dr-textarea:focus {
    border-color: rgba(74,222,128,0.5);
    background: rgba(74,222,128,0.06);
  }

  /* ── File upload ── */
  .dr-file-label {
    display: flex; flex-direction: column; gap: 8px;
    padding: 14px;
    background: rgba(255,255,255,0.04);
    border: 1px dashed rgba(74,222,128,0.2);
    border-radius: 10px;
    cursor: pointer;
    transition: border-color .2s, background .2s;
  }
  .dr-file-label:hover {
    border-color: rgba(74,222,128,0.4);
    background: rgba(74,222,128,0.04);
  }
  .dr-file-label-text {
    font-size: 12px; color: rgba(255,255,255,0.4);
  }
  .dr-file-label-hint {
    font-size: 11px; color: rgba(255,255,255,0.2);
  }
  .dr-file-name {
    font-size: 12px; color: #4ade80; margin-top: 2px;
  }
  .dr-file-input { display: none; }

  /* ── Validation hint ── */
  .dr-hint { font-size: 11.5px; margin-top: -4px; }
  .dr-hint.valid   { color: #4ade80; }
  .dr-hint.invalid { color: #f87171; }

  /* ── Button ── */
  .dr-btn {
    margin-top: 4px;
    padding: 12px 0;
    background: #2d5a4e;
    color: #fff;
    border: none;
    border-radius: 10px;
    font-family: 'Inter', sans-serif;
    font-size: 14px; font-weight: 700;
    cursor: pointer;
    letter-spacing: -.01em;
    transition: background .2s, transform .1s;
  }
  .dr-btn:hover:not(:disabled) { background: #3d7a66; }
  .dr-btn:active:not(:disabled) { transform: scale(.98); }
  .dr-btn:disabled { opacity: .45; cursor: not-allowed; }

  /* ── Divider ── */
  .dr-divider {
    display: flex; align-items: center; gap: 10px;
    margin: 20px 0 0;
  }
  .dr-divider-line { flex: 1; height: 1px; background: rgba(255,255,255,0.08); }
  .dr-divider-text { font-size: 11px; color: rgba(255,255,255,0.2); }

  /* ── Login link ── */
  .dr-login-text {
    margin-top: 14px; text-align: center;
    font-size: 13px; color: rgba(255,255,255,0.35);
  }
  .dr-login-link {
    color: #4ade80; font-weight: 600; cursor: pointer;
    transition: color .15s;
  }
  .dr-login-link:hover { color: #86efac; }

  /* ── Back ── */
  .dr-back {
    margin-top: 22px;
    font-size: 12px; color: rgba(255,255,255,0.2);
    cursor: pointer; transition: color .15s;
    display: flex; align-items: center; gap: 5px;
  }
  .dr-back:hover { color: rgba(255,255,255,0.45); }

  /* ── Footer ── */
  .dr-footer {
    position: relative; z-index: 10;
    text-align: center; padding: 10px;
    border-top: 1px solid rgba(255,255,255,0.05);
    font-size: 11px; color: rgba(255,255,255,0.15);
    flex-shrink: 0;
  }
`;

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

  /* ── Validations ── */
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isEmailValid = emailRegex.test(form.email);
  const isPasswordValid = form.password.length >= 6;
  const isPhoneValid = form.phone.length >= 8;

  const isFormValid =
    form.name && isEmailValid && isPasswordValid && isPhoneValid &&
    form.specialty && form.consultationFee && form.gender &&
    form.registrationNumber && form.councilName && form.degree;

  /* ── Handlers ── */
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

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
    if (!form.name.trim())        return toast.error("Full name is required.");
    if (!isEmailValid)            return toast.error("Please enter a valid email address.");
    if (!isPasswordValid)         return toast.error("Password must be at least 6 characters.");
    if (!isPhoneValid)            return toast.error("Please enter a valid phone number.");
    if (!form.specialty)          return toast.error("Please select a specialty.");
    if (!form.gender)             return toast.error("Please select a gender.");
    if (!form.consultationFee)    return toast.error("Please enter a consultation fee.");
    if (!form.registrationNumber.trim()) return toast.error("Medical registration number is required.");
    if (!form.councilName.trim()) return toast.error("Medical council name is required.");
    if (!form.degree.trim())      return toast.error("Degree is required.");

    try {
      setLoading(true);
      const formData = new FormData();
      const fullPhone = `${form.countryCode}${form.phone}`;
      Object.keys(form).forEach((key) => {
        if (key !== "countryCode" && form[key]) formData.append(key, form[key]);
      });
      formData.set("phone", fullPhone);

      await axios.post(
        "https://medilink-j44r.onrender.com/api/doctor-auth/register",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      toast.success("Registration submitted! Awaiting admin approval.");
      navigate("/");
    } catch (error) {
      if (!error.response) {
        toast.error("Network error — please check your connection and try again.");
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

  return (
    <>
      <style>{STYLES}</style>
      <div className="dr-root">

        {/* Orbs */}
        <div className="dr-bg">
          <div className="dr-orb dr-orb-1" />
          <div className="dr-orb dr-orb-2" />
          <div className="dr-orb dr-orb-3" />
        </div>

        {/* Header */}
        <header className="dr-header" onClick={() => navigate("/")}>
          <div className="dr-logo-mark">🔗</div>
          <div className="dr-logo-name">Medi<span>Link</span></div>
        </header>

        {/* Main */}
        <main className="dr-main">

          <div className="dr-pill">
            <span className="dr-pill-dot" />
            Doctor Portal
          </div>

          <h1 className="dr-heading">
            Join as a <span className="green">Doctor</span>
          </h1>
          <p className="dr-sub">Register to start managing your patients and appointments</p>

          <div className="dr-card">
            <form className="dr-form" onSubmit={handleSubmit}>

              {/* ── Personal Info ── */}
              <p className="dr-section-title">Personal Information</p>

              <div className="dr-field">
                <label className="dr-label">Full Name</label>
                <input className="dr-input" name="name" placeholder="Dr. John Smith" onChange={handleChange} />
              </div>

              <div className="dr-field">
                <label className="dr-label">Email</label>
                <input className="dr-input" type="email" name="email" placeholder="you@example.com" onChange={handleChange} />
                {form.email && !isEmailValid && (
                  <p className="dr-hint invalid">Please enter a valid email.</p>
                )}
              </div>

              <div className="dr-field">
                <label className="dr-label">Password</label>
                <input className="dr-input" type="password" name="password" placeholder="••••••••" onChange={handleChange} />
                {form.password && (
                  <p className={`dr-hint ${isPasswordValid ? "valid" : "invalid"}`}>
                    {isPasswordValid ? "Password looks good ✅" : "Must be at least 6 characters"}
                  </p>
                )}
              </div>

              <div className="dr-field">
                <label className="dr-label">Phone Number</label>
                <div className="dr-phone-row">
                  <select className="dr-select" name="countryCode" value={form.countryCode} onChange={handleChange}>
                    <option value="+91">+91 (India)</option>
                    <option value="+1">+1 (USA)</option>
                    <option value="+44">+44 (UK)</option>
                    <option value="+61">+61 (Australia)</option>
                    <option value="+971">+971 (UAE)</option>
                  </select>
                  <input
                    className="dr-input"
                    name="phone"
                    placeholder="Phone number"
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="dr-field">
                <label className="dr-label">Gender</label>
                <select className="dr-input" name="gender" value={form.gender} onChange={handleChange}>
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* ── Verification ── */}
              <p className="dr-section-title">Verification Details</p>

              <div className="dr-field">
                <label className="dr-label">Medical Registration Number</label>
                <input className="dr-input" name="registrationNumber" placeholder="e.g. MCI-12345" onChange={handleChange} />
              </div>

              <div className="dr-field">
                <label className="dr-label">Medical Council Name</label>
                <input className="dr-input" name="councilName" placeholder="e.g. Medical Council of India" onChange={handleChange} />
              </div>

              <div className="dr-field">
                <label className="dr-label">Degree</label>
                <input className="dr-input" name="degree" placeholder="MBBS, MD, etc." onChange={handleChange} />
              </div>

              {/* ── Practice Info ── */}
              <p className="dr-section-title">Practice Details</p>

              <div className="dr-field">
                <label className="dr-label">Specialty</label>
                <select className="dr-input" name="specialty" value={form.specialty} onChange={handleChange}>
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
              </div>

              <div className="dr-field">
                <label className="dr-label">Consultation Fee (₹)</label>
                <input className="dr-input" type="number" name="consultationFee" placeholder="e.g. 500" onChange={handleChange} />
              </div>

              <div className="dr-field">
                <label className="dr-label">Consultation Mode</label>
                <select className="dr-input" name="mode" value={form.mode} onChange={handleChange}>
                  <option value="online">Online</option>
                  <option value="offline">Offline</option>
                  <option value="both">Both</option>
                </select>
              </div>

              <div className="dr-field">
                <label className="dr-label">About</label>
                <textarea
                  className="dr-textarea"
                  name="about"
                  placeholder="Tell patients about yourself, your experience and approach…"
                  value={form.about}
                  onChange={handleChange}
                  rows="3"
                />
              </div>

              {/* ── Clinic Address ── */}
              <p className="dr-section-title">Clinic Address</p>

              <div className="dr-field">
                <label className="dr-label">Street</label>
                <input className="dr-input" name="street" placeholder="Clinic street address" onChange={handleChange} />
              </div>

              <div className="dr-field">
                <label className="dr-label">Area</label>
                <input className="dr-input" name="area" placeholder="Area / locality" onChange={handleChange} />
              </div>

              {/* ── Photo ── */}
              <p className="dr-section-title">Profile Photo</p>

              <div className="dr-field">
                <label className="dr-file-label" htmlFor="dr-photo-input">
                  <span className="dr-file-label-text">🩺 Choose a profile photo</span>
                  <span className="dr-file-label-hint">Max 5MB · JPG, PNG, WEBP</span>
                  {form.photo && <span className="dr-file-name">✅ {form.photo.name}</span>}
                </label>
                <input
                  id="dr-photo-input"
                  className="dr-file-input"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </div>

              {/* ── Submit ── */}
              <button className="dr-btn" type="submit" disabled={!isFormValid || loading}>
                {loading ? "Submitting registration…" : "Register"}
              </button>

            </form>

            <div className="dr-divider">
              <div className="dr-divider-line" />
              <span className="dr-divider-text">or</span>
              <div className="dr-divider-line" />
            </div>

            <p className="dr-login-text">
              Already registered?{" "}
              <span className="dr-login-link" onClick={() => navigate("/doctor/login")}>
                Login here
              </span>
            </p>
          </div>

          <span className="dr-back" onClick={() => navigate("/")}>
            ← Back to home
          </span>

        </main>

        <footer className="dr-footer">
          © 2026 MediLink — Smart Healthcare Platform
        </footer>

      </div>
    </>
  );
};

export default DoctorRegister;
