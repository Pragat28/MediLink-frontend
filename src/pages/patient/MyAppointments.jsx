import { useEffect, useState, useRef } from "react";
import axios from "axios";
import useBackRedirect from "../../hooks/useBackRedirect";
import { toast } from "react-toastify";

/* ─── Injected Styles ─────────────────────────────────── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; }

  .ma-root {
    --accent:        #1d4ed8;
    --accent-bg:     #eff6ff;
    --accent-border: rgba(29,78,216,0.18);
    --danger:        #b91c1c;
    --danger-bg:     #fef2f2;
    --warn:          #92400e;
    --warn-bg:       #fffbeb;
    --success:       #166534;
    --success-bg:    #f0fdf4;
    --neutral-bg:    #f8f9fb;
    --border:        rgba(0,0,0,0.08);
    --border-md:     rgba(0,0,0,0.13);
    --text:          #111;
    --muted:         #6b7280;
    --surface:       #fff;
    --page-bg:       #f0f4fa;
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    color: var(--text);
    background: var(--page-bg);
    min-height: 100vh;
    padding: 32px 16px 80px;
  }

  .ma-card {
    max-width: 860px;
    margin: 0 auto;
    background: var(--surface);
    border-radius: 14px;
    border: 1px solid var(--border);
    overflow: hidden;
  }

  /* ── Page header ── */
  .ma-header {
    padding: 22px 32px;
    border-bottom: 1px solid var(--border);
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .ma-header-icon {
    width: 36px; height: 36px;
    background: var(--accent-bg);
    border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    color: var(--accent);
    font-size: 18px;
    flex-shrink: 0;
  }
  .ma-header-text h1 { font-size: 17px; font-weight: 600; margin: 0 0 2px; color: var(--text); }
  .ma-header-text p  { font-size: 12.5px; color: var(--muted); margin: 0; }

  /* ── Tabs ── */
  .ma-tab-bar {
    display: flex;
    gap: 0;
    padding: 0 32px;
    border-bottom: 1px solid var(--border);
    overflow-x: auto;
    background: var(--surface);
  }
  .ma-tab {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 14px 16px;
    border: none;
    border-bottom: 2.5px solid transparent;
    background: transparent;
    font-family: 'Inter', sans-serif;
    font-size: 13px;
    font-weight: 500;
    color: var(--muted);
    cursor: pointer;
    white-space: nowrap;
    transition: color .15s, border-color .15s;
    position: relative;
  }
  .ma-tab:hover { color: var(--accent); }
  .ma-tab.active {
    color: var(--accent);
    border-bottom-color: var(--accent);
    font-weight: 600;
  }
  .ma-tab-badge {
    display: inline-flex; align-items: center; justify-content: center;
    min-width: 18px; height: 18px;
    background: var(--accent-bg);
    color: var(--accent);
    border-radius: 20px;
    font-size: 11px;
    font-weight: 600;
    padding: 0 5px;
  }
  .ma-tab.active .ma-tab-badge {
    background: var(--accent);
    color: #fff;
  }
  .ma-tab-badge.dot {
    background: #dc2626;
    color: #fff;
    min-width: 18px;
  }

  /* ── Body ── */
  .ma-body { padding: 20px 32px 28px; }

  /* ── Empty state ── */
  .ma-empty {
    text-align: center;
    padding: 48px 20px;
    color: var(--muted);
  }
  .ma-empty-icon {
    width: 46px; height: 46px;
    background: var(--accent-bg);
    border-radius: 50%;
    margin: 0 auto 12px;
    display: flex; align-items: center; justify-content: center;
    color: var(--accent);
    font-size: 20px;
  }
  .ma-empty h3 { font-size: 15px; font-weight: 600; color: var(--text); margin: 0 0 4px; }
  .ma-empty p  { font-size: 13px; margin: 0; }

  /* ── Appointment card ── */
  .ma-appt-card {
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 16px 18px;
    margin-bottom: 12px;
    background: var(--surface);
  }
  .ma-appt-top {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 10px;
  }
  .ma-doctor-name { font-size: 15px; font-weight: 600; margin: 0 0 6px; color: var(--text); }
  .ma-meta-row {
    display: flex; flex-wrap: wrap; gap: 6px;
  }
  .ma-meta-item {
    display: inline-flex; align-items: center; gap: 4px;
    font-size: 12.5px; color: var(--muted);
    background: var(--neutral-bg);
    border: 1px solid var(--border);
    padding: 3px 8px;
    border-radius: 6px;
  }
  .ma-meta-item strong { color: var(--text); font-weight: 500; }
  .ma-meta-item i { font-size: 13px; }

  .ma-mode-badge {
    display: inline-flex; align-items: center; gap: 4px;
    padding: 3px 8px; border-radius: 6px;
    font-size: 12px; font-weight: 500;
    background: var(--accent-bg);
    color: var(--accent);
  }

  /* ── Status banners ── */
  .ma-banner {
    display: flex; align-items: flex-start; gap: 9px;
    padding: 10px 13px;
    border-radius: 8px;
    margin-top: 10px;
    font-size: 13px;
  }
  .ma-banner i { font-size: 15px; margin-top: 1px; flex-shrink: 0; }
  .ma-banner-title { font-weight: 600; margin: 0 0 2px; }
  .ma-banner-sub   { margin: 0; font-size: 12.5px; }

  .ma-banner-info    { background: var(--accent-bg); border: 1px solid var(--accent-border); color: var(--accent); }
  .ma-banner-warn    { background: var(--warn-bg);   border: 1px solid rgba(146,64,14,0.15); color: var(--warn); }
  .ma-banner-danger  { background: var(--danger-bg); border: 1px solid rgba(185,28,28,0.15); color: var(--danger); }
  .ma-banner-success { background: var(--success-bg); border: 1px solid rgba(22,101,52,0.15); color: var(--success); }
  .ma-banner-neutral { background: var(--neutral-bg); border: 1px solid var(--border-md);    color: var(--muted); }

  /* ── Doctor contact row ── */
  .ma-contact-row {
    display: flex; flex-wrap: wrap; gap: 6px;
    margin-top: 10px;
  }
  .ma-contact-pill {
    display: inline-flex; align-items: center; gap: 5px;
    font-size: 12.5px; color: var(--muted);
    background: var(--neutral-bg);
    border: 1px solid var(--border);
    padding: 4px 10px; border-radius: 20px;
  }
  .ma-contact-pill i { font-size: 13px; }

  /* ── Rating ── */
  .ma-rating-box {
    margin-top: 10px;
    padding: 12px 14px;
    background: var(--neutral-bg);
    border: 1px solid var(--border);
    border-radius: 8px;
  }
  .ma-rating-label {
    font-size: 12px; font-weight: 600; letter-spacing: .04em;
    text-transform: uppercase; color: var(--muted); margin: 0 0 8px;
  }
  .ma-stars { color: #f59e0b; font-size: 14px; }
  .ma-stars-empty { color: var(--border-md); font-size: 14px; }
  .ma-review-italic { font-size: 13px; color: var(--muted); font-style: italic; margin: 4px 0 0; }

  .ma-rate-form { margin-top: 10px; }
  .ma-rate-select {
    width: 100%;
    padding: 7px 10px;
    border: 1px solid var(--border-md);
    border-radius: 7px;
    font-family: 'Inter', sans-serif;
    font-size: 13px;
    color: var(--text);
    background: var(--surface);
    outline: none;
    margin-bottom: 8px;
    transition: border-color .15s;
  }
  .ma-rate-select:focus { border-color: var(--accent); box-shadow: 0 0 0 2px var(--accent-bg); }
  .ma-rate-textarea {
    display: block;
    width: 100%;
    min-height: 64px;
    padding: 8px 10px;
    border: 1px solid var(--border-md);
    border-radius: 7px;
    font-family: 'Inter', sans-serif;
    font-size: 13px;
    color: var(--text);
    background: var(--surface);
    outline: none;
    resize: vertical;
    transition: border-color .15s;
    margin-bottom: 10px;
  }
  .ma-rate-textarea:focus { border-color: var(--accent); box-shadow: 0 0 0 2px var(--accent-bg); }
  .ma-rate-btn {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 8px 18px;
    border: none; border-radius: 7px;
    background: var(--accent); color: #fff;
    font-family: 'Inter', sans-serif;
    font-size: 13px; font-weight: 600;
    cursor: pointer;
    transition: opacity .15s, transform .1s;
  }
  .ma-rate-btn:hover  { opacity: .87; }
  .ma-rate-btn:active { transform: scale(.97); }
  .ma-rate-btn i { font-size: 15px; }

  @media (max-width: 600px) {
    .ma-header, .ma-body { padding-left: 16px; padding-right: 16px; }
    .ma-tab-bar { padding: 0 16px; }
  }
`;

/* ─── Helpers ─────────────────────────────────────────── */
const Stars = ({ rating }) => {
  const filled = Math.round(rating);
  return (
    <span>
      <span className="ma-stars">{"★".repeat(filled)}</span>
      <span className="ma-stars-empty">{"★".repeat(5 - filled)}</span>
      <span style={{ fontSize: 12.5, color: "var(--muted)", marginLeft: 5 }}>{rating}/5</span>
    </span>
  );
};

const modeIcon  = (mode) => mode === "online" ? "ti-wifi" : "ti-building-hospital";
const modeLabel = (mode) => mode === "online" ? "Online"  : "In-clinic";

const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

/* ─── Main component ──────────────────────────────────── */
function MyAppointments() {
  useBackRedirect("/patient/profile");
  const token = localStorage.getItem("patientToken");

  const [accepted, setAccepted] = useState([]);
  const [pending,  setPending]  = useState([]);
  const [rejected, setRejected] = useState([]);
  const [history,  setHistory]  = useState([]);
  const [rating,   setRating]   = useState({});
  const [review,   setReview]   = useState({});
  const [activeTab, setActiveTab] = useState("accepted");

  const isFirstFetch = useRef(true);

  /* ── inject styles ── */
  useEffect(() => {
    const sid = "ma-styles";
    if (!document.getElementById(sid)) {
      const tag = document.createElement("style");
      tag.id = sid; tag.textContent = STYLES;
      document.head.appendChild(tag);
    }
  }, []);

  useEffect(() => {
    fetchAppointments();
    const interval = setInterval(fetchAppointments, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const unseen = JSON.parse(localStorage.getItem("apptNotifications") || "[]");
    unseen.forEach(n => showPersistentToast(n));
  }, []);

  const showPersistentToast = (n) => {
    const fn = n.type === "success" ? toast.success : n.type === "warning" ? toast.warning : toast.error;
    fn(
      <div>
        <p style={{ margin: 0, fontWeight: "600" }}>{n.message}</p>
        <button
          onClick={() => acknowledgeNotification(n.id)}
          style={{ marginTop: 8, padding: "4px 10px", background: "white", border: "1px solid #ccc", borderRadius: 4, cursor: "pointer", fontSize: 12 }}
        >
          Got it ✓
        </button>
      </div>,
      { toastId: n.id, autoClose: false, closeOnClick: false, draggable: false, closeButton: false }
    );
  };

  const acknowledgeNotification = (id) => {
    toast.dismiss(id);
    const updated = JSON.parse(localStorage.getItem("apptNotifications") || "[]").filter(n => n.id !== id);
    localStorage.setItem("apptNotifications", JSON.stringify(updated));
  };

  const addNotification = (id, message, type) => {
    const existing = JSON.parse(localStorage.getItem("apptNotifications") || "[]");
    if (existing.find(n => n.id === id)) return;
    const newNotif = { id, message, type };
    localStorage.setItem("apptNotifications", JSON.stringify([...existing, newNotif]));
    showPersistentToast(newNotif);
  };

  const fetchAppointments = async () => {
    if (!token) return;
    try {
      const res = await axios.get(
        "https://medilink-j44r.onrender.com/api/appointments/my",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const appointments = res.data.appointments;
      const savedMap = JSON.parse(localStorage.getItem("apptStatusMap") || "{}");

      if (!isFirstFetch.current) {
        appointments.forEach(app => {
          const prev = savedMap[app._id];
          const curr = app.status;
          if (prev && prev !== curr) {
            const date    = formatDate(app.date);
            const notifId = `${app._id}-${curr}`;
            if (curr === "accepted")
              addNotification(notifId, `✅ Dr. ${app.doctor?.name} confirmed your appointment on ${date}.`, "success");
            else if (curr === "rejected")
              addNotification(notifId, `❌ Dr. ${app.doctor?.name} rejected your request for ${date}.`, "error");
            else if (curr === "cancelled" && prev === "accepted")
              addNotification(notifId, `⚠️ Dr. ${app.doctor?.name} cancelled your confirmed appointment on ${date}.`, "warning");
            else if (curr === "cancelled" && prev === "pending")
              addNotification(notifId, `⚠️ Dr. ${app.doctor?.name} cancelled your appointment request for ${date}.`, "warning");
            else if (curr === "completed")
              addNotification(notifId, `🌟 Appointment with Dr. ${app.doctor?.name} on ${date} is complete! Please rate your experience.`, "success");
          }
        });
      }

      isFirstFetch.current = false;
      const newMap = {};
      appointments.forEach(app => { newMap[app._id] = app.status; });
      localStorage.setItem("apptStatusMap", JSON.stringify(newMap));

      const a = [], p = [], r = [], h = [];
      appointments.forEach(app => {
        if (app.status === "accepted")  a.push(app);
        else if (app.status === "pending")  p.push(app);
        else if (app.status === "rejected") r.push(app);
        else h.push(app);
      });
      setAccepted(a); setPending(p); setRejected(r); setHistory(h);

    } catch (err) {
      if (!err.response) toast.error("Network error — could not load appointments.");
      else if (err.response.status === 401) toast.error("Session expired. Please log in again.");
      else toast.error(err.response?.data?.message || "Failed to load appointments.");
    }
  };

  const submitRating = async (appointmentId) => {
    if (!rating[appointmentId]) { toast.error("Please select a rating before submitting."); return; }
    try {
      await axios.post(
        `https://medilink-j44r.onrender.com/api/appointments/${appointmentId}/rate`,
        { rating: Number(rating[appointmentId]), review: review[appointmentId] || "" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Rating submitted successfully!");
      fetchAppointments();
    } catch (err) {
      if (!err.response) toast.error("Network error — could not submit rating.");
      else toast.error(err.response?.data?.message || "Failed to submit rating.");
    }
  };

  const unratedCount = history.filter(a => a.status === "completed" && !a.rated).length;

  /* ── Render list ── */
  const renderList = (list, type) => {
    if (list.length === 0) {
      const msgs = {
        accepted: ["No confirmed appointments", "Accepted appointments will appear here once a doctor confirms your request."],
        pending:  ["No pending requests",       "Your sent appointment requests will appear here while awaiting doctor approval."],
        rejected: ["No rejected appointments",  ""],
        history:  ["No appointment history",    "Completed and cancelled appointments will appear here."],
      };
      return (
        <div className="ma-empty">
          <div className="ma-empty-icon">
            <i className={`ti ${type === "accepted" ? "ti-calendar-check" : type === "pending" ? "ti-clock" : type === "rejected" ? "ti-calendar-x" : "ti-history"}`} aria-hidden="true" />
          </div>
          <h3>{msgs[type][0]}</h3>
          {msgs[type][1] && <p>{msgs[type][1]}</p>}
        </div>
      );
    }

    return list.map(app => (
      <div className="ma-appt-card" key={app._id}>

        {/* Top row */}
        <div className="ma-appt-top">
          <div>
            <p className="ma-doctor-name">Dr. {app.doctor?.name}</p>
            <div className="ma-meta-row">
              <span className="ma-meta-item">
                <i className="ti ti-calendar" aria-hidden="true" />
                <strong>{formatDate(app.date)}</strong>
              </span>
              <span className="ma-meta-item">
                <i className="ti ti-clock" aria-hidden="true" />
                <strong>{app.slotTime}</strong>
              </span>
              {app.mode && (
                <span className="ma-mode-badge">
                  <i className={`ti ${modeIcon(app.mode)}`} aria-hidden="true" />
                  {modeLabel(app.mode)}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ── ACCEPTED ── */}
        {type === "accepted" && (
          <>
            <div className="ma-contact-row">
              {app.doctor?.email && (
                <span className="ma-contact-pill">
                  <i className="ti ti-mail" aria-hidden="true" /> {app.doctor.email}
                </span>
              )}
              {app.doctor?.phone && (
                <span className="ma-contact-pill">
                  <i className="ti ti-phone" aria-hidden="true" /> {app.doctor.phone}
                </span>
              )}
              {(app.doctor?.address?.street || app.doctor?.address?.area || app.doctor?.address?.city) && (
                <span className="ma-contact-pill">
                  <i className="ti ti-map-pin" aria-hidden="true" />
                  {[app.doctor?.address?.street, app.doctor?.address?.area, app.doctor?.address?.city].filter(Boolean).join(", ")}
                </span>
              )}
            </div>
            <div className="ma-banner ma-banner-info" style={{ marginTop: 12 }}>
              <i className="ti ti-mail-forward" aria-hidden="true" />
              <div>
                <p className="ma-banner-title">Meeting link info</p>
                <p className="ma-banner-sub">Your doctor will send the meeting link to your registered email before the appointment time.</p>
              </div>
            </div>
          </>
        )}

        {/* ── PENDING ── */}
        {type === "pending" && (
          <div className="ma-banner ma-banner-warn">
            <i className="ti ti-clock-hour-4" aria-hidden="true" />
            <div>
              <p className="ma-banner-title">Awaiting doctor's approval</p>
              <p className="ma-banner-sub">Your request has been sent. The doctor will respond to it shortly.</p>
            </div>
          </div>
        )}

        {/* ── REJECTED ── */}
        {type === "rejected" && (
          <div className="ma-banner ma-banner-neutral">
            <i className="ti ti-ban" aria-hidden="true" />
            <div>
              <p className="ma-banner-title">Appointment rejected</p>
              <p className="ma-banner-sub">The doctor was unable to accept this request. You can book a different slot or consult another doctor.</p>
            </div>
          </div>
        )}

        {/* ── HISTORY ── */}
        {type === "history" && (
          <>
            {app.status === "completed" && (
              <div className="ma-banner ma-banner-success">
                <i className="ti ti-circle-check" aria-hidden="true" />
                <div>
                  <p className="ma-banner-title">Appointment completed</p>
                </div>
              </div>
            )}
            {app.status === "cancelled" && (
              <div className="ma-banner ma-banner-neutral">
                <i className="ti ti-ban" aria-hidden="true" />
                <div>
                  <p className="ma-banner-title">Appointment cancelled</p>
                  <p className="ma-banner-sub">This appointment was cancelled. You may book a new one.</p>
                </div>
              </div>
            )}

            {app.rated && (
              <div className="ma-rating-box" style={{ marginTop: 10 }}>
                <p className="ma-rating-label">Your rating</p>
                <Stars rating={app.rating} />
                {app.review && <p className="ma-review-italic">"{app.review}"</p>}
              </div>
            )}

            {app.status === "completed" && !app.rated && (
              <>
                <div className="ma-banner ma-banner-danger" style={{ marginTop: 10 }}>
                  <i className="ti ti-star" aria-hidden="true" />
                  <div>
                    <p className="ma-banner-title">Rate your experience with Dr. {app.doctor?.name}</p>
                    <p className="ma-banner-sub">Your feedback helps other patients find the right doctor.</p>
                  </div>
                </div>
                <div className="ma-rate-form">
                  <select
                    className="ma-rate-select"
                    value={rating[app._id] || ""}
                    onChange={(e) => setRating(prev => ({ ...prev, [app._id]: e.target.value }))}
                  >
                    <option value="">Select a rating…</option>
                    <option value="1">1 ★ — Poor</option>
                    <option value="2">2 ★ — Fair</option>
                    <option value="3">3 ★ — Good</option>
                    <option value="4">4 ★ — Very good</option>
                    <option value="5">5 ★ — Excellent</option>
                  </select>
                  <textarea
                    className="ma-rate-textarea"
                    placeholder="Write a review (optional)…"
                    value={review[app._id] || ""}
                    onChange={(e) => setReview(prev => ({ ...prev, [app._id]: e.target.value }))}
                  />
                  <button className="ma-rate-btn" onClick={() => submitRating(app._id)}>
                    <i className="ti ti-send" aria-hidden="true" /> Submit rating
                  </button>
                </div>
              </>
            )}
          </>
        )}

      </div>
    ));
  };

  const tabs = [
    { key: "accepted", label: "Accepted", count: accepted.length, icon: "ti-calendar-check" },
    { key: "pending",  label: "Pending",  count: pending.length,  icon: "ti-clock" },
    { key: "rejected", label: "Rejected", count: rejected.length, icon: "ti-calendar-x" },
    { key: "history",  label: "History",  count: history.length,  icon: "ti-history", badge: unratedCount },
  ];

  return (
    <div className="ma-root">
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3.19.0/dist/tabler-icons.min.css" />

      <div className="ma-card">

        {/* Header */}
        <div className="ma-header">
          <div className="ma-header-icon">
            <i className="ti ti-calendar-event" aria-hidden="true" />
          </div>
          <div className="ma-header-text">
            <h1>My Appointments</h1>
            <p>Track and manage all your appointment requests</p>
          </div>
        </div>

        {/* Tab bar */}
        <div className="ma-tab-bar">
          {tabs.map(t => (
            <button
              key={t.key}
              className={`ma-tab${activeTab === t.key ? " active" : ""}`}
              onClick={() => setActiveTab(t.key)}
            >
              <i className={`ti ${t.icon}`} aria-hidden="true" />
              {t.label}
              <span className={`ma-tab-badge${t.badge ? " dot" : ""}`}>
                {t.badge || t.count}
              </span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="ma-body">
          {renderList(
            activeTab === "accepted" ? accepted :
            activeTab === "pending"  ? pending  :
            activeTab === "rejected" ? rejected : history,
            activeTab
          )}
        </div>

      </div>
    </div>
  );
}

export default MyAppointments;
