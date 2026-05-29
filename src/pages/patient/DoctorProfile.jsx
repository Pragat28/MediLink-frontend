import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

const BASE_URL = "https://medilink-j44r.onrender.com/api";

/* ─── Styles ─────────────────────────────────────────── */
const container  = { padding: "40px", background: "#f8fafc", minHeight: "100vh" };
const card       = { background: "white", padding: "30px", borderRadius: "10px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)", maxWidth: "900px", margin: "auto" };
const header     = { display: "flex", gap: "30px", alignItems: "center" };
const imgStyle   = { width: "120px", height: "120px", borderRadius: "50%", objectFit: "cover" };
const nameStyle  = { fontSize: "24px", fontWeight: "600" };
const specialtyStyle = { color: "#555", marginTop: "5px" };
const infoRow    = { marginTop: "10px", fontSize: "15px" };
const aboutBox   = { marginTop: "25px", padding: "15px", background: "#f1f5f9", borderRadius: "8px" };
const dayRow     = { marginBottom: "12px" };
const slot       = { display: "inline-block", background: "#e0f2fe", padding: "6px 10px", borderRadius: "6px", marginRight: "8px", marginBottom: "5px", fontSize: "14px" };
const buttonStyle = { marginTop: "25px", padding: "10px 16px", border: "none", borderRadius: "6px", background: "#2563eb", color: "white", cursor: "pointer", fontSize: "15px" };

/* ─── Star renderer ───────────────────────────────────── */
const Stars = ({ rating }) => {
  const filled = Math.round(rating);
  return (
    <span style={{ color: "#f59e0b", fontSize: "16px", letterSpacing: "2px" }}>
      {"★".repeat(filled)}
      <span style={{ color: "#d1d5db" }}>{"★".repeat(5 - filled)}</span>
    </span>
  );
};

/* ─── Single review card ──────────────────────────────── */
const ReviewCard = ({ review }) => {
  const date = new Date(review.createdAt).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric"
  });

  return (
    <div style={{
      background: "#f8fafc",
      border: "1px solid #e2e8f0",
      borderRadius: "10px",
      padding: "16px 20px",
      marginBottom: "12px",
      transition: "box-shadow 0.2s",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "6px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {/* Avatar placeholder */}
          <div style={{
            width: "36px", height: "36px", borderRadius: "50%",
            background: "#dbeafe", color: "#2563eb",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: "700", fontSize: "15px", flexShrink: 0
          }}>
            {review.patientName ? review.patientName[0].toUpperCase() : "P"}
          </div>
          <div>
            <div style={{ fontWeight: "600", fontSize: "14px" }}>
              {review.patientName || "Patient"}
            </div>
            <Stars rating={review.rating} />
          </div>
        </div>
        <div style={{ fontSize: "12px", color: "#94a3b8", marginTop: "4px" }}>{date}</div>
      </div>

      {review.review && (
        <p style={{ marginTop: "10px", color: "#374151", fontSize: "14px", lineHeight: "1.6", marginBottom: 0 }}>
          {review.review}
        </p>
      )}
    </div>
  );
};

/* ─── Reviews section ─────────────────────────────────── */
const ReviewsSection = ({ doctorId, avgRating }) => {
  const [reviews, setReviews]     = useState([]);
  const [loading, setLoading]     = useState(true);
  const [showAll, setShowAll]     = useState(false);
  const PREVIEW_COUNT             = 3;

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/doctors/${doctorId}/reviews`);
        // Sort by newest first
        const sorted = (res.data || []).sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setReviews(sorted);
      } catch (err) {
        console.error("Failed to load reviews", err);
        // Silently fail — reviews section just shows "no reviews"
      } finally {
        setLoading(false);
      }
    };

    if (doctorId) fetchReviews();
  }, [doctorId]);

  const displayed = showAll ? reviews : reviews.slice(0, PREVIEW_COUNT);

  /* ── Summary bar ─────────────────────────── */
  const renderRatingBar = (star) => {
    const count = reviews.filter(r => Math.round(r.rating) === star).length;
    const pct   = reviews.length ? (count / reviews.length) * 100 : 0;
    return (
      <div key={star} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px" }}>
        <span style={{ width: "28px", textAlign: "right", color: "#64748b" }}>{star}★</span>
        <div style={{ flex: 1, height: "6px", background: "#e2e8f0", borderRadius: "4px", overflow: "hidden" }}>
          <div style={{ width: `${pct}%`, height: "100%", background: "#f59e0b", borderRadius: "4px", transition: "width 0.5s" }} />
        </div>
        <span style={{ width: "24px", color: "#94a3b8" }}>{count}</span>
      </div>
    );
  };

  return (
    <div style={{ marginTop: "35px" }}>
      {/* Section heading */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
        <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "700" }}>Patient Reviews</h3>
        {reviews.length > 0 && (
          <span style={{
            background: "#fef9c3", color: "#92400e",
            padding: "3px 10px", borderRadius: "20px",
            fontSize: "13px", fontWeight: "600"
          }}>
            ⭐ {avgRating || (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)} / 5
          </span>
        )}
      </div>

      {/* Rating breakdown — only when there are reviews */}
      {reviews.length > 0 && (
        <div style={{
          display: "flex", gap: "30px", alignItems: "center",
          background: "#f8fafc", border: "1px solid #e2e8f0",
          borderRadius: "10px", padding: "16px 20px", marginBottom: "20px",
          flexWrap: "wrap"
        }}>
          {/* Big average */}
          <div style={{ textAlign: "center", minWidth: "70px" }}>
            <div style={{ fontSize: "40px", fontWeight: "700", lineHeight: 1, color: "#1e293b" }}>
              {(reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)}
            </div>
            <Stars rating={reviews.reduce((s, r) => s + r.rating, 0) / reviews.length} />
            <div style={{ fontSize: "12px", color: "#94a3b8", marginTop: "4px" }}>
              {reviews.length} review{reviews.length !== 1 ? "s" : ""}
            </div>
          </div>
          {/* Bars */}
          <div style={{ flex: 1, minWidth: "160px", display: "flex", flexDirection: "column", gap: "5px" }}>
            {[5, 4, 3, 2, 1].map(renderRatingBar)}
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <p style={{ color: "#94a3b8", fontSize: "14px" }}>Loading reviews…</p>
      )}

      {/* Empty state */}
      {!loading && reviews.length === 0 && (
        <div style={{
          textAlign: "center", padding: "30px 20px",
          background: "#f8fafc", border: "1px dashed #cbd5e1",
          borderRadius: "10px", color: "#94a3b8", fontSize: "14px"
        }}>
          No reviews yet for this doctor.
        </div>
      )}

      {/* Review cards */}
      {!loading && displayed.map((r, i) => (
        <ReviewCard key={r._id || i} review={r} />
      ))}

      {/* Show more / less toggle */}
      {!loading && reviews.length > PREVIEW_COUNT && (
        <button
          onClick={() => setShowAll(prev => !prev)}
          style={{
            marginTop: "8px",
            background: "none",
            border: "1px solid #2563eb",
            color: "#2563eb",
            borderRadius: "6px",
            padding: "8px 18px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "500",
            transition: "background 0.15s"
          }}
          onMouseEnter={e => { e.target.style.background = "#eff6ff"; }}
          onMouseLeave={e => { e.target.style.background = "none"; }}
        >
          {showAll
            ? "Show less"
            : `See all ${reviews.length} reviews`}
        </button>
      )}
    </div>
  );
};

/* ─── Main component ──────────────────────────────────── */
const DoctorProfile = () => {
  const { id } = useParams();

  const [doctor, setDoctor]           = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedMode, setSelectedMode] = useState("online");

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/doctors/${id}`);
        setDoctor(res.data);
      } catch (err) {
        toast.error("Failed to fetch doctor profile");
        console.log(err);
      }
    };
    fetchDoctor();
  }, [id]);

  const normalizeDate = (d) => new Date(d).setHours(0, 0, 0, 0);

  const weekly    = doctor?.availability?.weekly    || {};
  const overrides = doctor?.availability?.overrides || [];

  const getNext7Days = () => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      days.push({
        date: d,
        dayName: d.toLocaleDateString("en-US", { weekday: "long" }),
        key: d.toISOString().split("T")[0]
      });
    }
    return days;
  };

  const next7Days = getNext7Days();

  const getSlotsForDate = (dateObj) => {
    const selected  = normalizeDate(dateObj.date);
    const dayKey    = dateObj.dayName.toLowerCase();
    const weeklySlots = weekly[dayKey] || [];

    const matchedOverrides = overrides.filter(o => {
      if (!o.from || !o.to) return false;
      const start = normalizeDate(o.from);
      const end   = normalizeDate(o.to);
      return selected >= start && selected <= end;
    });

    let overrideSlots = [];
    matchedOverrides.forEach(o => { overrideSlots = [...overrideSlots, ...(o.slots || [])]; });

    const allSlots   = [...weeklySlots, ...overrideSlots];
    const uniqueSlots = [];
    const seen = new Set();
    allSlots.forEach(s => {
      const key = `${s.start}-${s.end}`;
      if (!seen.has(key)) { seen.add(key); uniqueSlots.push(s); }
    });

    return uniqueSlots.filter(s => !s.mode || s.mode === selectedMode);
  };

  const bookAppointment = async () => {
    if (!selectedDate || !selectedTime) {
      toast.error("Please select date and time");
      return;
    }
    try {
      const token = localStorage.getItem("patientToken");
      await axios.post(
        `${BASE_URL}/appointments/request`,
        { doctorId: doctor._id, date: selectedDate, slotTime: selectedTime, mode: selectedMode },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Appointment request sent!");
    } catch (err) {
      console.log(err);
      toast.error(err.response?.data?.message || "Error booking appointment");
    }
  };

  if (!doctor) {
    return <p style={{ padding: "40px" }}>Loading doctor profile…</p>;
  }

  return (
    <div style={container}>
      <div style={card}>

        {/* ── Top: info + availability ─────────────── */}
        <div style={{
          display: "flex", justifyContent: "space-between",
          alignItems: "flex-start", marginBottom: "30px"
        }}>
          {/* Left: doctor info */}
          <div style={header}>
            <img
              src={doctor.photo || "https://via.placeholder.com/120"}
              alt="doctor"
              style={imgStyle}
            />
            <div>
              <div style={nameStyle}>{doctor.name}</div>
              <div style={specialtyStyle}>{doctor.specialty}</div>
              <div style={infoRow}>⭐ {doctor.rating || 4}</div>
              <div style={infoRow}>💰 ₹ {doctor.consultationFee}</div>
              <div style={infoRow}>
                📍 {doctor.address?.street}, {doctor.address?.area}, {doctor.address?.city}
              </div>
              <div style={infoRow}>👤 Gender: {doctor.gender}</div>
            </div>
          </div>

          {/* Right: mode + availability */}
          <div style={{ width: "320px" }}>
            <div style={{ marginBottom: "15px" }}>
              <label style={{ fontWeight: "600", marginRight: "10px" }}>Consultation Mode:</label>
              <select
                value={selectedMode}
                onChange={(e) => { setSelectedMode(e.target.value); setSelectedTime(""); }}
                style={{ padding: "6px 10px", borderRadius: "6px", border: "1px solid #ddd", cursor: "pointer" }}
              >
                <option value="online">Online</option>
                <option value="offline">Offline</option>
              </select>
            </div>

            <h3>Availability This Week</h3>

            {next7Days.map((d, idx) => {
              const slots = getSlotsForDate(d);
              return (
                <div key={idx} style={dayRow}>
                  <strong>{d.dayName}</strong>
                  <div style={{ fontSize: "12px", color: "#666" }}>{d.date.toLocaleDateString()}</div>
                  <div style={{ marginTop: "5px" }}>
                    {slots.length > 0 ? (
                      slots.map((s, i) => (
                        <span key={i} style={slot}>{s.start} - {s.end}</span>
                      ))
                    ) : (
                      <span style={{ fontSize: "13px", color: "#999" }}>Not available</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── About ───────────────────────────────── */}
        {doctor.about && (
          <div style={aboutBox}>
            <h3>About Doctor</h3>
            <p>{doctor.about}</p>
          </div>
        )}

        {/* ── Date picker ─────────────────────────── */}
        <div style={{ marginTop: "20px" }}>
          <label>Select Date:</label>
          <input
            type="date"
            min={today}
            value={selectedDate}
            onChange={(e) => { setSelectedDate(e.target.value); setSelectedTime(""); }}
            style={{ marginLeft: "10px" }}
          />
        </div>

        {/* ── Slot picker ─────────────────────────── */}
        {selectedDate && (
          <div style={{ marginTop: "25px" }}>
            <h3>Select Slot ({selectedMode})</h3>
            {getSlotsForDate({
              date: new Date(selectedDate),
              dayName: new Date(selectedDate).toLocaleDateString("en-US", { weekday: "long" })
            }).length === 0 ? (
              <p style={{ color: "#999" }}>No {selectedMode} slots available on this date.</p>
            ) : (
              getSlotsForDate({
                date: new Date(selectedDate),
                dayName: new Date(selectedDate).toLocaleDateString("en-US", { weekday: "long" })
              }).map((s, i) => {
                const slotValue = `${s.start}-${s.end}`;
                return (
                  <span
                    key={i}
                    style={{
                      ...slot,
                      cursor: "pointer",
                      background: selectedTime === slotValue ? "#2563eb" : "#e0f2fe",
                      color: selectedTime === slotValue ? "white" : "black"
                    }}
                    onClick={() => setSelectedTime(slotValue)}
                  >
                    {s.start} - {s.end}
                  </span>
                );
              })
            )}
          </div>
        )}

        <button style={buttonStyle} onClick={bookAppointment}>
          Book Appointment
        </button>

        {/* ── Divider ─────────────────────────────── */}
        <hr style={{ margin: "35px 0 0", border: "none", borderTop: "1px solid #e2e8f0" }} />

        {/* ── Reviews ─────────────────────────────── */}
        <ReviewsSection doctorId={doctor._id} avgRating={doctor.rating} />

      </div>
    </div>
  );
};

export default DoctorProfile;
