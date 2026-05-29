import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

const PLACEHOLDER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='76' height='76'%3E%3Crect width='76' height='76' fill='%23d9e5f3'/%3E%3Ccircle cx='38' cy='30' r='13' fill='%236a94bc'/%3E%3Cellipse cx='38' cy='65' rx='20' ry='15' fill='%236a94bc'/%3E%3C/svg%3E";

const BASE_URL = "https://medilink-j44r.onrender.com/api";
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Serif+Display&display=swap');
  *, *::before, *::after { box-sizing: border-box; }

  .dp-root {
    --accent:        #3b6b9e;
    --accent-light:  #4d7daf;
    --accent-bg:     #eef3f9;
    --accent-border: rgba(59,107,158,0.18);
    --accent-muted:  #6a94bc;
    --danger:        #a33030;
    --danger-bg:     #fdf1f1;
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
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    color: var(--text);
    background: var(--page-bg);
    min-height: 100vh;
    padding: 24px 16px 60px;
  }

  .dp-card {
    max-width: 980px;
    margin: 0 auto;
    background: var(--surface);
    border-radius: 14px;
    border: 1px solid var(--border);
    overflow: hidden;
    box-shadow: 0 2px 16px rgba(0,0,0,0.06);
  }

  /* ── Page header ── */
  .dp-page-header {
    padding: 14px 28px;
    border-bottom: 1px solid var(--border);
    display: flex;
    align-items: center;
    gap: 10px;
    background: var(--neutral-bg);
  }
  /* ✅ CHANGE 1: increased font size, removed icon+description */
  .dp-page-header-text h1 { font-size: 22px; font-weight: 700; margin: 0; color: var(--text); }

  /* ── Doctor hero ── */
  .dp-hero {
    padding: 0;
    border-bottom: 1px solid var(--border);
    background: linear-gradient(135deg, #f0f4f9 0%, #e8eef5 100%);
  }
  .dp-hero-top {
    display: flex;
    gap: 0;
    align-items: stretch;
  }
  .dp-hero-left {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 24px 20px;
    background: rgba(59,107,158,0.07);
    border-right: 1px solid var(--border);
    min-width: 150px;
    gap: 10px;
  }
  .dp-avatar-img {
    width: 90px; height: 90px;
    border-radius: 50%;
    object-fit: cover;
    border: 3px solid var(--surface);
    box-shadow: 0 2px 10px rgba(59,107,158,0.2);
  }
  .dp-availability-badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-size: 11.5px;
    font-weight: 600;
    color: var(--success);
    background: var(--success-bg);
    border: 1px solid rgba(26,102,64,0.15);
    padding: 3px 10px;
    border-radius: 20px;
  }
  .dp-availability-badge::before {
    content: '';
    width: 6px; height: 6px;
    background: #22c55e;
    border-radius: 50%;
    flex-shrink: 0;
  }
  .dp-hero-main {
    flex: 1;
    padding: 20px 24px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .dp-hero-name-row {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 8px;
  }
  /* ✅ CHANGE 2: increased doctor name font size */
  .dp-doctor-name {
    font-family: 'DM Serif Display', serif;
    font-size: 32px;
    font-weight: 400;
    margin: 0;
    color: var(--text);
    line-height: 1.2;
  }
  /* ✅ CHANGE 3: increased specialty font size */
  .dp-doctor-spec {
    font-size: 16px;
    color: var(--accent);
    font-weight: 600;
    margin: 2px 0 0;
    letter-spacing: .01em;
    text-transform: uppercase;
  }
  /* ✅ CHANGE 4: increased fee badge font size */
  .dp-fee-badge {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 8px 18px;
    background: var(--accent);
    color: #fff;
    border-radius: 8px;
    font-size: 18px;
    font-weight: 700;
    flex-shrink: 0;
  }
  .dp-fee-badge small {
    font-size: 12px;
    font-weight: 400;
    opacity: .8;
  }

  /* ── Info grid ── */
  .dp-info-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 6px 16px;
  }
  /* ✅ CHANGE 5: increased info item font size */
  .dp-info-item {
    display: flex;
    align-items: center;
    gap: 7px;
    font-size: 15px;
    color: var(--text-sec);
  }
  .dp-info-item i {
    font-size: 16px;
    color: var(--accent-muted);
    flex-shrink: 0;
    width: 18px;
  }
  .dp-info-item strong { color: var(--text); font-weight: 600; }

  /* ── About strip ── */
  .dp-about-strip {
    padding: 14px 24px;
    border-top: 1px solid var(--border);
    background: var(--surface);
    font-size: 13px;
    color: var(--muted);
    line-height: 1.7;
  }
  .dp-about-strip p { margin: 0; }

  /* ── Two-col lower body ── */
  .dp-two-col {
    display: grid;
    grid-template-columns: 1fr 300px;
    gap: 0;
    border-bottom: 1px solid var(--border);
  }

  /* ── Left: about + booking ── */
  .dp-booking-panel {
    padding: 20px 24px;
    background: var(--surface);
    border-right: 1px solid var(--border);
    display: flex;
    flex-direction: column;
    gap: 18px;
  }

  /* ── Section / sub labels ── */
  .dp-section-label {
    font-size: 10.5px;
    font-weight: 700;
    letter-spacing: .07em;
    text-transform: uppercase;
    color: var(--muted);
    margin: 0 0 10px;
  }
  .dp-sub-label {
    font-size: 11px;
    font-weight: 700;
    color: var(--muted);
    margin-bottom: 6px;
    text-transform: uppercase;
    letter-spacing: .04em;
  }

  /* ── About block inside booking panel ── */
  .dp-about-block {
    padding: 13px 16px;
    background: var(--neutral-bg);
    border: 1px solid var(--border);
    border-radius: 9px;
    font-size: 13px;
    color: var(--muted);
    line-height: 1.7;
  }
  .dp-about-block p { margin: 0; }

  /* ── Mode toggle ── */
  .dp-mode-toggle {
    display: inline-flex;
    border: 1.5px solid var(--accent);
    border-radius: 7px;
    overflow: hidden;
  }
  .dp-mode-btn {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 6px 14px;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    border: none;
    background: transparent;
    color: var(--accent);
    transition: background .15s, color .15s;
    line-height: 1;
  }
  .dp-mode-btn.active { background: var(--accent); color: #fff; }
  .dp-mode-btn i { font-size: 14px; }

  /* ── Custom date picker ── */
  .dp-date-picker-wrap {
    position: relative;
    max-width: 240px;
  }
  .dp-date-picker-wrap i {
    position: absolute;
    left: 10px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--accent-muted);
    font-size: 15px;
    pointer-events: none;
  }
  .dp-date-input {
    padding: 8px 11px 8px 34px;
    border: 1.5px solid var(--border-md);
    border-radius: 8px;
    font-size: 13px;
    font-family: 'DM Sans', sans-serif;
    color: var(--text);
    outline: none;
    transition: border-color .15s, box-shadow .15s;
    background: var(--surface);
    width: 100%;
    cursor: pointer;
    letter-spacing: .02em;
  }
  .dp-date-input:focus {
    border-color: var(--accent);
    box-shadow: 0 0 0 3px var(--accent-bg);
  }
  .dp-date-input::-webkit-calendar-picker-indicator {
    opacity: 0;
    position: absolute;
    right: 0;
    width: 100%;
    height: 100%;
    cursor: pointer;
  }
  .dp-date-display {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 8px;
  }
  .dp-date-chip {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 4px 11px;
    background: var(--accent-bg);
    border: 1px solid var(--accent-border);
    border-radius: 6px;
    font-size: 12.5px;
    font-weight: 600;
    color: var(--accent);
  }

  /* ── Slot picker ── */
  .dp-slot-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-top: 8px;
  }
  .dp-slot-btn {
    display: inline-flex; align-items: center; gap: 4px;
    padding: 5px 11px;
    border-radius: 6px;
    font-family: 'DM Sans', sans-serif;
    font-size: 12.5px;
    font-weight: 500;
    cursor: pointer;
    border: 1px solid var(--accent-border);
    background: var(--accent-bg);
    color: var(--accent);
    transition: background .15s, color .15s;
  }
  .dp-slot-btn.selected { background: var(--accent); color: #fff; border-color: var(--accent); }
  .dp-slot-btn:hover:not(.selected) { background: #d9e5f3; }

  /* ── No-slot notice ── */
  .dp-no-slot-notice {
    display: flex; align-items: center; gap: 8px;
    padding: 9px 12px;
    background: var(--warn-bg);
    border: 1px solid rgba(122,79,29,0.13);
    border-radius: 7px;
    color: var(--warn);
    font-size: 12.5px;
    margin-top: 8px;
  }
  .dp-no-slot-notice i { font-size: 14px; flex-shrink: 0; }

  /* ── Book button ── */
  .dp-book-btn {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 10px 22px;
    border: none;
    border-radius: 8px;
    background: var(--accent);
    color: #fff;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: opacity .15s, transform .1s;
    align-self: flex-start;
  }
  .dp-book-btn:hover  { opacity: .87; }
  .dp-book-btn:active { transform: scale(.97); }
  .dp-book-btn i { font-size: 15px; }

  /* ── Availability column (right) ── */
  .dp-avail-col {
    padding: 20px 18px;
    background: var(--neutral-bg);
    overflow-y: auto;
  }
  .dp-day-row {
    padding: 10px 12px;
    border-radius: 8px;
    background: var(--surface);
    border: 1px solid var(--border);
    margin-bottom: 8px;
  }
  .dp-day-head {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-bottom: 5px;
  }
  .dp-day-name {
    font-size: 12px;
    font-weight: 700;
    color: var(--text);
    text-transform: uppercase;
    letter-spacing: .04em;
  }
  .dp-day-date { font-size: 11px; color: var(--muted); }
  .dp-slot-tags { display: flex; flex-wrap: wrap; gap: 4px; }
  .dp-slot-tag {
    display: inline-block;
    background: var(--accent-bg);
    color: var(--accent);
    border: 1px solid var(--accent-border);
    padding: 2px 7px;
    border-radius: 5px;
    font-size: 11.5px;
    font-weight: 500;
  }
  .dp-no-slot { font-size: 11.5px; color: var(--border-md); font-style: italic; }

  /* ── Reviews ── */
  .dp-reviews { padding: 18px 24px 24px; }
  .dp-rating-summary {
    display: flex; gap: 20px; align-items: center;
    padding: 14px 16px;
    background: var(--neutral-bg);
    border: 1px solid var(--border);
    border-radius: 9px;
    margin-bottom: 14px;
    flex-wrap: wrap;
  }
  .dp-rating-big  { font-size: 34px; font-weight: 700; color: var(--text); line-height: 1; }
  .dp-rating-sub  { font-size: 11px; color: var(--muted); margin-top: 3px; }
  .dp-bar-row     { display: flex; align-items: center; gap: 7px; font-size: 12px; margin-bottom: 3px; }
  .dp-bar-label   { width: 22px; text-align: right; color: var(--muted); }
  .dp-bar-track   { flex: 1; height: 4px; background: var(--border); border-radius: 3px; overflow: hidden; }
  .dp-bar-fill    { height: 100%; background: #e09b20; border-radius: 3px; }
  .dp-bar-count   { width: 18px; color: var(--muted); }
  .dp-review-card {
    padding: 12px 14px;
    border: 1px solid var(--border);
    border-radius: 9px;
    margin-bottom: 8px;
    background: var(--surface);
  }
  .dp-review-top {
    display: flex; justify-content: space-between; align-items: flex-start;
    flex-wrap: wrap; gap: 5px; margin-bottom: 7px;
  }
  .dp-reviewer-avatar {
    width: 30px; height: 30px; border-radius: 50%;
    background: var(--accent-bg); color: var(--accent);
    display: flex; align-items: center; justify-content: center;
    font-weight: 700; font-size: 12px; flex-shrink: 0;
  }
  .dp-reviewer-name  { font-weight: 600; font-size: 13px; margin: 0 0 1px; }
  .dp-review-date    { font-size: 11.5px; color: var(--muted); }
  .dp-review-text    { font-size: 12.5px; color: var(--muted); line-height: 1.6; margin: 0; }
  .dp-stars          { color: #d4901a; font-size: 12px; letter-spacing: 1px; }
  .dp-stars-empty    { color: var(--border-md); }
  .dp-show-more-btn {
    display: inline-flex; align-items: center; gap: 5px;
    margin-top: 4px; padding: 6px 14px;
    border: 1px solid var(--accent-border);
    background: var(--accent-bg); color: var(--accent);
    border-radius: 6px;
    font-family: 'DM Sans', sans-serif; font-size: 12.5px; font-weight: 500;
    cursor: pointer; transition: background .15s;
  }
  .dp-show-more-btn:hover { background: #d9e5f3; }

  /* ── States ── */
  .dp-state-box {
    display: flex; flex-direction: column; align-items: center;
    padding: 40px 24px; text-align: center; color: var(--muted);
  }
  .dp-state-icon {
    width: 44px; height: 44px; border-radius: 50%;
    background: var(--accent-bg);
    display: flex; align-items: center; justify-content: center;
    color: var(--accent); font-size: 20px; margin-bottom: 12px;
  }
  .dp-state-icon.danger { background: var(--danger-bg); color: var(--danger); }
  .dp-state-h  { font-size: 15px; font-weight: 600; color: var(--text); margin: 0 0 4px; }
  .dp-state-p  { font-size: 12.5px; margin: 0 0 12px; }
  .dp-retry-btn {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 7px 15px;
    border: 1px solid var(--accent-border); border-radius: 6px;
    background: var(--accent-bg); color: var(--accent);
    font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500;
    cursor: pointer; transition: background .15s;
  }
  .dp-retry-btn:hover { background: #d9e5f3; }
  .dp-loading {
    display: flex; align-items: center; justify-content: center;
    min-height: 40vh; color: var(--muted); font-size: 13px; gap: 10px;
  }
  .dp-spinner {
    width: 16px; height: 16px;
    border: 2px solid var(--border); border-top-color: var(--accent);
    border-radius: 50%; animation: dp-spin .7s linear infinite;
  }
  @keyframes dp-spin { to { transform: rotate(360deg); } }
  .dp-divider { border: none; border-top: 1px solid var(--border); margin: 0; }

  @media (max-width: 720px) {
    .dp-two-col { grid-template-columns: 1fr; }
    .dp-avail-col { border-top: 1px solid var(--border); }
    .dp-info-grid { grid-template-columns: 1fr; }
    .dp-hero-top { flex-direction: column; }
    .dp-hero-left {
      flex-direction: row; padding: 16px;
      border-right: none; border-bottom: 1px solid var(--border);
      justify-content: flex-start;
    }
    .dp-booking-panel { border-right: none; }
  }
  @media (max-width: 600px) {
    .dp-hero-main, .dp-booking-panel, .dp-reviews { padding-left: 16px; padding-right: 16px; }
    .dp-page-header { padding-left: 16px; padding-right: 16px; }
    .dp-avail-col { padding: 14px 16px; }
  }
`;

const truncateRating = (r) => {
  if (!r && r !== 0) return null;
  const n = parseFloat(r);
  if (isNaN(n)) return null;
  const truncated = Math.trunc(n * 100) / 100;
  return truncated % 1 === 0 ? truncated.toFixed(1) : truncated.toString();
};

const Stars = ({ rating }) => {
  const filled = Math.round(rating);
  return (
    <span>
      <span className="dp-stars">{"★".repeat(filled)}</span>
      <span className="dp-stars dp-stars-empty">{"★".repeat(5 - filled)}</span>
    </span>
  );
};

const ReviewCard = ({ review }) => {
  const date = new Date(review.createdAt).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  });
  const initial = review.patientName ? review.patientName[0].toUpperCase() : "P";
  return (
    <div className="dp-review-card">
      <div className="dp-review-top">
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
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

const ReviewsSection = ({ doctorId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const [showAll, setShowAll] = useState(false);
  const PREVIEW = 3;

  const fetchReviews = async () => {
    setLoading(true); setError(null);
    try {
      const res = await axios.get(`${BASE_URL}/doctors/${doctorId}/reviews`);
      const sorted = (res.data || []).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setReviews(sorted);
    } catch (err) {
      setError(!err.response
        ? "Unable to load reviews — please check your connection."
        : err.response?.data?.message || "Reviews could not be loaded."
      );
    } finally { setLoading(false); }
  };

  useEffect(() => { if (doctorId) fetchReviews(); }, [doctorId]);

  const displayed = showAll ? reviews : reviews.slice(0, PREVIEW);
  const avg = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : null;

  const renderBar = (star) => {
    const count = reviews.filter(r => Math.round(r.rating) === star).length;
    const pct   = reviews.length ? (count / reviews.length) * 100 : 0;
    return (
      <div key={star} className="dp-bar-row">
        <span className="dp-bar-label">{star}★</span>
        <div className="dp-bar-track"><div className="dp-bar-fill" style={{ width: `${pct}%` }} /></div>
        <span className="dp-bar-count">{count}</span>
      </div>
    );
  };

  return (
    <div className="dp-reviews">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <p className="dp-section-label" style={{ margin: 0 }}>Patient reviews</p>
        {avg !== null && (
          <span style={{ background: "#fef7e0", color: "#8a6100", padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 700 }}>
            ⭐ {truncateRating(avg)} / 5
          </span>
        )}
      </div>
      {loading && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--muted)", fontSize: 13, padding: "12px 0" }}>
          <div className="dp-spinner" /> Loading reviews…
        </div>
      )}
      {!loading && error && (
        <div className="dp-state-box" style={{ padding: "20px 0" }}>
          <div className="dp-state-icon danger"><i className="ti ti-alert-triangle" /></div>
          <p className="dp-state-h">Couldn't load reviews</p>
          <p className="dp-state-p">{error}</p>
          <button className="dp-retry-btn" onClick={fetchReviews}><i className="ti ti-refresh" /> Try again</button>
        </div>
      )}
      {!loading && !error && reviews.length === 0 && (
        <div style={{ textAlign: "center", padding: "20px 16px", background: "var(--neutral-bg)", border: "1px dashed var(--border-md)", borderRadius: 9, color: "var(--muted)", fontSize: 13 }}>
          No reviews yet for this doctor.
        </div>
      )}
      {!loading && !error && reviews.length > 0 && (
        <>
          <div className="dp-rating-summary">
            <div style={{ textAlign: "center", minWidth: 64 }}>
              <div className="dp-rating-big">{truncateRating(avg)}</div>
              <Stars rating={avg} />
              <div className="dp-rating-sub">{reviews.length} review{reviews.length !== 1 ? "s" : ""}</div>
            </div>
            <div style={{ flex: 1, minWidth: 130 }}>{[5, 4, 3, 2, 1].map(renderBar)}</div>
          </div>
          {displayed.map((r, i) => <ReviewCard key={r._id || i} review={r} />)}
          {reviews.length > PREVIEW && (
            <button className="dp-show-more-btn" onClick={() => setShowAll(p => !p)}>
              <i className={`ti ${showAll ? "ti-chevron-up" : "ti-chevron-down"}`} />
              {showAll ? "Show less" : `See all ${reviews.length} reviews`}
            </button>
          )}
        </>
      )}
    </div>
  );
};

const DoctorProfile = () => {
  const { id } = useParams();

  const [doctor, setDoctor]             = useState(null);
  const [docLoading, setDocLoading]     = useState(true);
  const [docError, setDocError]         = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedMode, setSelectedMode] = useState("online");

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    const styleId = "dp-styles";
    if (!document.getElementById(styleId)) {
      const tag = document.createElement("style");
      tag.id = styleId; tag.textContent = STYLES;
      document.head.appendChild(tag);
    }
  }, []);

  const fetchDoctor = async () => {
    setDocLoading(true); setDocError(null);
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
    } finally { setDocLoading(false); }
  };

  useEffect(() => { fetchDoctor(); }, [id]);

  const normalizeDate = (d) => new Date(d).setHours(0, 0, 0, 0);

  const getNext7Days = () =>
    Array.from({ length: 7 }, (_, i) => {
      const d = new Date(); d.setDate(d.getDate() + i);
      return { date: d, dayName: d.toLocaleDateString("en-US", { weekday: "long" }), key: d.toISOString().split("T")[0] };
    });

  const getSlotsForDate = (dateObj) => {
    const selected    = normalizeDate(dateObj.date);
    const dayKey      = dateObj.dayName.toLowerCase();
    const weekly      = doctor?.availability?.weekly || {};
    const overrides   = doctor?.availability?.overrides || [];
    const weeklySlots = weekly[dayKey] || [];
    let overrideSlots = [];
    overrides
      .filter(o => o.from && o.to && selected >= normalizeDate(o.from) && selected <= normalizeDate(o.to))
      .forEach(o => { overrideSlots = [...overrideSlots, ...(o.slots || [])]; });
    const seen = new Set();
    return [...weeklySlots, ...overrideSlots]
      .filter(s => { const k = `${s.start}-${s.end}`; if (seen.has(k)) return false; seen.add(k); return true; })
      .filter(s => !s.mode || s.mode === selectedMode);
  };

  const bookAppointment = async () => {
    if (!selectedDate || !selectedTime) { toast.error("Please select a date and a time slot before booking."); return; }
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
      else
        toast.error(err.response?.data?.message || "Failed to book appointment. Please try again.");
    }
  };

  if (docLoading) return (
    <div className="dp-root">
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3.19.0/dist/tabler-icons.min.css" />
      <div className="dp-card"><div className="dp-loading"><div className="dp-spinner" /> Loading doctor profile…</div></div>
    </div>
  );

  if (docError) return (
    <div className="dp-root">
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3.19.0/dist/tabler-icons.min.css" />
      <div className="dp-card">
        <div className="dp-state-box">
          <div className="dp-state-icon danger"><i className="ti ti-alert-circle" /></div>
          <p className="dp-state-h">Something went wrong</p>
          <p className="dp-state-p">{docError}</p>
          <button className="dp-retry-btn" onClick={fetchDoctor}><i className="ti ti-refresh" /> Retry</button>
        </div>
      </div>
    </div>
  );

  const next7Days   = getNext7Days();
  const dateObj     = selectedDate ? { date: new Date(selectedDate + "T00:00:00"), dayName: new Date(selectedDate + "T00:00:00").toLocaleDateString("en-US", { weekday: "long" }) } : null;
  const dateSlots   = dateObj ? getSlotsForDate(dateObj) : [];
  const formattedDate = selectedDate ? new Date(selectedDate + "T00:00:00").toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" }) : null;
  const displayRating = truncateRating(doctor.rating);

  return (
    <div className="dp-root">
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3.19.0/dist/tabler-icons.min.css" />
      <div className="dp-card">

        {/* ✅ Page header — icon and description removed */}
        <div className="dp-page-header">
          <div className="dp-page-header-text">
            <h1>Doctor Profile</h1>
          </div>
        </div>

        {/* Hero */}
        <div className="dp-hero">
          <div className="dp-hero-top">
            <div className="dp-hero-left">
              <img src={doctor.photo || PLACEHOLDER} alt={doctor.name} className="dp-avatar-img" />
              <span className="dp-availability-badge">Available</span>
            </div>
            <div className="dp-hero-main">
              <div className="dp-hero-name-row">
                <div>
                  <p className="dp-doctor-name">{doctor.name}</p>
                  <p className="dp-doctor-spec">{doctor.specialty}</p>
                </div>
                <div className="dp-fee-badge">₹{doctor.consultationFee}<small>/visit</small></div>
              </div>
              <div className="dp-info-grid">
                {displayRating && (
                  <div className="dp-info-item">
                    <i className="ti ti-star-filled" />
                    <span><strong>{displayRating}</strong> / 5 rating</span>
                  </div>
                )}
                <div className="dp-info-item">
                  <i className="ti ti-gender-bigender" />
                  <span><strong>{doctor.gender}</strong></span>
                </div>
                {(doctor.address?.area || doctor.address?.city) && (
                  <div className="dp-info-item">
                    <i className="ti ti-map-pin" />
                    <span><strong>{doctor.address?.area}</strong>{doctor.address?.city ? `, ${doctor.address.city}` : ""}</span>
                  </div>
                )}
                {doctor.phone && (
                  <div className="dp-info-item">
                    <i className="ti ti-phone" />
                    <span>{doctor.phone}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Two-col: booking + availability */}
        <div className="dp-two-col">
          <div className="dp-booking-panel">
            {doctor.about && (
              <div>
                <p className="dp-section-label">About</p>
                <div className="dp-about-block"><p>{doctor.about}</p></div>
              </div>
            )}
            <div>
              <p className="dp-section-label">Book a Consultation</p>
              <div style={{ marginBottom: 16 }}>
                <p className="dp-sub-label">Consultation mode</p>
                <div className="dp-mode-toggle">
                  <button className={`dp-mode-btn${selectedMode === "online" ? " active" : ""}`} onClick={() => { setSelectedMode("online"); setSelectedTime(""); }}>
                    <i className="ti ti-wifi" /> Online
                  </button>
                  <button className={`dp-mode-btn${selectedMode === "offline" ? " active" : ""}`} onClick={() => { setSelectedMode("offline"); setSelectedTime(""); }}>
                    <i className="ti ti-building-hospital" /> In-clinic
                  </button>
                </div>
              </div>
              <div style={{ marginBottom: 16 }}>
                <p className="dp-sub-label">Select date</p>
                <div className="dp-date-picker-wrap">
                  <i className="ti ti-calendar-event" />
                  <input type="date" className="dp-date-input" min={today} value={selectedDate} onChange={(e) => { setSelectedDate(e.target.value); setSelectedTime(""); }} />
                </div>
                {formattedDate && (
                  <div className="dp-date-display">
                    <span className="dp-date-chip"><i className="ti ti-check" style={{ fontSize: 12 }} />{formattedDate}</span>
                  </div>
                )}
              </div>
              {selectedDate && (
                <div style={{ marginBottom: 4 }}>
                  <p className="dp-sub-label">Available time slots</p>
                  {dateSlots.length === 0 ? (
                    <div className="dp-no-slot-notice"><i className="ti ti-calendar-off" />No {selectedMode} slots on this date. Try another date or mode.</div>
                  ) : (
                    <div className="dp-slot-grid">
                      {dateSlots.map((s, i) => {
                        const val = `${s.start}-${s.end}`;
                        return (
                          <button key={i} className={`dp-slot-btn${selectedTime === val ? " selected" : ""}`} onClick={() => setSelectedTime(val)}>
                            <i className="ti ti-clock" />{s.start} – {s.end}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
              <button className="dp-book-btn" onClick={bookAppointment}>
                <i className="ti ti-calendar-plus" /> Book Appointment
              </button>
            </div>
          </div>

          <div className="dp-avail-col">
            <p className="dp-section-label">Availability — next 7 days</p>
            {next7Days.map((d, idx) => {
              const slots   = getSlotsForDate(d);
              const isToday = idx === 0;
              return (
                <div key={idx} className="dp-day-row" style={isToday ? { borderColor: "var(--accent-border)", background: "var(--accent-bg)" } : {}}>
                  <div className="dp-day-head">
                    <span className="dp-day-name" style={isToday ? { color: "var(--accent)" } : {}}>{isToday ? "Today" : d.dayName}</span>
                    <span className="dp-day-date">{d.date.toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>
                  </div>
                  <div className="dp-slot-tags">
                    {slots.length > 0
                      ? slots.map((s, i) => <span key={i} className="dp-slot-tag">{s.start}–{s.end}</span>)
                      : <span className="dp-no-slot">Not available</span>
                    }
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <hr className="dp-divider" />
        <ReviewsSection doctorId={doctor._id} />
      </div>
    </div>
  );
};

export default DoctorProfile;
