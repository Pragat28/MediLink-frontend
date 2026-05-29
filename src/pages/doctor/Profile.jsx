import React, { useEffect, useState } from "react";
import axios from "axios";
import useBackRedirect from "../../hooks/useBackRedirect";
import { toast } from "react-toastify";

const daysOfWeek = [
  "monday","tuesday","wednesday","thursday","friday","saturday","sunday",
];

const dayLabels = {
  monday: "Mon", tuesday: "Tue", wednesday: "Wed",
  thursday: "Thu", friday: "Fri", saturday: "Sat", sunday: "Sun",
};

/* ─── Global styles injected once ─── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Serif+Display&display=swap');

  *, *::before, *::after { box-sizing: border-box; }

  .dp-root {
    --bg:        #f5f4f0;
    --surface:   #ffffff;
    --border:    #e2e0d8;
    --text:      #1a1a1a;
    --muted:     #787167;
    --accent:    #2d5a4e;
    --accent-lt: #e8f0ee;
    --danger:    #c0392b;
    --danger-lt: #fdf1f0;
    --radius:    10px;
    --shadow:    0 2px 16px rgba(0,0,0,0.07);
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    color: var(--text);
    background: var(--bg);
    min-height: 100vh;
    padding: 40px 20px 80px;
  }

  .dp-card {
    max-width: 980px;
    margin: 0 auto;
    background: var(--surface);
    border-radius: 16px;
    box-shadow: var(--shadow);
    overflow: hidden;
  }

  /* Header */
  .dp-header {
    background: var(--accent);
    padding: 32px 40px;
    display: flex;
    align-items: center;
    gap: 16px;
  }
  .dp-header-icon {
    width: 48px; height: 48px;
    background: rgba(255,255,255,0.15);
    border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    font-size: 22px;
  }
  .dp-header h1 {
    font-family: 'DM Serif Display', serif;
    font-size: 26px;
    font-weight: 400;
    color: #fff;
    margin: 0;
  }
  .dp-header p {
    color: rgba(255,255,255,0.65);
    margin: 2px 0 0;
    font-size: 13px;
  }

  /* Body */
  .dp-body { padding: 36px 40px; }

  /* Alert */
  .dp-alert {
    display: flex; align-items: flex-start; gap: 12px;
    background: #fef9ec;
    border: 1px solid #f0d070;
    border-left: 4px solid #e6b800;
    border-radius: var(--radius);
    padding: 14px 16px;
    margin-bottom: 28px;
    font-size: 13.5px;
    color: #7a5c00;
  }
  .dp-alert-close {
    margin-left: auto;
    background: none; border: none;
    cursor: pointer;
    color: #7a5c00;
    font-size: 16px;
    padding: 0;
    line-height: 1;
  }

  /* Section */
  .dp-section { margin-bottom: 36px; }
  .dp-section-title {
    font-family: 'DM Serif Display', serif;
    font-size: 18px;
    font-weight: 400;
    color: var(--accent);
    padding-bottom: 10px;
    border-bottom: 1.5px solid var(--border);
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  /* Field grid */
  .dp-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 16px; }
  .dp-field { display: flex; flex-direction: column; gap: 5px; }
  .dp-field label {
    font-size: 11.5px;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--muted);
  }
  .dp-field input,
  .dp-field select,
  .dp-field textarea {
    padding: 9px 12px;
    border: 1.5px solid var(--border);
    border-radius: var(--radius);
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    color: var(--text);
    background: #fff;
    transition: border-color .15s;
    outline: none;
  }
  .dp-field input:focus,
  .dp-field select:focus,
  .dp-field textarea:focus { border-color: var(--accent); }
  .dp-field input:disabled {
    background: #f8f7f4;
    color: var(--muted);
    cursor: default;
  }
  .dp-field textarea { resize: vertical; min-height: 110px; }

  /* Day availability */
  .dp-day-row {
    display: grid;
    grid-template-columns: 90px 1fr;
    gap: 0;
    align-items: start;
    padding: 14px 0;
    border-bottom: 1px solid var(--border);
  }
  .dp-day-row:last-child { border-bottom: none; }

  .dp-day-label {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding-top: 6px;
  }
  .dp-day-label .day-full {
    font-weight: 600;
    font-size: 13px;
    text-transform: capitalize;
    color: var(--text);
  }
  .dp-day-label .day-short {
    font-size: 11px;
    color: var(--muted);
    text-transform: uppercase;
    letter-spacing: .05em;
  }

  .dp-slots-col { display: flex; flex-direction: column; gap: 10px; }

  /* Single slot row — KEY FIX: all in one flex line */
  .dp-slot-row {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 10px;
    flex-wrap: nowrap;
  }
  .dp-slot-row .slot-field {
    display: flex;
    flex-direction: column;
    gap: 3px;
    flex-shrink: 0;
  }
  .dp-slot-row .slot-field label {
    font-size: 10.5px;
    font-weight: 600;
    letter-spacing: .06em;
    text-transform: uppercase;
    color: var(--muted);
    white-space: nowrap;
  }
  .dp-slot-row .slot-field input,
  .dp-slot-row .slot-field select {
    padding: 7px 10px;
    border: 1.5px solid var(--border);
    border-radius: 8px;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    color: var(--text);
    background: #fff;
    outline: none;
    transition: border-color .15s;
  }
  .dp-slot-row .slot-field input[type="time"] { width: 116px; }
  .dp-slot-row .slot-field input[type="number"] { width: 80px; }
  .dp-slot-row .slot-field select { width: 110px; }
  .dp-slot-row .slot-field input:focus,
  .dp-slot-row .slot-field select:focus { border-color: var(--accent); }

  /* Buttons */
  .dp-btn {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 8px 14px;
    border-radius: 8px;
    border: none;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: opacity .15s, transform .1s;
  }
  .dp-btn:hover { opacity: .85; }
  .dp-btn:active { transform: scale(.97); }
  .dp-btn:disabled { opacity: .5; cursor: default; }

  .dp-btn-primary   { background: var(--accent); color: #fff; }
  .dp-btn-ghost     { background: var(--accent-lt); color: var(--accent); }
  .dp-btn-danger    { background: var(--danger-lt); color: var(--danger); }
  .dp-btn-outline   {
    background: transparent;
    color: var(--accent);
    border: 1.5px solid var(--accent);
  }
  .dp-btn-sm { padding: 6px 10px; font-size: 12px; }
  .dp-btn-icon { padding: 6px 8px; }

  /* Override card */
  .dp-override-card {
    border: 1.5px solid var(--border);
    border-radius: var(--radius);
    padding: 18px 20px;
    margin-bottom: 14px;
    background: #fafaf8;
  }
  .dp-override-header {
    display: flex; align-items: center; gap: 12px; flex-wrap: wrap;
    margin-bottom: 14px;
  }
  .dp-override-header .date-field {
    display: flex; flex-direction: column; gap: 3px;
  }
  .dp-override-header .date-field label {
    font-size: 10.5px; font-weight: 600; letter-spacing: .06em;
    text-transform: uppercase; color: var(--muted);
  }
  .dp-override-header .date-field input {
    padding: 7px 10px;
    border: 1.5px solid var(--border);
    border-radius: 8px;
    font-size: 13px;
    font-family: 'DM Sans', sans-serif;
    outline: none;
    transition: border-color .15s;
  }
  .dp-override-header .date-field input:focus { border-color: var(--accent); }

  /* Save bar */
  .dp-save-bar {
    position: sticky; bottom: 0;
    background: rgba(255,255,255,0.9);
    backdrop-filter: blur(8px);
    border-top: 1px solid var(--border);
    padding: 16px 40px;
    display: flex; align-items: center; justify-content: flex-end;
    gap: 12px;
  }

  /* Responsive */
  @media (max-width: 640px) {
    .dp-body { padding: 20px; }
    .dp-header { padding: 22px 20px; }
    .dp-save-bar { padding: 14px 20px; }
    .dp-day-row { grid-template-columns: 70px 1fr; }
    .dp-slot-row { flex-wrap: wrap; }
  }
`;

/* ─── Tiny sub-components ─── */
const Field = ({ label, children }) => (
  <div className="dp-field">
    {label && <label>{label}</label>}
    {children}
  </div>
);

const SectionTitle = ({ icon, children }) => (
  <div className="dp-section-title">
    <span>{icon}</span> {children}
  </div>
);

const Profile = () => {
  useBackRedirect(null, true);
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  /* Inject CSS once */
  useEffect(() => {
    const id = "dp-styles";
    if (!document.getElementById(id)) {
      const tag = document.createElement("style");
      tag.id = id;
      tag.textContent = STYLES;
      document.head.appendChild(tag);
    }
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("doctorToken");
      if (!token) { setFetchError("You are not logged in. Please log in again."); return; }
      try {
        const res = await axios.get(
          "https://medilink-j44r.onrender.com/api/doctor-profile/me",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = res.data;
        setDoctor({
          ...data,
          gender: data.gender || "",
          about: data.about || "",
          address: data.address || { street: "", area: "" },
          availability: data.availability || { weekly: {}, overrides: [] }
        });
        const hasSlots = Object.values(data.availability?.weekly || {}).some(d => d && d.length > 0);
        if (!hasSlots) setShowPopup(true);
      } catch (err) {
        if (!err.response) setFetchError("Network error — please check your internet connection.");
        else if (err.response.status === 401) setFetchError("Session expired. Please log in again.");
        else setFetchError(err.response?.data?.error || "Failed to load profile. Please try again.");
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => setDoctor({ ...doctor, [e.target.name]: e.target.value });
  const handleAddressChange = (field, value) =>
    setDoctor({ ...doctor, address: { ...doctor.address, [field]: value } });

  /* Weekly slots */
  const handleSlotChange = (day, index, field, value) => {
    const updated = { ...doctor.availability.weekly };
    updated[day][index][field] = value;
    setDoctor({ ...doctor, availability: { ...doctor.availability, weekly: updated } });
  };
  const addSlot = (day) => {
    const updated = { ...doctor.availability.weekly };
    if (!updated[day]) updated[day] = [];
    updated[day].push({ start: "", end: "", maxPatients: 1, mode: "online" });
    setDoctor({ ...doctor, availability: { ...doctor.availability, weekly: updated } });
  };
  const removeSlot = (day, index) => {
    const updated = { ...doctor.availability.weekly };
    updated[day].splice(index, 1);
    setDoctor({ ...doctor, availability: { ...doctor.availability, weekly: updated } });
  };

  /* Overrides */
  const addSpecialAvailability = () => {
    const ranges = [...(doctor.availability.overrides || [])];
    ranges.push({ from: "", to: "", slots: [{ start: "", end: "", maxPatients: 1, mode: "online" }] });
    setDoctor({ ...doctor, availability: { ...doctor.availability, overrides: ranges } });
  };
  const handleRangeChange = (index, field, value) => {
    const ranges = [...doctor.availability.overrides];
    ranges[index][field] = value ? new Date(value).toISOString() : "";
    setDoctor({ ...doctor, availability: { ...doctor.availability, overrides: ranges } });
  };
  const handleRangeSlotChange = (rIndex, sIndex, field, value) => {
    const ranges = [...doctor.availability.overrides];
    ranges[rIndex].slots[sIndex][field] = value;
    setDoctor({ ...doctor, availability: { ...doctor.availability, overrides: ranges } });
  };
  const addRangeSlot = (rIndex) => {
    const ranges = [...doctor.availability.overrides];
    ranges[rIndex].slots.push({ start: "", end: "", maxPatients: 1, mode: "online" });
    setDoctor({ ...doctor, availability: { ...doctor.availability, overrides: ranges } });
  };
  const removeRange = (index) => {
    const ranges = [...doctor.availability.overrides];
    ranges.splice(index, 1);
    setDoctor({ ...doctor, availability: { ...doctor.availability, overrides: ranges } });
  };
  const removeRangeSlot = (rIndex, sIndex) => {
    const ranges = [...doctor.availability.overrides];
    ranges[rIndex].slots.splice(sIndex, 1);
    setDoctor({ ...doctor, availability: { ...doctor.availability, overrides: ranges } });
  };

  const handleSave = async () => {
    const token = localStorage.getItem("doctorToken");
    if (!token) { toast.error("You are not logged in. Please log in again."); return; }
    if (!doctor.name?.trim()) return toast.error("Name cannot be empty.");
    if (!doctor.phone?.trim()) return toast.error("Phone number cannot be empty.");

    for (const day of daysOfWeek) {
      const slots = doctor.availability.weekly?.[day] || [];
      for (let i = 0; i < slots.length; i++) {
        const s = slots[i];
        if (!s.start || !s.end) return toast.error(`Please fill in start and end time for all ${day} slots.`);
        if (s.start >= s.end) return toast.error(`${day} slot ${i + 1}: start time must be before end time.`);
      }
    }

    const overrides = doctor.availability.overrides || [];
    for (let i = 0; i < overrides.length; i++) {
      const r = overrides[i];
      if (!r.from || !r.to) return toast.error(`Special availability ${i + 1}: please set both from and to dates.`);
      if (new Date(r.from) > new Date(r.to)) return toast.error(`Special availability ${i + 1}: start date must be before end date.`);
      for (let j = 0; j < (r.slots || []).length; j++) {
        const s = r.slots[j];
        if (!s.start || !s.end) return toast.error(`Special availability ${i + 1}, slot ${j + 1}: please fill in times.`);
        if (s.start >= s.end) return toast.error(`Special availability ${i + 1}, slot ${j + 1}: start time must be before end time.`);
      }
    }

    setLoading(true);
    try {
      const cleanedDoctor = {
        ...doctor,
        availability: {
          ...doctor.availability,
          overrides: overrides.map(r => ({
            ...r,
            from: r.from || null,
            to: r.to || null,
            slots: (r.slots || []).filter(s => s.start && s.end)
          }))
        }
      };
      const res = await axios.put(
        "https://medilink-j44r.onrender.com/api/doctor-profile/me",
        cleanedDoctor,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setDoctor(res.data.doctor);
      toast.success("Profile updated successfully.");
    } catch (err) {
      if (!err.response) toast.error("Network error — changes could not be saved.");
      else if (err.response.status === 401) toast.error("Session expired. Please log in again.");
      else toast.error(err.response?.data?.error || err.response?.data?.message || "Failed to save profile.");
    } finally {
      setLoading(false);
    }
  };

  if (fetchError) return (
    <div className="dp-root">
      <div style={{ maxWidth: 980, margin: "0 auto", padding: "30px", color: "#c0392b", fontWeight: 500, display: "flex", gap: 8 }}>
        ⚠️ {fetchError}
      </div>
    </div>
  );

  if (!doctor) return (
    <div className="dp-root" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
      <div style={{ textAlign: "center", color: "#787167" }}>
        <div style={{ fontSize: 32, marginBottom: 12 }}>⏳</div>
        <p style={{ fontFamily: "'DM Sans', sans-serif" }}>Loading your profile…</p>
      </div>
    </div>
  );

  return (
    <div className="dp-root">
      <div className="dp-card">

        {/* Header */}
        <div className="dp-header">
          <div className="dp-header-icon">🩺</div>
          <div>
            <h1>Doctor Profile</h1>
            <p>Manage your information and availability</p>
          </div>
        </div>

        <div className="dp-body">

          {/* Alert */}
          {showPopup && (
            <div className="dp-alert">
              <span>⚠️</span>
              <div>
                <strong>Complete your availability</strong><br />
                Without time slots, patients cannot find or book your profile.
              </div>
              <button className="dp-alert-close" onClick={() => setShowPopup(false)}>✕</button>
            </div>
          )}

          {/* Basic Information */}
          <div className="dp-section">
            <SectionTitle>Basic Information</SectionTitle>
            <div className="dp-grid">
              <Field label="Full Name">
                <input name="name" value={doctor.name || ""} onChange={handleChange} placeholder="Dr. Jane Smith" />
              </Field>
              <Field label="Email Address">
                <input value={doctor.email || ""} disabled />
              </Field>
              <Field label="Phone Number">
                <input name="phone" value={doctor.phone || ""} onChange={handleChange} placeholder="+91 98765 43210" />
              </Field>
              <Field label="Specialty">
                <input name="specialty" value={doctor.specialty || ""} onChange={handleChange} placeholder="e.g. Cardiology" />
              </Field>
              <Field label="Gender">
                <select name="gender" value={doctor.gender} onChange={handleChange}>
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </Field>
            </div>
          </div>

          {/* About */}
          <div className="dp-section">
            <SectionTitle>About</SectionTitle>
            <Field label="Short bio visible to patients">
              <textarea
                name="about"
                value={doctor.about}
                onChange={handleChange}
                placeholder="Experienced cardiologist with 10+ years of practice..."
              />
            </Field>
          </div>

          {/* Clinic Address */}
          <div className="dp-section">
            <SectionTitle>Clinic Address</SectionTitle>
            <div className="dp-grid">
              <Field label="Street / Building">
                <input
                  placeholder="e.g. 12, Sunrise Building, MG Road"
                  value={doctor.address.street || ""}
                  onChange={(e) => handleAddressChange("street", e.target.value)}
                />
              </Field>
              <Field label="Area / Locality">
                <input
                  placeholder="e.g. Andheri West, Mumbai"
                  value={doctor.address.area || ""}
                  onChange={(e) => handleAddressChange("area", e.target.value)}
                />
              </Field>
            </div>
          </div>

          {/* Weekly Availability */}
          <div className="dp-section">
            <SectionTitle>Weekly Availability</SectionTitle>

            {daysOfWeek.map(day => (
              <div className="dp-day-row" key={day}>
                <div className="dp-day-label">
                  <span className="day-full">{day}</span>
                  <span className="day-short">{dayLabels[day]}</span>
                </div>

                <div className="dp-slots-col">
                  {(doctor.availability.weekly?.[day] || []).map((slot, index) => (
                    <div className="dp-slot-row" key={index}>

                      <div className="slot-field">
                        <label>Start</label>
                        <input
                          type="time"
                          value={slot.start}
                          onChange={(e) => handleSlotChange(day, index, "start", e.target.value)}
                        />
                      </div>

                      <div className="slot-field">
                        <label>End</label>
                        <input
                          type="time"
                          value={slot.end}
                          onChange={(e) => handleSlotChange(day, index, "end", e.target.value)}
                        />
                      </div>

                      <div className="slot-field">
                        <label>Max Pts</label>
                        <input
                          type="number"
                          min="1"
                          value={slot.maxPatients || 1}
                          onChange={(e) => handleSlotChange(day, index, "maxPatients", e.target.value)}
                        />
                      </div>

                      <div className="slot-field">
                        <label>Mode</label>
                        <select
                          value={slot.mode || "online"}
                          onChange={(e) => handleSlotChange(day, index, "mode", e.target.value)}
                        >
                          <option value="online">Online</option>
                          <option value="offline">Offline</option>
                        </select>
                      </div>

                      <button
                        className="dp-btn dp-btn-danger dp-btn-sm"
                        style={{ marginTop: 18, flexShrink: 0 }}
                        onClick={() => removeSlot(day, index)}
                        title="Remove slot"
                      >
                        ✕ Remove
                      </button>
                    </div>
                  ))}

                  <div>
                    <button className="dp-btn dp-btn-ghost dp-btn-sm" onClick={() => addSlot(day)}>
                      + Add Slot
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Special / Override Availability */}
          <div className="dp-section">
            <SectionTitle>Special Availability</SectionTitle>
            <p style={{ color: "#787167", marginTop: -8, marginBottom: 16, fontSize: 13 }}>
              Override your weekly schedule for specific date ranges (e.g. conferences, holidays).
            </p>

            {(doctor.availability.overrides || []).map((range, index) => (
              <div className="dp-override-card" key={index}>
                <div className="dp-override-header">
                  <div className="date-field">
                    <label>From Date</label>
                    <input
                      type="date"
                      value={range.from ? range.from.substring(0, 10) : ""}
                      onChange={(e) => handleRangeChange(index, "from", e.target.value)}
                    />
                  </div>
                  <div style={{ color: "#787167", paddingTop: 20 }}>→</div>
                  <div className="date-field">
                    <label>To Date</label>
                    <input
                      type="date"
                      value={range.to ? range.to.substring(0, 10) : ""}
                      onChange={(e) => handleRangeChange(index, "to", e.target.value)}
                    />
                  </div>
                  <button
                    className="dp-btn dp-btn-danger dp-btn-sm"
                    style={{ marginTop: 18 }}
                    onClick={() => removeRange(index)}
                  >
                    ✕ Remove Range
                  </button>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {(range.slots || []).map((slot, sIndex) => (
                    <div className="dp-slot-row" key={sIndex}>
                      <div className="slot-field">
                        <label>Start</label>
                        <input type="time" value={slot.start}
                          onChange={(e) => handleRangeSlotChange(index, sIndex, "start", e.target.value)} />
                      </div>
                      <div className="slot-field">
                        <label>End</label>
                        <input type="time" value={slot.end}
                          onChange={(e) => handleRangeSlotChange(index, sIndex, "end", e.target.value)} />
                      </div>
                      <div className="slot-field">
                        <label>Max Pts</label>
                        <input type="number" min="1" value={slot.maxPatients || 1}
                          onChange={(e) => handleRangeSlotChange(index, sIndex, "maxPatients", e.target.value)} />
                      </div>
                      <div className="slot-field">
                        <label>Mode</label>
                        <select value={slot.mode || "online"}
                          onChange={(e) => handleRangeSlotChange(index, sIndex, "mode", e.target.value)}>
                          <option value="online">Online</option>
                          <option value="offline">Offline</option>
                        </select>
                      </div>
                      <button
                        className="dp-btn dp-btn-danger dp-btn-sm"
                        style={{ marginTop: 18, flexShrink: 0 }}
                        onClick={() => removeRangeSlot(index, sIndex)}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>

                <button
                  className="dp-btn dp-btn-ghost dp-btn-sm"
                  style={{ marginTop: 12 }}
                  onClick={() => addRangeSlot(index)}
                >
                  + Add Slot
                </button>
              </div>
            ))}

            <button className="dp-btn dp-btn-outline" onClick={addSpecialAvailability}>
              + Add Special Availability
            </button>
          </div>

        </div>

        {/* Sticky save bar */}
        <div className="dp-save-bar">
          <span style={{ color: "#787167", fontSize: 13, marginRight: "auto" }}>
            All changes are saved to your profile immediately.
          </span>
          <button
            className="dp-btn dp-btn-primary"
            style={{ padding: "10px 28px", fontSize: 14 }}
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? "Saving…" : "💾 Save Changes"}
          </button>
        </div>

      </div>
    </div>
  );
};

export default Profile;
