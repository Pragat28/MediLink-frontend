import React, { useEffect, useState } from "react";
import axios from "axios";
import useBackRedirect from "../../hooks/useBackRedirect";
import { toast } from "react-toastify";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; }

  .ap-root {
    --accent:      #2d5a4e;
    --accent-bg:   #eaf2ef;
    --danger:      #b91c1c;
    --danger-bg:   #fef2f2;
    --warn:        #92400e;
    --warn-bg:     #fffbeb;
    --info:        #1e40af;
    --info-bg:     #eff6ff;
    --success:     #166534;
    --success-bg:  #f0fdf4;
    --neutral-bg:  #f8f8f7;
    --border:      rgba(0,0,0,0.08);
    --border-md:   rgba(0,0,0,0.12);
    --text:        #111;
    --muted:       #6b7280;
    --surface:     #fff;
    --page-bg:     #f4f3f0;
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    color: var(--text);
    background: var(--page-bg);
    min-height: 100vh;
    padding: 32px 16px 80px;
  }

  .ap-card {
    max-width: 900px;
    margin: 0 auto;
    background: var(--surface);
    border-radius: 14px;
    border: 1px solid var(--border);
    overflow: hidden;
  }

  .ap-header {
    padding: 24px 32px;
    border-bottom: 1px solid var(--border);
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .ap-header-icon {
    width: 36px; height: 36px;
    background: var(--accent-bg);
    border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    color: var(--accent);
    font-size: 17px;
    flex-shrink: 0;
  }
  .ap-header-text h1 {
    font-size: 17px;
    font-weight: 600;
    margin: 0 0 1px;
    color: var(--text);
  }
  .ap-header-text p {
    font-size: 12.5px;
    color: var(--muted);
    margin: 0;
  }

  .ap-body { padding: 24px 32px; }

  .ap-count-label {
    font-size: 12px;
    font-weight: 500;
    letter-spacing: .04em;
    text-transform: uppercase;
    color: var(--muted);
    margin: 0 0 16px;
  }

  .ap-empty {
    text-align: center;
    padding: 56px 20px;
    color: var(--muted);
  }
  .ap-empty-icon {
    width: 48px; height: 48px;
    background: var(--accent-bg);
    border-radius: 50%;
    margin: 0 auto 14px;
    display: flex; align-items: center; justify-content: center;
    color: var(--accent);
    font-size: 22px;
  }
  .ap-empty h3 { font-size: 16px; font-weight: 600; color: var(--text); margin: 0 0 4px; }
  .ap-empty p  { font-size: 13px; margin: 0; }

  .ap-group {
    border: 1px solid var(--border);
    border-radius: 10px;
    margin-bottom: 16px;
    overflow: hidden;
  }
  .ap-group-header {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 18px;
    background: var(--neutral-bg);
    border-bottom: 1px solid var(--border);
  }
  .ap-avatar {
    width: 36px; height: 36px;
    border-radius: 50%;
    background: var(--accent);
    color: #fff;
    display: flex; align-items: center; justify-content: center;
    font-weight: 600;
    font-size: 13px;
    flex-shrink: 0;
    letter-spacing: .03em;
  }
  .ap-group-name  { font-weight: 600; font-size: 14px; margin: 0 0 1px; }
  .ap-group-email { font-size: 12px; color: var(--muted); margin: 0; }
  .ap-group-count {
    margin-left: auto;
    font-size: 11.5px;
    font-weight: 500;
    background: var(--border);
    color: var(--muted);
    padding: 2px 8px;
    border-radius: 20px;
  }

  .ap-request {
    padding: 14px 18px;
    border-bottom: 1px solid var(--border);
  }
  .ap-request:last-child { border-bottom: none; }

  .ap-meta {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 6px;
    margin-bottom: 0;
  }
  .ap-meta-item {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: 12.5px;
    color: var(--muted);
    background: var(--neutral-bg);
    border: 1px solid var(--border);
    padding: 3px 8px;
    border-radius: 6px;
  }
  .ap-meta-item strong { color: var(--text); font-weight: 500; }
  .ap-meta-item i { font-size: 13px; }

  .ap-badge {
    display: inline-flex;
    align-items: center;
    padding: 3px 8px;
    border-radius: 6px;
    font-size: 11.5px;
    font-weight: 600;
    letter-spacing: .03em;
    text-transform: uppercase;
  }
  .ap-badge-pending   { background: var(--warn-bg);    color: var(--warn); }
  .ap-badge-accepted  { background: var(--accent-bg);  color: var(--accent); }
  .ap-badge-rejected  { background: var(--danger-bg);  color: var(--danger); }
  .ap-badge-completed { background: var(--success-bg); color: var(--success); }
  .ap-badge-cancelled { background: var(--neutral-bg); color: var(--muted); border: 1px solid var(--border); }

  .ap-mode {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 3px 8px;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 500;
    background: var(--info-bg);
    color: var(--info);
  }
  .ap-mode i { font-size: 13px; }

  .ap-rating {
    margin-top: 10px;
    padding: 10px 12px;
    background: var(--neutral-bg);
    border: 1px solid var(--border);
    border-radius: 8px;
    font-size: 13px;
  }
  .ap-rating .stars { color: #ca8a04; font-weight: 600; font-size: 13px; margin-bottom: 3px; }
  .ap-rating .review { color: var(--muted); font-style: italic; margin: 0; font-size: 12.5px; }

  .ap-actions { display: flex; gap: 6px; margin-top: 10px; flex-wrap: wrap; align-items: center; }

  .ap-btn {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 6px 12px;
    border-radius: 7px;
    border: 1px solid transparent;
    font-family: 'Inter', sans-serif;
    font-size: 12.5px;
    font-weight: 500;
    cursor: pointer;
    transition: opacity .15s, transform .1s;
    white-space: nowrap;
    line-height: 1;
  }
  .ap-btn:hover  { opacity: .82; }
  .ap-btn:active { transform: scale(.97); }
  .ap-btn i { font-size: 14px; }

  .ap-btn-accept  { background: var(--accent);    color: #fff; border-color: var(--accent); }
  .ap-btn-reject  { background: var(--danger-bg); color: var(--danger); border-color: rgba(185,28,28,0.2); }
  .ap-btn-verify  { background: var(--info-bg);   color: var(--info); border-color: rgba(30,64,175,0.2); }
  .ap-btn-cancel  { background: var(--neutral-bg); color: var(--muted); border-color: var(--border-md); }
  .ap-btn-confirm { background: var(--accent);    color: #fff; border-color: var(--accent); }
  .ap-btn-ghost   { background: transparent; color: var(--muted); border-color: var(--border-md); }

  .ap-verify-box {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 10px;
    padding: 10px 12px;
    background: var(--info-bg);
    border: 1px solid rgba(30,64,175,0.2);
    border-radius: 8px;
    flex-wrap: wrap;
  }
  .ap-verify-box label {
    font-size: 12px;
    font-weight: 600;
    color: var(--info);
    white-space: nowrap;
    letter-spacing: .03em;
    text-transform: uppercase;
  }
  .ap-verify-box input {
    flex: 1;
    min-width: 140px;
    padding: 6px 10px;
    border: 1px solid rgba(30,64,175,0.25);
    border-radius: 6px;
    font-size: 13px;
    font-family: 'Inter', sans-serif;
    outline: none;
    background: #fff;
    transition: border-color .15s;
  }
  .ap-verify-box input:focus { border-color: var(--info); box-shadow: 0 0 0 2px rgba(30,64,175,0.1); }

  .ap-loading {
    display: flex; align-items: center; justify-content: center;
    min-height: 40vh;
    color: var(--muted);
    font-size: 13px;
    gap: 10px;
  }
  .ap-spinner {
    width: 18px; height: 18px;
    border: 2px solid var(--border);
    border-top-color: var(--accent);
    border-radius: 50%;
    animation: ap-spin .7s linear infinite;
  }
  @keyframes ap-spin { to { transform: rotate(360deg); } }

  @media (max-width: 600px) {
    .ap-body, .ap-header { padding-left: 16px; padding-right: 16px; }
  }
`;

const initials = (name = "") =>
  name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase() || "?";

const statusClass = (s) => ({
  pending:   "ap-badge-pending",
  accepted:  "ap-badge-accepted",
  rejected:  "ap-badge-rejected",
  completed: "ap-badge-completed",
  cancelled: "ap-badge-cancelled",
}[s] || "ap-badge-cancelled");

const Stars = ({ rating }) => {
  const filled = Math.round(rating);
  return (
    <span className="stars">
      {"★".repeat(filled)}{"☆".repeat(5 - filled)} {rating}/5
    </span>
  );
};

const Appointments = () => {
  useBackRedirect("/doctor/profile");

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showVerifyBox, setShowVerifyBox] = useState(null);
  const [enteredCode, setEnteredCode] = useState("");

  const token = localStorage.getItem("doctorToken");

  useEffect(() => {
    const id = "ap-styles";
    if (!document.getElementById(id)) {
      const tag = document.createElement("style");
      tag.id = id;
      tag.textContent = STYLES;
      document.head.appendChild(tag);
    }
  }, []);

  const fetchAppointments = async () => {
    if (!token) { toast.error("You are not logged in. Please log in again."); return; }
    try {
      setLoading(true);
      const res = await axios.get(
        "https://medilink-j44r.onrender.com/api/doctor-appointments/appointments",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setData(res.data);
    } catch (err) {
      if (!err.response) toast.error("Network error — please check your internet connection.");
      else if (err.response.status === 401) toast.error("Session expired. Please log in again.");
      else toast.error(err.response?.data?.message || "Failed to load appointments.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAppointments(); }, []);

  const handleAction = async (id, action) => {
    if (!token) { toast.error("You are not logged in. Please log in again."); return; }
    try {
      const res = await axios.put(
        `https://medilink-j44r.onrender.com/api/doctor-appointments/appointments/${id}/${action}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (action === "approve") {
        if (res.data.mode === "online")
          toast.info(`Please send the meeting link to: ${res.data.patientEmail}`, { autoClose: 8000 });
        else
          toast.success("Appointment accepted successfully.");
      } else if (action === "reject") {
        toast.success("Appointment rejected.");
      } else if (action === "cancel") {
        toast.success("Appointment cancelled.");
      }
      fetchAppointments();
    } catch (err) {
      if (!err.response) toast.error("Network error — could not perform action. Please try again.");
      else toast.error(err.response?.data?.message || "Action failed. Please try again.");
    }
  };

  const handleVerify = async (appointmentId) => {
    if (!enteredCode.trim()) { toast.error("Please enter the patient code before verifying."); return; }
    if (!token) { toast.error("You are not logged in. Please log in again."); return; }
    try {
      await axios.put(
        "https://medilink-j44r.onrender.com/api/doctor-appointments/verify",
        { appointmentId, code: enteredCode },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Appointment verified and marked as completed.");
      setShowVerifyBox(null);
      setEnteredCode("");
      fetchAppointments();
    } catch (err) {
      if (!err.response) toast.error("Network error — verification failed. Please try again.");
      else toast.error(err.response?.data?.message || "Verification failed. Please check the code and try again.");
    }
  };

  if (loading) return (
    <div className="ap-root">
      <div className="ap-loading">
        <div className="ap-spinner" />
        Loading appointments…
      </div>
    </div>
  );

  const totalRequests = data.reduce((acc, g) => acc + g.requests.length, 0);

  return (
    <div className="ap-root">
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3.19.0/dist/tabler-icons.min.css" />

      <div className="ap-card">

        <div className="ap-header">
          <div className="ap-header-icon">
            <i className="ti ti-calendar-event" aria-hidden="true" />
          </div>
          <div className="ap-header-text">
            <h1>Appointments</h1>
            <p>Review and manage all patient appointment requests</p>
          </div>
        </div>

        <div className="ap-body">

          {data.length === 0 ? (
            <div className="ap-empty">
              <div className="ap-empty-icon">
                <i className="ti ti-calendar-off" aria-hidden="true" />
              </div>
              <h3>No appointments yet</h3>
              <p>When patients book with you, their requests will appear here.</p>
            </div>
          ) : (
            <>
              <p className="ap-count-label">
                {totalRequests} appointment{totalRequests !== 1 ? "s" : ""} · {data.length} patient{data.length !== 1 ? "s" : ""}
              </p>

              {data.map((group, index) => (
                <div className="ap-group" key={index}>

                  <div className="ap-group-header">
                    <div className="ap-avatar">{initials(group.patient?.name)}</div>
                    <div>
                      <p className="ap-group-name">{group.patient?.name || "Unknown Patient"}</p>
                      <p className="ap-group-email">{group.patient?.email || ""}</p>
                    </div>
                    <span className="ap-group-count">
                      {group.requests.length}
                    </span>
                  </div>

                  {group.requests.map(req => (
                    <div className="ap-request" key={req.appointmentId}>

                      <div className="ap-meta">
                        <span className="ap-meta-item">
                          <i className="ti ti-calendar" aria-hidden="true" />
                          <strong>{new Date(req.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</strong>
                        </span>
                        <span className="ap-meta-item">
                          <i className="ti ti-clock" aria-hidden="true" />
                          <strong>{req.slotTime}</strong>
                        </span>
                        {req.mode && (
                          <span className="ap-mode">
                            <i className={`ti ${req.mode === "online" ? "ti-wifi" : "ti-building-hospital"}`} aria-hidden="true" />
                            {req.mode === "online" ? "Online" : "In-clinic"}
                          </span>
                        )}
                        <span className={`ap-badge ${statusClass(req.status)}`}>
                          {req.status}
                        </span>
                      </div>

                      {req.status === "completed" && req.rated && (
                        <div className="ap-rating">
                          <Stars rating={req.rating} />
                          {req.review && <p className="review">{req.review}</p>}
                        </div>
                      )}

                      {req.status === "pending" && (
                        <div className="ap-actions">
                          <button className="ap-btn ap-btn-accept" onClick={() => handleAction(req.appointmentId, "approve")}>
                            <i className="ti ti-check" aria-hidden="true" /> Accept
                          </button>
                          <button className="ap-btn ap-btn-reject" onClick={() => handleAction(req.appointmentId, "reject")}>
                            <i className="ti ti-x" aria-hidden="true" /> Reject
                          </button>
                        </div>
                      )}

                      {req.status === "accepted" && (
                        <div className="ap-actions">
                          <button className="ap-btn ap-btn-verify" onClick={() => setShowVerifyBox(req.appointmentId)}>
                            <i className="ti ti-shield-check" aria-hidden="true" /> Verify &amp; Complete
                          </button>
                          <button className="ap-btn ap-btn-cancel" onClick={() => handleAction(req.appointmentId, "cancel")}>
                            <i className="ti ti-x" aria-hidden="true" /> Cancel
                          </button>
                        </div>
                      )}

                      {showVerifyBox === req.appointmentId && (
                        <div className="ap-verify-box">
                          <label>Patient code</label>
                          <input
                            type="text"
                            placeholder="Enter code from patient"
                            value={enteredCode}
                            onChange={(e) => setEnteredCode(e.target.value)}
                          />
                          <button className="ap-btn ap-btn-confirm" onClick={() => handleVerify(req.appointmentId)}>
                            <i className="ti ti-check" aria-hidden="true" /> Verify
                          </button>
                          <button className="ap-btn ap-btn-ghost" onClick={() => { setShowVerifyBox(null); setEnteredCode(""); }}>
                            Cancel
                          </button>
                        </div>
                      )}

                    </div>
                  ))}

                </div>
              ))}
            </>
          )}

        </div>
      </div>
    </div>
  );
};

export default Appointments;
