import { useEffect, useState, useRef } from "react";
import axios from "axios";
import useBackRedirect from "../../hooks/useBackRedirect";

function MyAppointments() {
  useBackRedirect("/patient/profile");
  const token = localStorage.getItem("patientToken");

  const [accepted, setAccepted] = useState([]);
  const [pending, setPending] = useState([]);
  const [rejected, setRejected] = useState([]);
  const [history, setHistory] = useState([]);

  const [rating, setRating] = useState({});
  const [review, setReview] = useState({});

  const [activeTab, setActiveTab] = useState("accepted");
  const [notifications, setNotifications] = useState([]);

  // ✅ Hold the latest statuses here, only flush to localStorage after patient acknowledges
  const pendingStatusSave = useRef(null);

  useEffect(() => {
    fetchAppointments();
    const interval = setInterval(fetchAppointments, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await axios.get(
        "https://medilink-j44r.onrender.com/api/appointments/my",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const appointments = res.data.appointments;
      if (!appointments || !Array.isArray(appointments)) return;

      // ✅ Use ONE key — same key PatientLayout uses
      const savedMap = JSON.parse(localStorage.getItem("appointmentStatuses") || "{}");

      const newNotifs = [];
      appointments.forEach(app => {
        const prev = savedMap[app._id];
        const curr = app.status;

        if (prev && prev !== curr) {
          if (curr === "accepted") {
            newNotifs.push({
              id: app._id + "_" + curr,
              type: "accepted",
              message: `Your appointment with Dr. ${app.doctor?.name} on ${new Date(app.date).toLocaleDateString()} has been confirmed! ✅`
            });
          } else if (curr === "rejected") {
            newNotifs.push({
              id: app._id + "_" + curr,
              type: "rejected",
              message: `Your appointment with Dr. ${app.doctor?.name} on ${new Date(app.date).toLocaleDateString()} was rejected by the doctor.`
            });
          } else if (curr === "cancelled") {
            newNotifs.push({
              id: app._id + "_" + curr,
              type: "cancelled",
              message: `Your appointment with Dr. ${app.doctor?.name} on ${new Date(app.date).toLocaleDateString()} was cancelled by the doctor.`
            });
          }
        }
      });

      // ✅ Build new status map
      const newMap = {};
      appointments.forEach(app => { newMap[app._id] = app.status; });

      if (newNotifs.length > 0) {
        // ✅ Don't save yet — hold it until patient clicks OK
        pendingStatusSave.current = newMap;
        setNotifications(prev => {
          // avoid duplicates if polling fires again before patient clicks OK
          const existingIds = new Set(prev.map(n => n.id));
          const fresh = newNotifs.filter(n => !existingIds.has(n.id));
          return [...prev, ...fresh];
        });
      } else {
        // ✅ No changes — safe to save immediately
        localStorage.setItem("appointmentStatuses", JSON.stringify(newMap));
        pendingStatusSave.current = null;
      }

      const acceptedList = [];
      const pendingList = [];
      const rejectedList = [];
      const historyList = [];

      appointments.forEach(app => {
        if (app.status === "accepted") acceptedList.push(app);
        else if (app.status === "pending") pendingList.push(app);
        else if (app.status === "rejected") rejectedList.push(app);
        else historyList.push(app);
      });

      setAccepted(acceptedList);
      setPending(pendingList);
      setRejected(rejectedList);
      setHistory(historyList);

    } catch (err) {
      console.error(err);
    }
  };

  // ✅ Only flush saved statuses when ALL notifications are dismissed
  const dismissNotification = (id) => {
    setNotifications(prev => {
      const remaining = prev.filter(n => n.id !== id);
      // Last one being dismissed — now safe to save
      if (remaining.length === 0 && pendingStatusSave.current) {
        localStorage.setItem("appointmentStatuses", JSON.stringify(pendingStatusSave.current));
        pendingStatusSave.current = null;
      }
      return remaining;
    });
  };

  const submitRating = async (appointmentId) => {
    if (!rating[appointmentId]) {
      alert("Please select a rating");
      return;
    }
    try {
      await axios.post(
        `https://medilink-j44r.onrender.com/api/appointments/${appointmentId}/rate`,
        {
          rating: Number(rating[appointmentId]),
          review: review[appointmentId] || ""
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Rating submitted successfully!");
      fetchAppointments();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to submit rating");
    }
  };

  const formatDate = (date) => new Date(date).toLocaleDateString();

  const getNotifStyle = (type) => {
    if (type === "accepted") return { background: "#f0fdf4", border: "1.5px solid #86efac", color: "#166534" };
    if (type === "rejected") return { background: "#fef2f2", border: "1.5px solid #fca5a5", color: "#991b1b" };
    if (type === "cancelled") return { background: "#fffbeb", border: "1.5px solid #fcd34d", color: "#92400e" };
    return {};
  };

  const getNotifIcon = (type) => {
    if (type === "accepted") return "✅";
    if (type === "rejected") return "❌";
    if (type === "cancelled") return "⚠️";
    return "ℹ️";
  };

  const renderAppointments = (list, type) => {
    if (list.length === 0) {
      return <p style={{ opacity: 0.6 }}>No appointments</p>;
    }

    return list.map(app => (
      <div key={app._id} style={cardStyle}>
        <p><strong>{app.doctor?.name}</strong></p>
        <p>{formatDate(app.date)} • {app.slotTime}</p>

        {type === "accepted" && (
          <>
            <p style={{ color: "green" }}>✔ Confirmed</p>
            <p>{app.doctor?.email}</p>
            <p>{app.doctor?.phone}</p>
            {(app.doctor?.address?.street || app.doctor?.address?.area || app.doctor?.address?.city) && (
              <p style={{ marginTop: "6px", color: "#374151" }}>
                📍 {[app.doctor?.address?.street, app.doctor?.address?.area, app.doctor?.address?.city]
                  .filter(Boolean).join(", ")}
              </p>
            )}
            <div style={{
              background: "#eff6ff", border: "1.5px solid #bfdbfe",
              borderRadius: "8px", padding: "12px", marginTop: "10px"
            }}>
              <p style={{ margin: 0, color: "#1e40af", fontWeight: "600" }}>📩 Meeting Link Info</p>
              <p style={{ margin: "6px 0 0", color: "#1d4ed8", fontSize: "14px" }}>
                Your doctor will send you the meeting link on your registered email before the appointment time.
              </p>
            </div>
          </>
        )}

        {type === "pending" && <p style={{ color: "orange" }}>⏳ Waiting for approval</p>}
        {type === "rejected" && <p style={{ color: "red" }}>✖ Rejected by doctor</p>}

        {type === "history" && (
          <>
            <p>Status: {app.status}</p>
            {app.rated && (
              <div style={{ marginTop: "10px" }}>
                <p>⭐ {app.rating}</p>
                {app.review && <p>📝 {app.review}</p>}
              </div>
            )}
            {app.status === "completed" && !app.rated && (
              <div style={{ marginTop: "10px" }}>
                <select
                  value={rating[app._id] || ""}
                  onChange={(e) => setRating(prev => ({ ...prev, [app._id]: e.target.value }))}
                >
                  <option value="">Rate Doctor</option>
                  <option value="1">1 ⭐</option>
                  <option value="2">2 ⭐</option>
                  <option value="3">3 ⭐</option>
                  <option value="4">4 ⭐</option>
                  <option value="5">5 ⭐</option>
                </select>
                <textarea
                  placeholder="Write a review..."
                  style={textarea}
                  value={review[app._id] || ""}
                  onChange={(e) => setReview(prev => ({ ...prev, [app._id]: e.target.value }))}
                />
                <button style={rateButton} onClick={() => submitRating(app._id)}>Submit</button>
              </div>
            )}
          </>
        )}
      </div>
    ));
  };

  return (
    <div style={{ padding: "30px", maxWidth: "900px", margin: "auto" }}>

      {notifications.map((notif) => (
        <div key={notif.id} style={{
          ...getNotifStyle(notif.type),
          borderRadius: "10px",
          padding: "20px 24px",
          marginBottom: "16px",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: "16px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
        }}>
          <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
            <span style={{ fontSize: "22px" }}>{getNotifIcon(notif.type)}</span>
            <p style={{ margin: 0, fontWeight: "500", fontSize: "15px", lineHeight: "1.5" }}>
              {notif.message}
            </p>
          </div>
          <button
            onClick={() => dismissNotification(notif.id)}
            style={{
              padding: "6px 18px",
              background: notif.type === "accepted" ? "#16a34a" : notif.type === "rejected" ? "#dc2626" : "#d97706",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "600",
              whiteSpace: "nowrap",
              flexShrink: 0
            }}
          >
            OK
          </button>
        </div>
      ))}

      <h2>My Appointments</h2>

      <div style={tabContainer}>
        <button style={activeTab === "accepted" ? activeTabStyle : tabStyle} onClick={() => setActiveTab("accepted")}>
          Accepted ({accepted.length})
        </button>
        <button style={activeTab === "pending" ? activeTabStyle : tabStyle} onClick={() => setActiveTab("pending")}>
          Pending ({pending.length})
        </button>
        <button style={activeTab === "rejected" ? activeTabStyle : tabStyle} onClick={() => setActiveTab("rejected")}>
          Rejected ({rejected.length})
        </button>
        <button style={activeTab === "history" ? activeTabStyle : tabStyle} onClick={() => setActiveTab("history")}>
          History ({history.length})
        </button>
      </div>

      <div style={{ marginTop: "20px" }}>
        {activeTab === "accepted" && renderAppointments(accepted, "accepted")}
        {activeTab === "pending" && renderAppointments(pending, "pending")}
        {activeTab === "rejected" && renderAppointments(rejected, "rejected")}
        {activeTab === "history" && renderAppointments(history, "history")}
      </div>
    </div>
  );
}

const tabContainer = { display: "flex", gap: "10px", marginTop: "20px", flexWrap: "wrap" };
const tabStyle = { padding: "8px 15px", border: "1px solid #ccc", borderRadius: "6px", background: "white", cursor: "pointer" };
const activeTabStyle = { ...tabStyle, background: "#2563eb", color: "white", border: "none" };
const cardStyle = { background: "white", padding: "15px", marginTop: "10px", borderRadius: "8px", boxShadow: "0 2px 6px rgba(0,0,0,0.1)" };
const textarea = { display: "block", marginTop: "10px", width: "100%", height: "60px" };
const rateButton = { marginTop: "10px", padding: "8px 15px", background: "#2563eb", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" };

export default MyAppointments;
