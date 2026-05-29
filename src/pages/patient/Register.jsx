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

  .pr-root {
    min-height: 100vh;
    font-family: 'Inter', sans-serif;
    background: #0a0f1e;
    display: flex;
    flex-direction: column;
  }

  /* ── Orbs ── */
  .pr-bg {
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 0;
  }
  .pr-orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(80px);
    opacity: 0.15;
    animation: pr-orb-float 10s ease-in-out infinite;
  }
  .pr-orb-1 { width: 500px; height: 500px; background: #1d4ed8; top: -120px; left: -100px; animation-delay: 0s; }
  .pr-orb-2 { width: 400px; height: 400px; background: #2d5a4e; bottom: -100px; right: -80px; animation-delay: -4s; }
  .pr-orb-3 { width: 280px; height: 280px; background: #7c3aed; top: 40%; left: 55%; animation-delay: -7s; }
  @keyframes pr-orb-float {
    0%,100% { transform: translate(0,0) scale(1); }
    33%      { transform: translate(30px,-40px) scale(1.05); }
    66%      { transform: translate(-20px,20px) scale(0.97); }
  }

  /* ── Header ── */
  .pr-header {
    position: relative; z-index: 10;
    padding: 14px 32px;
    display: flex; align-items: center;
    border-bottom: 1px solid rgba(255,255,255,0.06);
    flex-shrink: 0;
    cursor: pointer;
  }
  .pr-logo-mark {
    width: 34px; height: 34px;
    background: linear-gradient(135deg, #2d5a4e, #3d8b77);
    border-radius: 9px;
    display: flex; align-items: center; justify-content: center;
    font-size: 17px; margin-right: 9px;
    box-shadow: 0 0 0 1px rgba(255,255,255,0.1);
  }
  .pr-logo-name {
    font-size: 18px; font-weight: 800; color: #fff; letter-spacing: -.03em;
  }
  .pr-logo-name span { color: #4ade80; }

  /* ── Main ── */
  .pr-main {
    position: relative; z-index: 10;
    flex: 1;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    padding: 40px 20px;
  }

  /* ── Pill ── */
  .pr-pill {
    display: inline-flex; align-items: center; gap: 7px;
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.1);
    color: #93c5fd;
    font-size: 11px; font-weight: 600;
    letter-spacing: .06em; text-transform: uppercase;
    padding: 5px 12px; border-radius: 20px;
    margin-bottom: 20px;
  }
  .pr-pill-dot {
    width: 6px; height: 6px; background: #3b82f6;
    border-radius: 50%; box-shadow: 0 0 8px #3b82f6;
    animation: pr-pdot 2s ease-in-out infinite;
  }
  @keyframes pr-pdot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(.8)} }

  .pr-heading {
    font-size: 32px; font-weight: 800; color: #fff;
    letter-spacing: -.04em; line-height: 1.1;
    margin-bottom: 8px; text-align: center;
  }
  .pr-heading .blue { color: #60a5fa; }

  .pr-sub {
    font-size: 13px; color: rgba(255,255,255,0.38);
    margin-bottom: 32px; text-align: center;
  }

  /* ── Card ── */
  .pr-card {
    width: 100%; max-width: 420px;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.09);
    border-radius: 20px;
    padding: 28px 28px 24px;
    backdrop-filter: blur(12px);
  }

  /* ── Form ── */
  .pr-form {
    display: flex; flex-direction: column;
    gap: 14px;
  }

  .pr-field {
    display: flex; flex-direction: column;
    gap: 6px;
  }
  .pr-label {
    font-size: 11.5px; font-weight: 600;
    letter-spacing: .04em; text-transform: uppercase;
    color: rgba(255,255,255,0.4);
  }
  .pr-input {
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
  .pr-input::placeholder { color: rgba(255,255,255,0.22); }
  .pr-input:focus {
    border-color: rgba(59,130,246,0.55);
    background: rgba(59,130,246,0.07);
  }

  /* ── Phone row ── */
  .pr-phone-row {
    display: flex; gap: 10px;
  }
  .pr-select {
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
  .pr-select option { background: #1a2235; color: #fff; }
  .pr-select:focus {
    border-color: rgba(59,130,246,0.55);
    background: rgba(59,130,246,0.07);
  }

  /* ── Validation hint ── */
  .pr-hint {
    font-size: 11.5px; margin-top: -4px;
  }
  .pr-hint.valid   { color: #4ade80; }
  .pr-hint.invalid { color: #f87171; }

  /* ── Button ── */
  .pr-btn {
    margin-top: 4px;
    padding: 12px 0;
    background: #3b82f6;
    color: #fff;
    border: none;
    border-radius: 10px;
    font-family: 'Inter', sans-serif;
    font-size: 14px; font-weight: 700;
    cursor: pointer;
    letter-spacing: -.01em;
    transition: opacity .15s, transform .1s;
  }
  .pr-btn:hover:not(:disabled) { opacity: .85; }
  .pr-btn:active:not(:disabled) { transform: scale(.98); }
  .pr-btn:disabled { opacity: .45; cursor: not-allowed; }

  /* ── Divider ── */
  .pr-divider {
    display: flex; align-items: center; gap: 10px;
    margin: 20px 0 0;
  }
  .pr-divider-line { flex: 1; height: 1px; background: rgba(255,255,255,0.08); }
  .pr-divider-text { font-size: 11px; color: rgba(255,255,255,0.2); }

  /* ── Login link ── */
  .pr-login-text {
    margin-top: 14px; text-align: center;
    font-size: 13px; color: rgba(255,255,255,0.35);
  }
  .pr-login-link {
    color: #60a5fa; font-weight: 600; cursor: pointer;
    transition: color .15s;
  }
  .pr-login-link:hover { color: #93c5fd; }

  /* ── Back ── */
  .pr-back {
    margin-top: 22px;
    font-size: 12px; color: rgba(255,255,255,0.2);
    cursor: pointer; transition: color .15s;
    display: flex; align-items: center; gap: 5px;
  }
  .pr-back:hover { color: rgba(255,255,255,0.45); }

  /* ── Footer ── */
  .pr-footer {
    position: relative; z-index: 10;
    text-align: center; padding: 10px;
    border-top: 1px solid rgba(255,255,255,0.05);
    font-size: 11px; color: rgba(255,255,255,0.15);
    flex-shrink: 0;
  }
`;

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

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const isEmailValid = emailRegex.test(email);
  const isPasswordValid = password.length >= 6;

  const getPhoneValidation = () => {
    if (countryCode === "+91") return /^\d{10}$/.test(contactNumber);
    if (countryCode === "+1")  return /^\d{10}$/.test(contactNumber);
    if (countryCode === "+44") return /^\d{10}$/.test(contactNumber);
    if (countryCode === "+61") return /^\d{9}$/.test(contactNumber);
    return false;
  };

  const isPhoneValid = getPhoneValidation();

  const isFormValid = name && isEmailValid && isPasswordValid && isPhoneValid;

  /* ================= SUBMIT ================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isFormValid) {
      return toast.error("Please fill all fields correctly");
    }

    try {
      setLoading(true);

      const fullPhone = `${countryCode}${contactNumber}`;

      const res = await axios.post(
        "https://medilink-j44r.onrender.com/api/auth/register",
        { name, email, password, contactNumber: fullPhone }
      );

      localStorage.setItem("patientToken", res.data.token);
      toast.success("Registered successfully");
      navigate("/patient/profile");

    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{STYLES}</style>
      <div className="pr-root">

        {/* Orbs */}
        <div className="pr-bg">
          <div className="pr-orb pr-orb-1" />
          <div className="pr-orb pr-orb-2" />
          <div className="pr-orb pr-orb-3" />
        </div>

        {/* Header */}
        <header className="pr-header" onClick={() => navigate("/")}>
          <div className="pr-logo-mark">🔗</div>
          <div className="pr-logo-name">Medi<span>Link</span></div>
        </header>

        {/* Main */}
        <main className="pr-main">

          <div className="pr-pill">
            <span className="pr-pill-dot" />
            Patient Portal
          </div>

          <h1 className="pr-heading">
            Create your <span className="blue">account</span>
          </h1>
          <p className="pr-sub">Join MediLink and book your first appointment today</p>

          <div className="pr-card">
            <form className="pr-form" onSubmit={handleSubmit}>

              {/* NAME */}
              <div className="pr-field">
                <label className="pr-label">Full Name</label>
                <input
                  className="pr-input"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              {/* EMAIL */}
              <div className="pr-field">
                <label className="pr-label">Email</label>
                <input
                  className="pr-input"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {/* PASSWORD */}
              <div className="pr-field">
                <label className="pr-label">Password</label>
                <input
                  className="pr-input"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {password && (
                  <p className={`pr-hint ${isPasswordValid ? "valid" : "invalid"}`}>
                    {isPasswordValid ? "Password looks good ✅" : "Must be at least 6 characters"}
                  </p>
                )}
              </div>

              {/* PHONE */}
              <div className="pr-field">
                <label className="pr-label">Phone Number</label>
                <div className="pr-phone-row">
                  <select
                    className="pr-select"
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                  >
                    <option value="+91">+91 (India)</option>
                    <option value="+1">+1 (USA)</option>
                    <option value="+44">+44 (UK)</option>
                    <option value="+61">+61 (Australia)</option>
                  </select>
                  <input
                    className="pr-input"
                    placeholder="Phone number"
                    value={contactNumber}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      setContactNumber(value);
                    }}
                  />
                </div>
              </div>

              {/* SUBMIT */}
              <button
                className="pr-btn"
                type="submit"
                disabled={!isFormValid || loading}
              >
                {loading ? "Creating account…" : "Create account"}
              </button>

            </form>

            <div className="pr-divider">
              <div className="pr-divider-line" />
              <span className="pr-divider-text">or</span>
              <div className="pr-divider-line" />
            </div>

            <p className="pr-login-text">
              Already a member?{" "}
              <span
                className="pr-login-link"
                onClick={() => navigate("/patient/login")}
              >
                Login here
              </span>
            </p>
          </div>

          <span className="pr-back" onClick={() => navigate("/")}>
            ← Back to home
          </span>

        </main>

        {/* Footer */}
        <footer className="pr-footer">
          © 2026 MediLink — Smart Healthcare Platform
        </footer>

      </div>
    </>
  );
};

export default PatientRegister;
