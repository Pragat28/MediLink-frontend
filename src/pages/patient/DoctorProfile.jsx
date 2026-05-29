import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

const BASE_URL = "https://medilink-j44r.onrender.com/api";

/* ─── Injected Styles ─────────────────────────────────── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; }

  .dp-root {
    --accent:      #1d4ed8;
    --accent-light:#1e40af;
    --accent-bg:   #eff6ff;
    --accent-border: rgba(29,78,216,0.18);
    --danger:      #b91c1c;
    --danger-bg:   #fef2f2;
    --warn:        #92400e;
    --warn-bg:     #fffbeb;
    --info:        #0369a1;
    --info-bg:     #f0f9ff;
    --success:     #166534;
    --success-bg:  #f0fdf4;
    --neutral-bg:  #f8f9fb;
    --border:      rgba(0,0,0,0.08);
    --border-md:   rgba(0,0,0,0.13);
    --text:        #111;
    --muted:       #6b7280;
    --surface:     #fff;
    --page-bg:     #f0f4fa;
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    color: var(--text);
    background: var(--page-bg);
    min-height: 100vh;
    padding: 32px 16px 80px;
  }

  .dp-card {
    max-width: 960px;
    margin: 0 auto;
    background: var(--surface);
    border-radius: 14px;
    border: 1px solid var(--border);
    overflow: hidden;
  }

  /* ── Page header ── */
  .dp-page-header {
    padding: 22px 32px;
    border-bottom: 1px solid var(--border);
    display: flex;
    align-items: center;
    gap: 12px;
    background: var(--surface);
  }
  .dp-page-header-icon {
    width: 36px; height: 36px;
    background: var(--accent-bg);
    border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    color: var(--accent);
    font-size: 18px;
    flex-shrink: 0;
  }
  .dp-page-header-text h1 { font-size: 17px; font-weight: 600; margin: 0 0 2px; color: var(--text); }
  .dp-page-header-text p  { font-size: 12.5px; color: var(--muted); margin: 0; }

  /* ── Doctor hero ── */
  .dp-hero {
    display: flex;
    gap: 20px;
    padding: 24px 32px;
    border-bottom: 1px solid var(--border);
    align-items: flex-start;
    flex-wrap: wrap;
  }
  .dp-avatar-wrap { position: relative; flex-shrink: 0; }
  .dp-avatar-img  {
    width: 100px; height: 100px;
    border-radius: 50%;
    object-fit: cover;
    border: 3px solid var(--accent-bg);
  }
  .dp-doctor-info { flex: 1; min-width: 200px; }
  .dp-doctor-name  { font-size: 20px; font-weight: 600; margin: 0 0 2px; color: var(--text); }
  .dp-doctor-spec  { font-size: 13.5px; color: var(--accent); font-weight: 500; margin: 0 0 10px; }
  .dp-pill-row     { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px; }
  .dp-pill {
    display: inline-flex; align-items: center; gap: 5px;
    font-size: 12.5px; padding: 4px 10px; border-radius: 20px;
    background: var(--neutral-bg);
    border: 1px solid var(--border);
    color: var(--muted);
  }
  .dp-pill strong { color: var(--text); font-weight: 500; }
  .dp-pill i { font-size: 13px; }
  .dp-pill-accent {
    background: var(--accent-bg);
    border-color: var(--accent-border);
    color: var(--accent);
  }
  .dp-pill-accent strong { color: var(--accent); }

  /* ── Section layout ── */
  .dp-body { padding: 0; }
  .dp-two-col {
    display: grid;
    grid-template-columns: 1fr 320px;
    gap: 0;
    border-bottom: 1px solid var(--border);
  }
  @media (max-width: 720px) {
    .dp-two-col { grid-template-columns: 1fr; }
    .dp-avail-col { border-left: none !important; border-top: 1px solid var(--border); }
  }

  /* ── About ── */
  .dp-about {
    padding: 20px 32px;
  }
  .dp-section-label {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: .06em;
    text-transform: uppercase;
    color: var(--muted);
    margin: 0 0 10px;
  }
  .dp-about-text {
    font-size: 13.5px;
    line-height: 1.7;
    color: var(--muted);
    margin: 0;
  }

  /* ── Availability column ── */
  .dp-avail-col {
    border-left: 1px solid var(--border);
    padding: 20px 22px;
    background: var(--neutral-bg);
  }
  .dp-day-row { margin-bottom: 14px; }
  .dp-day-name { font-size: 12.5px; font-weight: 600; color: var(--text); margin: 0 0 2px; }
  .dp-day-date { font-size: 11.5px; color: var(--muted); margin: 0 0 5px; }
  .dp-slot-tag {
    display: inline-block;
    background: var(--accent-bg);
    color: var(--accent);
    border: 1px solid var(--accent-border);
    padding: 3px 8px;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 500;
    margin-right: 5px;
    margin-bottom: 4px;
  }
  .dp-no-slot { font-size: 12px; color: var(--muted); font-style: italic; }

  /* ── Booking panel ── */
  .dp-booking-panel {
    padding: 20px 32px;
    border-bottom: 1px solid var(--border);
    background: var(--surface);
  }

  /* ── Mode toggle ── */
  .dp-mode-toggle {
    display: inline-flex;
    border: 1.5px solid var(--accent);
    border-radius: 8px;
    overflow: hidden;
    margin-top: 8px;
  }
  .dp-mode-btn {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 7px 16px;
    font-family: 'Inter', sans-serif;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    border: none;
    background: transparent;
    color: var(--accent);
    transition: background .15s, color .15s;
    line-height: 1;
  }
  .dp-mode-btn.active {
    background: var(--accent);
    color: #fff;
  }
  .dp-mode-btn i { font-size: 15px; }

  /* ── Slot picker ── */
  .dp-slot-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 7px;
    margin-top: 10px;
  }
  .dp-slot-btn {
    display: inline-flex; align-items: center; gap: 4px;
    padding: 6px 12px;
    border-radius: 7px;
    font-family: 'Inter', sans-serif;
    font-size: 12.5px;
    font-weight: 500;
    cursor: pointer;
    border: 1px solid var(--accent-border);
    background: var(--accent-bg);
    color: var(--accent);
    transition: background .15s, color .15s, border-color .15s;
  }
  .dp-slot-btn.selected {
    background: var(--accent);
    color: #fff;
    border-color: var(--accent);
  }
  .dp-slot-btn:hover:not(.selected) { background: #dbeafe; }

  /* ── Date input ── */
  .dp-date-row { display: flex; align-items: center; gap: 10px; margin-top: 0; flex-wrap: wrap; }
  .dp-date-label { font-size: 13px; font-weight: 600; color: var(--text); white-space: nowrap; }
  .dp-date-input {
    padding: 7px 12px;
    border: 1px solid var(--border-md);
    border-radius: 7px;
    font-size: 13px;
    font-family: 'Inter', sans-serif;
    color: var(--text);
    outline: none;
    transition: border-color .15s;
    background: var(--surface);
  }
  .dp-date-input:focus { border-color: var(--accent); box-shadow: 0 0 0 2px var(--accent-bg); }

  /* ── Book button ── */
  .dp-book-btn {
    display: inline-flex; align-items: center; gap: 6px;
    margin-top: 16px;
    padding: 10px 22px;
    border: none;
    border-radius: 8px;
    background: var(--accent);
    color: #fff;
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: opacity .15s, transform .1s;
  }
  .dp-book-btn:hover  { opacity: .87; }
  .dp-book-btn:active { transform: scale(.97); }
  .dp-book-btn i { font-size: 16px; }

  /* ── No-slot notice ── */
  .dp-no-slot-notice {
    display: flex; align-items: center; gap: 8px;
    padding: 10px 14px;
    background: var(--warn-bg);
    border: 1px solid rgba(146,64,14,0.15);
    border-radius: 8px;
    color: var(--warn);
    font-size: 13px;
    margin-top: 10px;
  }
  .dp-no-slot-notice i { font-size: 15px; flex-shrink: 0; }

  /* ── Reviews ── */
  .dp-reviews { padding: 20px 32px 28px; }
  .dp-rating-summary {
    display: flex; gap: 24px; align-items: center;
    padding: 16px 18px;
    background: var(--neutral-bg);
    border: 1px solid var(--border);
    border-radius: 10px;
    margin-bottom: 16px;
    flex-wrap: wrap;
  }
  .dp-rating-big  { font-size: 38px; font-weight: 700; color: var(--text); line-height: 1; }
  .dp-rating-sub  { font-size: 12px; color: var(--muted); margin-top: 4px; }
  .dp-bar-row     { display: flex; align-items: center; gap: 8px; font-size: 12.5px; margin-bottom: 4px; }
  .dp-bar-label   { width: 24px; text-align: right; color: var(--muted); }
  .dp-bar-track   { flex: 1; height: 5px; background: var(--border); border-radius: 3px; overflow: hidden; }
  .dp-bar-fill    { height: 100%; background: #f59e0b; border-radius: 3px; }
  .dp-bar-count   { width: 20px; color: var(--muted); }

  .dp-review-card {
    padding: 14px 16px;
    border: 1px solid var(--border);
    border-radius: 10px;
    margin-bottom: 10px;
    background: var(--surface);
  }
  .dp-review-top {
    display: flex; justify-content: space-between; align-items: flex-start;
    flex-wrap: wrap; gap: 6px; margin-bottom: 8px;
  }
  .dp-reviewer-avatar {
    width: 34px; height: 34px; border-radius: 50%;
    background: var(--accent-bg);
    color: var(--accent);
    display: flex; align-items: center; justify-content: center;
    font-weight: 600; font-size: 13px; flex-shrink: 0;
  }
  .dp-reviewer-name  { font-weight: 600; font-size: 13.5px; margin: 0 0 2px; }
  .dp-review-date    { font-size: 12px; color: var(--muted); }
  .dp-review-text    { font-size: 13px; color: var(--muted); line-height: 1.65; margin: 0; }
  .dp-stars          { color: #f59e0b; font-size: 13px; letter-spacing: 1px; }
  .dp-stars-empty    { color: var(--border-md); }

  .dp-show-more-btn {
    display: inline-flex; align-items: center; gap: 5px;
    margin-top: 6px;
    padding: 7px 16px;
    border: 1px solid var(--accent-border);
    background: var(--accent-bg);
    color: var(--accent);
    border-radius: 7px;
    font-family: 'Inter', sans-serif;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: background .15s;
  }
  .dp-show-more-btn:hover { background: #dbeafe; }

  /* ── Empty / error / loading states ── */
  .dp-state-box {
    display: flex; flex-direction: column; align-items: center;
    padding: 48px 24px;
    text-align: center;
    color: var(--muted);
  }
  .dp-state-icon {
    width: 48px; height: 48px;
    border-radius: 50%;
    background: var(--accent-bg);
    display: flex; align-items: center; justify-content: center;
    color: var(--accent);
    font-size: 22px;
    margin-bottom: 14px;
  }
  .dp-state-icon.danger { background: var(--danger-bg); color: var(--danger); }
  .dp-state-h  { font-size: 16px; font-weight: 600; color: var(--text); margin: 0 0 4px; }
  .dp-state-p  { font-size: 13px; margin: 0 0 14px; }

  .dp-retry-btn {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 7px 16px;
    border: 1px solid var(--accent-border);
    border-radius: 7px;
    background: var(--accent-bg);
    color: var(--accent);
    font-family: 'Inter', sans-serif;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: background .15s;
  }
  .dp-retry-btn:hover { background: #dbeafe; }

  .dp-loading {
    display: flex; align-items: center; justify-content: center;
    min-height: 40vh;
    color: var(--muted);
    font-size: 13px;
    gap: 10px;
  }
  .dp-spinner {
    width: 18px; height: 18px;
    border: 2px solid var(--border);
    border-top-color: var(--accent);
    border-radius: 50%;
    animation: dp-spin .7s linear infinite;
  }
  @keyframes dp-spin { to { transform: rotate(360deg); } }

  .dp-divider { border: none; border-top: 1px solid var(--border); margin: 0; }

  @media (max-width: 600px) {
    .dp-hero, .dp-about, .dp-booking-panel, .dp-reviews { padding-left: 16px; padding-right: 16px; }
    .dp-page-header { padding-left: 16px; padding-right: 16px; }
  }
`;

/* ─── Helpers ─────────────────────────────────────────── */
const Stars = ({ rating }) => {
  const filled = Math.round(rating);
  return (
    <span>
      <span className="dp-stars">{"★".repeat(filled)}</span>
      <span className="dp-stars dp-stars-empty">{"★".repeat(5 - filled)}</span>
    </span>
  );
};

/* ─── ReviewCard ──────────────────────────────────────── */
const ReviewCard = ({ review }) => {
  const date = new Date(review.createdAt).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  });
  const initial = review.patientName ? review.patientName[0].toUpperCase() : "P";

  return (
    <div className="dp-review-card">
      <div className="dp-review-top">
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div className="dp-reviewer-avatar">{initial}</div>
          <div>
            <p className="dp-reviewer-name">{review.patientName || "Patient"}</p>
            <Stars rating={review.rating} />
          </div>
        </div>
        <span className="dp-review-date">{date}</span>
      </div>
      {review.review && <p className="dp-review-text">{review.review}</p>}
    </div>
  );
};

/* ─── ReviewsSection ──────────────────────────────────── */
const ReviewsSection = ({ doctorId, avgRating }) => {
  const [reviews, setReviews]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const [showAll, setShowAll]   = useState(false);
  const PREVIEW = 3;

  const fetchReviews = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${BASE_URL}/doctors/${doctorId}/reviews`);
      const sorted = (res.data || []).sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setReviews(sorted);
    } catch (err) {
      if (!err.response)
        setError("Unable to load reviews — please check your connection.");
      else
        setError(err.response?.data?.message || "Reviews could not be loaded.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (doctorId) fetchReviews(); }, [doctorId]);

  const displayed = showAll ? reviews : reviews.slice(0, PREVIEW);
  const avg = reviews.length
    ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
    : null;

  const renderBar = (star) => {
    const count = reviews.filter(r => Math.round(r.rating) === star).length;
    const pct   = reviews.length ? (count / reviews.length) * 100 : 0;
    return (
      <div key={star} className="dp-bar-row">
        <span className="dp-bar-label">{star}★</span>
        <div className="dp-bar-track">
          <div className="dp-bar-fill" style={{ width: `${pct}%` }} />
        </div>
        <span className="dp-bar-count">{count}</span>
      </div>
    );
  };

  return (
    <div className="dp-reviews">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <p className="dp-section-label" style={{ margin: 0 }}>Patient reviews</p>
        {avg !== null && (
          <span style={{
            background: "#fef9c3", color: "#92400e",
            padding: "3px 10px", borderRadius: 20,
            fontSize: 12.5, fontWeight: 600,
          }}>
            ⭐ {avg.toFixed(1)} / 5
          </span>
        )}
      </div>

      {loading && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--muted)", fontSize: 13, padding: "16px 0" }}>
          <div className="dp-spinner" /> Loading reviews…
        </div>
      )}

      {!loading && error && (
        <div className="dp-state-box" style={{ padding: "24px 0" }}>
          <div className="dp-state-icon danger">
            <i className="ti ti-alert-triangle" aria-hidden="true" />
          </div>
          <p className="dp-state-h">Couldn't load reviews</p>
          <p className="dp-state-p">{error}</p>
          <button className="dp-retry-btn" onClick={fetchReviews}>
            <i className="ti ti-refresh" aria-hidden="true" /> Try again
          </button>
        </div>
      )}

      {!loading && !error && reviews.length === 0 && (
        <div style={{
          textAlign: "center", padding: "24px 16px",
          background: "var(--neutral-bg)",
          border: "1px dashed var(--border-md)",
          borderRadius: 10, color: "var(--muted)", fontSize: 13,
        }}>
          No reviews yet for this doctor.
        </div>
      )}

      {!loading && !error && reviews.length > 0 && (
        <>
          <div className="dp-rating-summary">
            <div style={{ textAlign: "center", minWidth: 70 }}>
              <div className="dp-rating-big">{avg.toFixed(1)}</div>
              <Stars rating={avg} />
              <div className="dp-rating-sub">{reviews.length} review{reviews.length !== 1 ? "s" : ""}</div>
            </div>
            <div style={{ flex: 1, minWidth: 140 }}>
              {[5, 4, 3, 2, 1].map(renderBar)}
            </div>
          </div>

          {displayed.map((r, i) => <ReviewCard key={r._id || i} review={r} />)}

          {reviews.length > PREVIEW && (
            <button className="dp-show-more-btn" onClick={() => setShowAll(p => !p)}>
              <i className={`ti ${showAll ? "ti-chevron-up" : "ti-chevron-down"}`} aria-hidden="true" />
              {showAll ? "Show less" : `See all ${reviews.length} reviews`}
            </button>
          )}
        </>
      )}
    </div>
  );
};

/* ─── Main DoctorProfile ──────────────────────────────── */
const DoctorProfile = () => {
  const { id } = useParams();

  const [doctor, setDoctor]         = useState(null);
  const [docLoading, setDocLoading] = useState(true);
  const [docError, setDocError]     = useState(null);

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedMode, setSelectedMode] = useState("online");

  const today = new Date().toISOString().split("T")[0];

  /* ── inject styles ── */
  useEffect(() => {
    const id = "dp-styles";
    if (!document.getElementById(id)) {
      const tag = document.createElement("style");
      tag.id = id; tag.textContent = STYLES;
      document.head.appendChild(tag);
    }
  }, []);

  const fetchDoctor = async () => {
    setDocLoading(true);
    setDocError(null);
    try {
      const res = await axios.get(`${BASE_URL}/doctors/${id}`);
      setDoctor(res.data);
    } catch (err) {
      if (!err.response)
        setDocError("Network error — please check your internet connection.");
      else if (err.response.status === 404)
        setDocError("Doctor profile not found. It may have been removed.");
      else
        setDocError(err.response?.data?.message || "Failed to load doctor profile.");
    } finally {
      setDocLoading(false);
    }
  };

  useEffect(() => { fetchDoctor(); }, [id]);

  /* ── availability helpers ── */
  const normalizeDate = (d) => new Date(d).setHours(0, 0, 0, 0);

  const getNext7Days = () => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() + i);
      return {
        date: d,
        dayName: d.toLocaleDateString("en-US", { weekday: "long" }),
        key: d.toISOString().split("T")[0],
      };
    });
  };

  const getSlotsForDate = (dateObj) => {
    const selected    = normalizeDate(dateObj.date);
    const dayKey      = dateObj.dayName.toLowerCase();
    const weekly      = doctor?.availability?.weekly || {};
    const overrides   = doctor?.availability?.overrides || [];
    const weeklySlots = weekly[dayKey] || [];

    let overrideSlots = [];
    overrides
      .filter(o => {
        if (!o.from || !o.to) return false;
        return selected >= normalizeDate(o.from) && selected <= normalizeDate(o.to);
      })
      .forEach(o => { overrideSlots = [...overrideSlots, ...(o.slots || [])]; });

    const seen = new Set();
    return [...weeklySlots, ...overrideSlots]
      .filter(s => {
        const k = `${s.start}-${s.end}`;
        if (seen.has(k)) return false;
        seen.add(k); return true;
      })
      .filter(s => !s.mode || s.mode === selectedMode);
  };

  /* ── booking ── */
  const bookAppointment = async () => {
    if (!selectedDate || !selectedTime) {
      toast.error("Please select a date and a time slot before booking.");
      return;
    }
    try {
      const token = localStorage.getItem("patientToken");
      if (!token) { toast.error("You are not logged in. Please log in to book."); return; }
      await axios.post(
        `${BASE_URL}/appointments/request`,
        { doctorId: doctor._id, date: selectedDate, slotTime: selectedTime, mode: selectedMode },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Appointment request sent successfully!");
      setSelectedDate(""); setSelectedTime("");
    } catch (err) {
      if (!err.response)
        toast.error("Network error — could not send request. Please try again.");
      else if (err.response.status === 401)
        toast.error("Session expired. Please log in again.");
      else if (err.response.status === 409)
        toast.error("You already have an appointment in this slot. Please choose another.");
      else
        toast.error(err.response?.data?.message || "Failed to book appointment. Please try again.");
    }
  };

  /* ── render: loading ── */
  if (docLoading) return (
    <div className="dp-root">
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3.19.0/dist/tabler-icons.min.css" />
      <div className="dp-card">
        <div className="dp-loading">
          <div className="dp-spinner" /> Loading doctor profile…
        </div>
      </div>
    </div>
  );

  /* ── render: error ── */
  if (docError) return (
    <div className="dp-root">
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3.19.0/dist/tabler-icons.min.css" />
      <div className="dp-card">
        <div className="dp-state-box">
          <div className="dp-state-icon danger">
            <i className="ti ti-alert-circle" aria-hidden="true" />
          </div>
          <p className="dp-state-h">Something went wrong</p>
          <p className="dp-state-p">{docError}</p>
          <button className="dp-retry-btn" onClick={fetchDoctor}>
            <i className="ti ti-refresh" aria-hidden="true" /> Retry
          </button>
        </div>
      </div>
    </div>
  );

  const next7Days   = getNext7Days();
  const dateObj     = selectedDate
    ? { date: new Date(selectedDate), dayName: new Date(selectedDate).toLocaleDateString("en-US", { weekday: "long" }) }
    : null;
  const dateSlots   = dateObj ? getSlotsForDate(dateObj) : [];

  return (
    <div className="dp-root">
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3.19.0/dist/tabler-icons.min.css" />

      <div className="dp-card">

        {/* Page header */}
        <div className="dp-page-header">
          <div className="dp-page-header-icon">
            <i className="ti ti-user-heart" aria-hidden="true" />
          </div>
          <div className="dp-page-header-text">
            <h1>Doctor Profile</h1>
            <p>View availability, book a consultation, and read patient reviews</p>
          </div>
        </div>

        {/* Hero */}
        <div className="dp-hero">
          <div className="dp-avatar-wrap">
            <img
              src={doctor.photo || "https://via.placeholder.com/100"}
              alt={doctor.name}
              className="dp-avatar-img"
            />
          </div>
          <div className="dp-doctor-info">
            <p className="dp-doctor-name">{doctor.name}</p>
            <p className="dp-doctor-spec">{doctor.specialty}</p>
            <div className="dp-pill-row">
              <span className="dp-pill dp-pill-accent">
                <i className="ti ti-star" aria-hidden="true" />
                <strong>{doctor.rating || 4}</strong> rating
              </span>
              <span className="dp-pill dp-pill-accent">
                <i className="ti ti-currency-rupee" aria-hidden="true" />
                <strong>₹{doctor.consultationFee}</strong> consult fee
              </span>
              <span className="dp-pill">
                <i className="ti ti-map-pin" aria-hidden="true" />
                <strong>{doctor.address?.area}, {doctor.address?.city}</strong>
              </span>
              <span className="dp-pill">
                <i className="ti ti-gender-bigender" aria-hidden="true" />
                <strong>{doctor.gender}</strong>
              </span>
            </div>
            {doctor.about && (
              <p className="dp-about-text" style={{ marginTop: 10, fontSize: 13 }}>{doctor.about}</p>
            )}
          </div>
        </div>

        {/* Two-col: booking left, availability right */}
        <div className="dp-two-col">

          {/* Booking panel */}
          <div className="dp-booking-panel">
            <p className="dp-section-label">Book a consultation</p>

            {/* Mode toggle */}
            <div style={{ marginBottom: 18 }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: "var(--muted)", marginBottom: 6, textTransform: "uppercase", letterSpacing: ".04em" }}>
                Consultation mode
              </p>
              <div className="dp-mode-toggle">
                <button
                  className={`dp-mode-btn${selectedMode === "online" ? " active" : ""}`}
                  onClick={() => { setSelectedMode("online"); setSelectedTime(""); }}
                >
                  <i className="ti ti-wifi" aria-hidden="true" /> Online
                </button>
                <button
                  className={`dp-mode-btn${selectedMode === "offline" ? " active" : ""}`}
                  onClick={() => { setSelectedMode("offline"); setSelectedTime(""); }}
                >
                  <i className="ti ti-building-hospital" aria-hidden="true" /> In-clinic
                </button>
              </div>
            </div>

            {/* Date */}
            <div style={{ marginBottom: 18 }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: "var(--muted)", marginBottom: 6, textTransform: "uppercase", letterSpacing: ".04em" }}>
                Select date
              </p>
              <div className="dp-date-row">
                <input
                  type="date"
                  className="dp-date-input"
                  min={today}
                  value={selectedDate}
                  onChange={(e) => { setSelectedDate(e.target.value); setSelectedTime(""); }}
                />
              </div>
            </div>

            {/* Slot picker */}
            {selectedDate && (
              <div style={{ marginBottom: 4 }}>
                <p style={{ fontSize: 12, fontWeight: 600, color: "var(--muted)", marginBottom: 6, textTransform: "uppercase", letterSpacing: ".04em" }}>
                  Select time slot
                </p>
                {dateSlots.length === 0 ? (
                  <div className="dp-no-slot-notice">
                    <i className="ti ti-calendar-off" aria-hidden="true" />
                    No {selectedMode} slots available on this date. Try another date or mode.
                  </div>
                ) : (
                  <div className="dp-slot-grid">
                    {dateSlots.map((s, i) => {
                      const val = `${s.start}-${s.end}`;
                      return (
                        <button
                          key={i}
                          className={`dp-slot-btn${selectedTime === val ? " selected" : ""}`}
                          onClick={() => setSelectedTime(val)}
                        >
                          <i className="ti ti-clock" aria-hidden="true" />
                          {s.start} – {s.end}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            <button className="dp-book-btn" onClick={bookAppointment}>
              <i className="ti ti-calendar-plus" aria-hidden="true" /> Book Appointment
            </button>
          </div>

          {/* Availability column */}
          <div className="dp-avail-col">
            <p className="dp-section-label">Availability this week</p>
            {next7Days.map((d, idx) => {
              const slots = getSlotsForDate(d);
              return (
                <div key={idx} className="dp-day-row">
                  <p className="dp-day-name">{d.dayName}</p>
                  <p className="dp-day-date">{d.date.toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</p>
                  {slots.length > 0
                    ? slots.map((s, i) => (
                        <span key={i} className="dp-slot-tag">{s.start}–{s.end}</span>
                      ))
                    : <span className="dp-no-slot">Not available</span>
                  }
                </div>
              );
            })}
          </div>
        </div>

        <hr className="dp-divider" />

        {/* Reviews */}
        <ReviewsSection doctorId={doctor._id} avgRating={doctor.rating} />

      </div>
    </div>
  );
};

export default DoctorProfile;
