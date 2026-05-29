import { useEffect, useState } from "react";
import axios from "axios";
import useBackRedirect from "../../hooks/useBackRedirect";
import { toast } from "react-toastify";

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
    const toastFn =
      n.type === "success" ? toast.success :
      n.type === "warning" ? toast.warning :
      toast.error;

    toastFn(
      <div>
        <p style={{ margin: 0, fontWeight: "600" }}>{n.message}</p>
        <button
          onClick={() => acknowledgeNotification(n.id)}
          style={{
            marginTop: "8px",
            padding: "4px 10px",
            background: "white",
            border: "1px solid #ccc",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "12px"
          }}
        >
          Got it ✓
        </button>
      </div>,
      {
        toastId: n.id,
        autoClose: false,
        closeOnClick: false,
        draggable: false,
        closeButton: false
      }
    );
  };

  const acknowledgeNotification = (id) => {
    toast.dismiss(id);
    const updated = JSON.parse(localStorage.getItem("apptNotifications") || "[]")
      .filter(n => n.id !== id);
    localStorage.setItem("apptNotifications", JSON.stringify(updated));
  };

  const addNotification = (id, message, type) => {
    const existing = JSON.parse(localStorage.getItem("apptNotifications") || "[]");
    if (existing.find(n => n.id === id)) return;
    const newNotif = { id, message, type };
    const updated = [...existing, newNotif];
    localStorage.setItem("apptNotifications", JSON.stringify(updated));
    showPersistentToast(newNotif);
  };

  const fetchAppointments = async () => {
    try {
      const res = await axios.get(
        "https://medilink-j44r.onrender.com/api/appointments/my",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const appointments = res.data.appointments;
      const savedMap = JSON.parse(localStorage.getItem("apptStatusMap") || "{}");

      appointments.forEach(app => {
        const prev = savedMap[app._id];
        const curr = app.status;

        if (prev && prev !== curr) {
          const date = new Date(app.date).toLocaleDateString();
          const notifId = `${app._id}-${curr}`;

          if (curr === "rejected") {
            addNotification(notifId,
              `❌ Dr. ${app.doctor?.name} has rejected your appointment request for ${date}. You may book another slot.`,
              "error"
            );
          } else if (curr === "cancelled") {
            addNotification(notifId,
              `⚠️ Dr. ${app.doctor?.name} has cancelled your confirmed appointment on ${date}. Please book a new appointment.`,
              "warning"
            );
          } else if (curr === "accepted") {
            addNotification(notifId,
              `✅ Dr. ${app.doctor?.name} has confirmed your appointment on ${date}. Check the Accepted tab for details.`,
              "success"
            );
          } else if (curr === "completed") {
            addNotification(notifId,
              `🌟 Your appointment with Dr. ${app.doctor?.name} on ${date} is completed! Go to History tab to rate your experience.`,
              "success"
            );
          }
        }
      });

      const newMap = {};
      appointments.forEach(app => { newMap[app._id] = app.status; });
      localStorage.setItem("apptStatusMap", JSON.stringify(newMap));

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

      toast.success("Rating submitted successfully!");
      fetchAppointments();

    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit rating");
    }
  };

  const formatDate = (date) => new Date(date).toLocaleDateString();

  const unratedCount = history.filter(
    app => app.status === "completed" && !app.rated
  ).length;

  const renderAppointments = (list, type) => {
    if (list.length === 0) {
      return (
        <div style={{
          textAlign: "center",
          padding: "30px",
          color: "#94a3b8",
          background: "white",
          borderRadius: "8px",
          boxShadow: "0 2px 6px rgba(0,0,0,0.05)"
        }}>
          {type === "accepted" && <p>No confirmed appointments.<br/>Book an appointment with a doctor to get started.</p>}
          {type === "pending" && <p>No pending requests.<br/>Your appointment requests will appear here.</p>}
          {type === "rejected" && <p>No rejected appointments.</p>}
          {type === "history" && <p>No appointment history yet.</p>}
        </div>
      );
    }

    return list.map(app => (
      <div key={app._id} style={cardStyle}>

        <p style={{ fontSize: "16px", fontWeight: "600", margin: "0 0 4px" }}>
          Dr. {app.doctor?.name}
        </p>
        <p style={{ color: "#64748b", margin: "0 0 10px" }}>
          📅 {formatDate(app.date)} &nbsp;⏰ {app.slotTime}
        </p>

        {/* ── ACCEPTED ── */}
        {type === "accepted" && (
          <>
            <div style={{
              background: "#f0fdf4",
              border: "1.5px solid #bbf7d0",
              borderRadius: "8px",
              padding: "10px 12px",
              marginBottom: "10px"
            }}>
              <p style={{ margin: 0, color: "#16a34a", fontWeight: "600" }}>
                ✔ Appointment Confirmed
              </p>
              <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#15803d" }}>
                Your appointment has been accepted by the doctor.
              </p>
            </div>

            <p style={{ margin: "4px 0", fontSize: "14px" }}>
              📧 {app.doctor?.email}
            </p>
            <p style={{ margin: "4px 0", fontSize: "14px" }}>
              📞 {app.doctor?.phone}
            </p>

            {(app.doctor?.address?.street || app.doctor?.address?.area || app.doctor?.address?.city) && (
              <p style={{ margin: "4px 0", fontSize: "14px", color: "#374151" }}>
                📍 {[app.doctor?.address?.street, app.doctor?.address?.area, app.doctor?.address?.city]
                  .filter(Boolean).join(", ")}
              </p>
            )}

            <div style={{
              background: "#eff6ff",
              border: "1.5px solid #bfdbfe",
              borderRadius: "8px",
              padding: "12px",
              marginTop: "10px"
            }}>
              <p style={{ margin: 0, color: "#1e40af", fontWeight: "600" }}>
                📩 Meeting Link Info
              </p>
              <p style={{ margin: "6px 0 0", color: "#1d4ed8", fontSize: "14px" }}>
                Your doctor will send you the meeting link on your registered email before the appointment time.
              </p>
            </div>
          </>
        )}

        {/* ── PENDING ── */}
        {type === "pending" && (
          <div style={{
            background: "#fffbeb",
            border: "1.5px solid #fde68a",
            borderRadius: "8px",
            padding: "10px 12px"
          }}>
            <p style={{ margin: 0, color: "#d97706", fontWeight: "600" }}>
              ⏳ Awaiting Doctor's Approval
            </p>
            <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#92400e" }}>
              Your request has been sent. The doctor will accept or reject it shortly.
            </p>
          </div>
        )}

        {/* ── REJECTED ── */}
        {type === "rejected" && (
          <div style={{
            background: "#fef2f2",
            border: "1.5px solid #fca5a5",
            borderRadius: "8px",
            padding: "10px 12px"
          }}>
            <p style={{ margin: 0, color: "#dc2626", fontWeight: "600" }}>
              ✖ Appointment Rejected
            </p>
            <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#991b1b" }}>
              The doctor was unable to accept this request. You can book a different slot or consult another doctor.
            </p>
          </div>
        )}

        {/* ── HISTORY ── */}
        {type === "history" && (
          <>
            {app.status === "completed" && (
              <div style={{
                background: "#f0fdf4",
                border: "1.5px solid #bbf7d0",
                borderRadius: "8px",
                padding: "10px 12px",
                marginBottom: "10px"
              }}>
                <p style={{ margin: 0, color: "#16a34a", fontWeight: "600" }}>
                  ✅ Appointment Completed
                </p>
              </div>
            )}

            {app.status === "cancelled" && (
              <div style={{
                background: "#fafafa",
                border: "1.5px solid #e2e8f0",
                borderRadius: "8px",
                padding: "10px 12px",
                marginBottom: "10px"
              }}>
                <p style={{ margin: 0, color: "#64748b", fontWeight: "600" }}>
                  🚫 Appointment Cancelled
                </p>
                <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#94a3b8" }}>
                  This appointment was cancelled by the doctor. You may book a new one.
                </p>
              </div>
            )}

            {app.rated && (
              <div style={{
                background: "#fffbeb",
                border: "1.5px solid #fde68a",
                borderRadius: "8px",
                padding: "10px 12px",
                marginTop: "8px"
              }}>
                <p style={{ margin: 0, fontWeight: "600" }}>⭐ Your Rating: {app.rating}/5</p>
                {app.review && (
                  <p style={{ margin: "4px 0 0", fontStyle: "italic", color: "#78350f" }}>
                    "{app.review}"
                  </p>
                )}
              </div>
            )}

            {app.status === "completed" && !app.rated && (
              <>
                <div style={{
                  background: "#fef2f2",
                  border: "1.5px solid #fca5a5",
                  borderRadius: "8px",
                  padding: "10px 12px",
                  marginBottom: "10px"
                }}>
                  <p style={{ margin: 0, color: "#dc2626", fontWeight: "600", fontSize: "14px" }}>
                    ⭐ Please rate your experience with Dr. {app.doctor?.name}
                  </p>
                  <p style={{ margin: "4px 0 0", fontSize: "12px", color: "#991b1b" }}>
                    Your feedback helps other patients find the right doctor.
                  </p>
                </div>

                <select
                  value={rating[app._id] || ""}
                  onChange={(e) =>
                    setRating(prev => ({ ...prev, [app._id]: e.target.value }))
                  }
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
                  onChange={(e) =>
                    setReview(prev => ({ ...prev, [app._id]: e.target.value }))
                  }
                />

                <button style={rateButton} onClick={() => submitRating(app._id)}>
                  Submit Rating
                </button>
              </>
            )}
          </>
        )}

      </div>
    ));
  };

  return (
    <div style={{ padding: "30px", maxWidth: "900px", margin: "auto" }}>

      <h2>My Appointments</h2>

      <div style={tabContainer}>
        <button
          style={activeTab === "accepted" ? activeTabStyle : tabStyle}
          onClick={() => setActiveTab("accepted")}
        >
          Accepted ({accepted.length})
        </button>

        <button
          style={activeTab === "pending" ? activeTabStyle : tabStyle}
          onClick={() => setActiveTab("pending")}
        >
          Pending ({pending.length})
        </button>

        <button
          style={activeTab === "rejected" ? activeTabStyle : tabStyle}
          onClick={() => setActiveTab("rejected")}
        >
          Rejected ({rejected.length})
        </button>

        <button
          style={activeTab === "history" ? activeTabStyle : tabStyle}
          onClick={() => setActiveTab("history")}
        >
          <span style={{ position: "relative" }}>
            History ({history.length})
            {unratedCount > 0 && (
              <span style={{
                position: "absolute",
                top: "-8px",
                right: "-12px",
                background: "red",
                color: "white",
                borderRadius: "50%",
                width: "18px",
                height: "18px",
                fontSize: "11px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold"
              }}>
                {unratedCount}
              </span>
            )}
          </span>
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

/* ================= STYLES ================= */

const tabContainer = {
  display: "flex",
  gap: "10px",
  marginTop: "20px",
  flexWrap: "wrap"
};

const tabStyle = {
  padding: "8px 15px",
  border: "1px solid #ccc",
  borderRadius: "6px",
  background: "white",
  cursor: "pointer"
};

const activeTabStyle = {
  ...tabStyle,
  background: "#2563eb",
  color: "white",
  border: "none"
};

const cardStyle = {
  background: "white",
  padding: "15px",
  marginTop: "10px",
  borderRadius: "8px",
  boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
};

const textarea = {
  display: "block",
  marginTop: "10px",
  width: "100%",
  height: "60px"
};

const rateButton = {
  marginTop: "10px",
  padding: "8px 15px",
  background: "#2563eb",
  color: "white",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer"
};

export default MyAppointments;
