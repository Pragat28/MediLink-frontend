import { useEffect, useState } from "react";
import axios from "axios";
import useBackRedirect from "../../hooks/useBackRedirect";
import { toast } from "react-toastify";

const BASE_URL = "https://medilink-j44r.onrender.com/api";

/* ─── Injected Styles ─────────────────────────────────── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Serif+Display&display=swap');
  *, *::before, *::after { box-sizing: border-box; }

  .pp-root {
    --accent:        #3b6b9e;
    --accent-light:  #4d7daf;
    --accent-bg:     #eef3f9;
    --accent-border: rgba(59,107,158,0.18);
    --accent-muted:  #6a94bc;
    --danger:        #a33030;
    --danger-bg:     #fdf1f1;
    --danger-border: rgba(163,48,48,0.15);
    --warn:          #7a4f1d;
    --warn-bg:       #fdf8f0;
    --success:       #1a6640;
    --success-bg:    #eef8f2;
    --neutral-bg:    #f4f6f9;
    --border:        rgba(0,0,0,0.07);
    --border-md:     rgba(0,0,0,0.11);
    --text:          #1a1f2e;
    --text-sec:      #3d4a5c;
    --muted:         #697586;
    --surface:       #fff;
    --page-bg:       #edf0f5;
    --disabled-bg:   #f4f6f9;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    color: var(--text);
    background: var(--page-bg);
    min-height: 100vh;
    padding: 24px 16px 60px;
  }

  .pp-wrap {
    max-width: 860px;
    margin: 0 auto;
  }

  /* ── Page header ── */
  .pp-page-header {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 14px;
    padding: 16px 24px;
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    gap: 12px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  }
  .pp-page-header-text h1 {
    font-family: 'DM Serif Display', serif;
    font-size: 20px;
    font-weight: 400;
    margin: 0;
    color: var(--text);
  }

  /* ── Loading / error full-page states ── */
  .pp-state-box {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 14px;
    padding: 56px 24px;
    text-align: center;
    color: var(--muted);
  }
  .pp-state-icon {
    width: 46px; height: 46px;
    border-radius: 50%;
    background: var(--accent-bg);
    display: flex; align-items: center; justify-content: center;
    color: var(--accent);
    font-size: 21px;
    margin: 0 auto 14px;
  }
  .pp-state-icon.danger { background: var(--danger-bg); color: var(--danger); }
  .pp-state-h { font-size: 16px; font-weight: 600; color: var(--text); margin: 0 0 4px; }
  .pp-state-p { font-size: 13px; margin: 0 0 16px; }
  .pp-spinner {
    width: 18px; height: 18px;
    border: 2px solid var(--border);
    border-top-color: var(--accent);
    border-radius: 50%;
    animation: pp-spin .7s linear infinite;
    margin: 0 auto 14px;
  }
  @keyframes pp-spin { to { transform: rotate(360deg); } }

  /* ── Cards ── */
  .pp-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 14px;
    overflow: hidden;
    margin-bottom: 14px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.04);
  }
  .pp-card-header {
    padding: 13px 22px;
    border-bottom: 1px solid var(--border);
    display: flex;
    align-items: center;
    gap: 9px;
    background: var(--neutral-bg);
  }
  .pp-card-header h2 {
    font-size: 13.5px;
    font-weight: 700;
    margin: 0;
    color: var(--text);
    letter-spacing: .01em;
  }
  .pp-card-body { padding: 18px 22px; }

  /* ── Form grid ── */
  .pp-grid-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px 18px;
  }
  .pp-grid-1 { display: grid; grid-template-columns: 1fr; gap: 14px; }

  @media (max-width: 600px) {
    .pp-grid-2 { grid-template-columns: 1fr; }
  }

  /* ── Field ── */
  .pp-field { display: flex; flex-direction: column; gap: 4px; }
  .pp-label {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: .05em;
    text-transform: uppercase;
    color: var(--muted);
  }
  .pp-label span.req { color: var(--danger); margin-left: 2px; }

  .pp-input,
  .pp-select,
  .pp-textarea {
    padding: 8px 11px;
    border: 1px solid var(--border-md);
    border-radius: 7px;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    color: var(--text);
    background: var(--surface);
    outline: none;
    transition: border-color .15s, box-shadow .15s;
    width: 100%;
  }
  .pp-select {
    appearance: none;
    -webkit-appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 10px center;
    padding-right: 30px;
  }
  .pp-textarea { resize: vertical; min-height: 80px; line-height: 1.6; }

  .pp-input:focus,
  .pp-select:focus,
  .pp-textarea:focus {
    border-color: var(--accent);
    box-shadow: 0 0 0 3px var(--accent-bg);
  }
  .pp-input.error,
  .pp-select.error { border-color: var(--danger); box-shadow: 0 0 0 3px var(--danger-bg); }

  .pp-input:disabled,
  .pp-select:disabled {
    background: var(--disabled-bg);
    color: var(--muted);
    cursor: not-allowed;
  }

  .pp-field-error {
    font-size: 11.5px;
    color: var(--danger);
    display: flex;
    align-items: center;
    gap: 4px;
    margin-top: 1px;
  }
  .pp-field-error i { font-size: 13px; }

  .pp-hint {
    font-size: 11.5px;
    color: var(--muted);
    margin-top: 1px;
  }

  /* ── Checkbox toggle ── */
  .pp-checkbox-row {
    display: flex;
    align-items: center;
    gap: 9px;
    padding: 10px 13px;
    background: var(--neutral-bg);
    border: 1px solid var(--border);
    border-radius: 8px;
    cursor: pointer;
    user-select: none;
    width: fit-content;
  }
  .pp-checkbox-row input[type="checkbox"] { width: 15px; height: 15px; accent-color: var(--accent); cursor: pointer; }
  .pp-checkbox-label { font-size: 13px; font-weight: 500; color: var(--text); }

  /* ── Pregnancy sub-section ── */
  .pp-pregnancy-box {
    margin-top: 16px;
    padding: 14px 16px;
    background: var(--accent-bg);
    border: 1px solid var(--accent-border);
    border-radius: 9px;
  }
  .pp-pregnancy-title {
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: .05em;
    color: var(--accent);
    margin: 0 0 10px;
  }

  /* ── Info notice ── */
  .pp-notice {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    padding: 10px 13px;
    background: var(--warn-bg);
    border: 1px solid rgba(122,79,29,0.13);
    border-radius: 8px;
    font-size: 12.5px;
    color: var(--warn);
    margin-bottom: 14px;
  }
  .pp-notice i { font-size: 15px; flex-shrink: 0; margin-top: 1px; }

  /* ── Phone row ── */
  .pp-phone-row {
    display: flex;
    gap: 8px;
  }
  .pp-phone-prefix {
    padding: 8px 11px;
    border: 1px solid var(--border-md);
    border-radius: 7px;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    color: var(--muted);
    background: var(--disabled-bg);
    white-space: nowrap;
    flex-shrink: 0;
  }

  /* ── Save bar ── */
  .pp-save-bar {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 10px;
    padding: 14px 22px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 14px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.04);
  }
  .pp-save-btn {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding: 10px 24px;
    border: none;
    border-radius: 8px;
    background: var(--accent);
    color: #fff;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
    transition: opacity .15s, transform .1s;
  }
  .pp-save-btn:hover  { opacity: .88; }
  .pp-save-btn:active { transform: scale(.97); }
  .pp-save-btn:disabled { opacity: .55; cursor: not-allowed; transform: none; }
  .pp-save-btn i { font-size: 16px; }

  .pp-retry-btn {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 8px 18px;
    border: 1px solid var(--accent-border);
    border-radius: 7px;
    background: var(--accent-bg);
    color: var(--accent);
    font-family: 'DM Sans', sans-serif;
    font-size: 13px; font-weight: 600;
    cursor: pointer;
    transition: background .15s;
  }
  .pp-retry-btn:hover { background: #d9e5f3; }

  @media (max-width: 480px) {
    .pp-root { padding: 14px 10px 50px; }
    .pp-card-body { padding: 14px 16px; }
    .pp-page-header { padding: 14px 16px; }
    .pp-save-bar { padding: 12px 16px; }
  }
`;

/* ─── Known country codes (must match PatientRegister options) ── */
const KNOWN_CODES = ["+91", "+1", "+44", "+61"];

/* digit length expected per country code */
const PHONE_LENGTHS = {
  "+91": 10,
  "+1":  10,
  "+44": 10,
  "+61": 9,
};

/* ─── Strip country code from stored number ───────────────────── */
const stripCountryCode = (raw = "") => {
  const matched = KNOWN_CODES.find(code => raw.startsWith(code));
  return {
    code: matched || "+91",
    number: matched ? raw.slice(matched.length) : raw,
  };
};

/* ─── Validation ──────────────────────────────────────────────── */
const validate = (profile, detectedCountryCode) => {
  const errors = {};
  if (!profile.name?.trim()) errors.name = "Name is required.";

  if (profile.contactNumber) {
    const expectedLength = PHONE_LENGTHS[detectedCountryCode] || 10;
    const regex = new RegExp(`^\\d{${expectedLength}}$`);
    if (!regex.test(profile.contactNumber)) {
      errors.contactNumber = `Enter a valid ${expectedLength}-digit number.`;
    }
  }

  if (profile.age && (isNaN(profile.age) || profile.age < 1 || profile.age > 120))
    errors.age = "Enter a valid age (1–120).";
  if (profile.height && (isNaN(profile.height) || profile.height < 50 || profile.height > 300))
    errors.height = "Enter a valid height (50–300 cm).";
  if (profile.weight && (isNaN(profile.weight) || profile.weight < 1 || profile.weight > 500))
    errors.weight = "Enter a valid weight (1–500 kg).";
  if (profile.isPregnant && (!profile.pregnancyMonths || profile.pregnancyMonths < 1 || profile.pregnancyMonths > 9))
    errors.pregnancyMonths = "Enter months between 1 and 9.";
  if (profile.numberOfKids > 0 && profile.lastPregnancyYear) {
    const yr = Number(profile.lastPregnancyYear);
    const now = new Date().getFullYear();
    if (yr < 1950 || yr > now) errors.lastPregnancyYear = `Enter a year between 1950 and ${now}.`;
  }
  return errors;
};

/* ─── FieldError helper ───────────────────────────────── */
const FieldError = ({ msg }) =>
  msg ? (
    <span className="pp-field-error">
      <i className="ti ti-alert-circle" /> {msg}
    </span>
  ) : null;

/* ─── Main Component ──────────────────────────────────── */
function PatientProfile() {
  useBackRedirect("/patient/profile");

  const token = localStorage.getItem("patientToken");

  const emptyProfile = {
    name: "", email: "", age: "", gender: "", height: "", weight: "",
    bloodGroup: "", contactNumber: "", birthDate: "",
    pastSurgeriesMedicalComplications: "", chronicDiseases: "",
    allergies: "", medications: "",
    isPregnant: false, pregnancyMonths: "", numberOfKids: "", lastPregnancyYear: ""
  };

  const [profile, setProfile]               = useState(emptyProfile);
  const [detectedCountryCode, setDetectedCountryCode] = useState("+91");
  const [errors, setErrors]                 = useState({});
  const [loading, setLoading]               = useState(true);
  const [fetchErr, setFetchErr]             = useState(null);
  const [saving, setSaving]                 = useState(false);

  /* ── inject styles ── */
  useEffect(() => {
    const sid = "pp-styles";
    if (!document.getElementById(sid)) {
      const tag = document.createElement("style");
      tag.id = sid; tag.textContent = STYLES;
      document.head.appendChild(tag);
    }
  }, []);

  useEffect(() => { fetchProfile(); }, []);

  const fetchProfile = async () => {
    setLoading(true);
    setFetchErr(null);
    try {
      if (!token) throw new Error("not_auth");
      const res = await axios.get(`${BASE_URL}/patient/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      /* ── Strip country code on load ── */
      const { code, number } = stripCountryCode(res.data.contactNumber || "");
      setDetectedCountryCode(code);

      setProfile({
        ...res.data,
        contactNumber: number,
        birthDate: res.data.birthDate ? res.data.birthDate.split("T")[0] : "",
        pastSurgeriesMedicalComplications: res.data.pastSurgeriesMedicalComplications?.join(", ") || "",
        chronicDiseases: res.data.chronicDiseases?.join(", ") || "",
        allergies: res.data.allergies?.join(", ") || "",
        medications: res.data.medications?.map(m => `${m.name}-${m.dosage}`).join(", ") || "",
        pregnancyMonths: res.data.pregnancyMonths || "",
        numberOfKids: res.data.numberOfKids || "",
        lastPregnancyYear: res.data.lastPregnancyYear || ""
      });
    } catch (err) {
      if (err.message === "not_auth")
        setFetchErr("You are not logged in. Please log in to view your profile.");
      else if (!err.response)
        setFetchErr("Network error — please check your connection and try again.");
      else if (err.response.status === 401)
        setFetchErr("Session expired. Please log in again.");
      else if (err.response.status === 404)
        setFetchErr("Profile not found. Please complete your registration.");
      else
        setFetchErr(err.response?.data?.message || "Failed to load profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: undefined }));
  };

  const saveProfile = async () => {
    const validationErrors = validate(profile, detectedCountryCode);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error("Please fix the highlighted errors before saving.");
      return;
    }
    setSaving(true);
    try {
      const dataToSend = {
        ...profile,
        /* ── Re-attach country code on save ── */
        contactNumber: profile.contactNumber
          ? `${detectedCountryCode}${profile.contactNumber}`
          : "",
        pastSurgeriesMedicalComplications:
          profile.pastSurgeriesMedicalComplications
            ? profile.pastSurgeriesMedicalComplications.split(",").map(s => s.trim()).filter(Boolean)
            : [],
        chronicDiseases:
          profile.chronicDiseases
            ? profile.chronicDiseases.split(",").map(s => s.trim()).filter(Boolean)
            : [],
        allergies:
          profile.allergies
            ? profile.allergies.split(",").map(s => s.trim()).filter(Boolean)
            : [],
        medications:
          profile.medications
            ? profile.medications.split(",").map(m => {
                const parts = m.split("-");
                return { name: parts[0]?.trim(), dosage: parts[1]?.trim() };
              }).filter(m => m.name)
            : [],
      };
      await axios.put(`${BASE_URL}/patient/profile`, dataToSend, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Profile updated successfully!");
      fetchProfile();
    } catch (err) {
      if (!err.response)
        toast.error("Network error — changes could not be saved. Please try again.");
      else if (err.response.status === 401)
        toast.error("Session expired. Please log in again.");
      else if (err.response.status === 400)
        toast.error(err.response?.data?.message || "Invalid data. Please check your inputs.");
      else
        toast.error(err.response?.data?.message || "Failed to save profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  /* ── Loading ── */
  if (loading) return (
    <div className="pp-root">
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3.19.0/dist/tabler-icons.min.css" />
      <div className="pp-wrap">
        <div className="pp-state-box">
          <div className="pp-spinner" />
          <p className="pp-state-h">Loading your profile…</p>
          <p className="pp-state-p">Just a moment</p>
        </div>
      </div>
    </div>
  );

  /* ── Fetch error ── */
  if (fetchErr) return (
    <div className="pp-root">
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3.19.0/dist/tabler-icons.min.css" />
      <div className="pp-wrap">
        <div className="pp-state-box">
          <div className="pp-state-icon danger"><i className="ti ti-alert-circle" /></div>
          <p className="pp-state-h">Couldn't load profile</p>
          <p className="pp-state-p">{fetchErr}</p>
          <button className="pp-retry-btn" onClick={fetchProfile}><i className="ti ti-refresh" /> Try again</button>
        </div>
      </div>
    </div>
  );

  const isFemale = profile.gender === "female";

  /* Label shown next to the phone input e.g. "+91 (India)" */
  const countryCodeLabels = {
    "+91": "+91 (India)",
    "+1":  "+1 (USA)",
    "+44": "+44 (UK)",
    "+61": "+61 (Australia)",
  };

  return (
    <div className="pp-root">
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3.19.0/dist/tabler-icons.min.css" />

      <div className="pp-wrap">

        {/* Page header */}
        <div className="pp-page-header">
          <div className="pp-page-header-text">
            <h1>My Profile</h1>
          </div>
        </div>

        {/* ── Basic Info ── */}
        <div className="pp-card">
          <div className="pp-card-header">
            <h2>Basic Information</h2>
          </div>
          <div className="pp-card-body">
            <div className="pp-grid-2">

              <div className="pp-field">
                <label className="pp-label">Full Name <span className="req">*</span></label>
                <input className={`pp-input${errors.name ? " error" : ""}`}
                  name="name" value={profile.name} onChange={handleChange} placeholder="Your full name" />
                <FieldError msg={errors.name} />
              </div>

              <div className="pp-field">
                <label className="pp-label">Email</label>
                <input className="pp-input" value={profile.email} disabled />
                <span className="pp-hint">Email cannot be changed</span>
              </div>

              <div className="pp-field">
                <label className="pp-label">Contact Number</label>
                <div className="pp-phone-row">
                  {/* Show the detected country code as a read-only badge */}
                  <span className="pp-phone-prefix">
                    {countryCodeLabels[detectedCountryCode] || detectedCountryCode}
                  </span>
                  <input
                    className={`pp-input${errors.contactNumber ? " error" : ""}`}
                    name="contactNumber"
                    value={profile.contactNumber || ""}
                    onChange={(e) => {
                      const digits = e.target.value.replace(/\D/g, "");
                      setProfile(prev => ({ ...prev, contactNumber: digits }));
                      if (errors.contactNumber) setErrors(prev => ({ ...prev, contactNumber: undefined }));
                    }}
                    placeholder={`${PHONE_LENGTHS[detectedCountryCode] || 10}-digit number`}
                    maxLength={PHONE_LENGTHS[detectedCountryCode] || 10}
                  />
                </div>
                <FieldError msg={errors.contactNumber} />
              </div>

              <div className="pp-field">
                <label className="pp-label">Date of Birth</label>
                <input className="pp-input" type="date" name="birthDate"
                  value={profile.birthDate || ""} onChange={handleChange}
                  max={new Date().toISOString().split("T")[0]} />
              </div>

              <div className="pp-field">
                <label className="pp-label">Age</label>
                <input className={`pp-input${errors.age ? " error" : ""}`}
                  type="number" name="age" value={profile.age || ""} onChange={handleChange}
                  placeholder="Years" min={1} max={120} />
                <FieldError msg={errors.age} />
              </div>

              <div className="pp-field">
                <label className="pp-label">Gender</label>
                <select className="pp-select" name="gender" value={profile.gender || ""} onChange={handleChange}>
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>

            </div>
          </div>
        </div>

        {/* ── Physical Stats ── */}
        <div className="pp-card">
          <div className="pp-card-header">
            <h2>Physical Stats</h2>
          </div>
          <div className="pp-card-body">
            <div className="pp-grid-2">

              <div className="pp-field">
                <label className="pp-label">Height</label>
                <input className={`pp-input${errors.height ? " error" : ""}`}
                  type="number" name="height" value={profile.height || ""} onChange={handleChange}
                  placeholder="cm" />
                <FieldError msg={errors.height} />
              </div>

              <div className="pp-field">
                <label className="pp-label">Weight</label>
                <input className={`pp-input${errors.weight ? " error" : ""}`}
                  type="number" name="weight" value={profile.weight || ""} onChange={handleChange}
                  placeholder="kg" />
                <FieldError msg={errors.weight} />
              </div>

              <div className="pp-field">
                <label className="pp-label">Blood Group</label>
                <select className="pp-select" name="bloodGroup" value={profile.bloodGroup || ""} onChange={handleChange}>
                  <option value="">Select blood group</option>
                  {["A+","A-","B+","B-","O+","O-","AB+","AB-"].map(g => <option key={g}>{g}</option>)}
                </select>
              </div>

            </div>
          </div>
        </div>

        {/* ── Pregnancy (female only) ── */}
        {isFemale && (
          <div className="pp-card">
            <div className="pp-card-header">
              <h2>Women's Health</h2>
            </div>
            <div className="pp-card-body">

              <label className="pp-checkbox-row">
                <input type="checkbox" checked={!!profile.isPregnant}
                  onChange={e => setProfile(prev => ({ ...prev, isPregnant: e.target.checked, pregnancyMonths: "" }))} />
                <span className="pp-checkbox-label">Currently pregnant</span>
              </label>

              {profile.isPregnant && (
                <div className="pp-pregnancy-box">
                  <p className="pp-pregnancy-title">Pregnancy details</p>
                  <div className="pp-field" style={{ maxWidth: 220 }}>
                    <label className="pp-label">Months along <span className="req">*</span></label>
                    <input className={`pp-input${errors.pregnancyMonths ? " error" : ""}`}
                      type="number" name="pregnancyMonths"
                      value={profile.pregnancyMonths || ""} onChange={handleChange}
                      placeholder="1 – 9" min={1} max={9} />
                    <FieldError msg={errors.pregnancyMonths} />
                  </div>
                </div>
              )}

              <div className="pp-grid-2" style={{ marginTop: 14 }}>
                <div className="pp-field">
                  <label className="pp-label">Number of Children</label>
                  <input className="pp-input" type="number" name="numberOfKids"
                    value={profile.numberOfKids || ""} onChange={handleChange}
                    placeholder="0" min={0} />
                </div>

                {profile.numberOfKids > 0 && (
                  <div className="pp-field">
                    <label className="pp-label">Last Pregnancy Year</label>
                    <input className={`pp-input${errors.lastPregnancyYear ? " error" : ""}`}
                      type="number" name="lastPregnancyYear"
                      value={profile.lastPregnancyYear || ""} onChange={handleChange}
                      placeholder={`e.g. ${new Date().getFullYear() - 2}`} />
                    <FieldError msg={errors.lastPregnancyYear} />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── Medical History ── */}
        <div className="pp-card">
          <div className="pp-card-header">
            <h2>Medical History</h2>
          </div>
          <div className="pp-card-body">
            <div className="pp-notice">
              <i className="ti ti-info-circle" />
              Enter multiple items separated by commas — e.g. "Diabetes, Hypertension"
            </div>
            <div className="pp-grid-1">

              <div className="pp-field">
                <label className="pp-label">Past Surgeries / Medical Complications</label>
                <textarea className="pp-textarea"
                  name="pastSurgeriesMedicalComplications"
                  value={profile.pastSurgeriesMedicalComplications || ""}
                  onChange={handleChange}
                  placeholder="e.g. Appendectomy 2019, Knee surgery 2021" />
              </div>

              <div className="pp-field">
                <label className="pp-label">Chronic Diseases</label>
                <textarea className="pp-textarea"
                  name="chronicDiseases"
                  value={profile.chronicDiseases || ""}
                  onChange={handleChange}
                  placeholder="e.g. Diabetes Type 2, Hypertension" />
              </div>

              <div className="pp-field">
                <label className="pp-label">Allergies</label>
                <textarea className="pp-textarea"
                  name="allergies"
                  value={profile.allergies || ""}
                  onChange={handleChange}
                  placeholder="e.g. Penicillin, Peanuts, Latex" />
              </div>

            </div>
          </div>
        </div>

        {/* ── Medications ── */}
        <div className="pp-card">
          <div className="pp-card-header">
            <h2>Current Medications</h2>
          </div>
          <div className="pp-card-body">
            <div className="pp-notice">
              <i className="ti ti-info-circle" />
              Format: <strong>MedicineName-Dosage</strong>, separated by commas — e.g. "Paracetamol-500mg, Metformin-1000mg"
            </div>
            <div className="pp-field">
              <label className="pp-label">Medications</label>
              <textarea className="pp-textarea" style={{ minHeight: 90 }}
                name="medications"
                value={profile.medications || ""}
                onChange={handleChange}
                placeholder="Paracetamol-500mg, Insulin-10units" />
            </div>
          </div>
        </div>

        {/* ── Save bar ── */}
        <div className="pp-save-bar">
          <button className="pp-save-btn" onClick={saveProfile} disabled={saving}>
            {saving
              ? <><div className="pp-spinner" style={{ width: 14, height: 14, margin: 0, borderWidth: 2 }} /> Saving…</>
              : <><i className="ti ti-device-floppy" /> Save Profile</>
            }
          </button>
        </div>

      </div>
    </div>
  );
}

export default PatientProfile;
