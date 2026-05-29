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

  // ✅ show unacknowledged notifications on mount
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
            addNotification(
              notifId,
              `❌ Your appointment with Dr. ${app.doctor?.name} on ${date} was rejected by the doctor.`,
              "error"
            );
          } else if (curr === "cancelled") {
            addNotification(
              notifId,
              `⚠️ Your appointment with Dr. ${app.doctor?.name} on ${date} was cancelled by the doctor.`,
              "warning"
            );
          } else if (curr === "accepted") {
            addNotification(
              notifId,
              `✅ Your appointment with Dr. ${app.doctor?.name} on ${date} has been confirmed!`,
              "success"
            );
          } else if (curr === "completed") {
            // ✅ notify patient to rate
            addNotification(
              notifId,
              `🌟 Your appointment with Dr. ${app.doctor?.name} on ${date} is completed! Please rate your experience in the History section.`,
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

  // ✅ count unrated completed appointments
  const unratedCount = history.filter(
    app => app.status === "completed" && !app.rated
  ).length;

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
                  .filter(Boolean)
                  .join(", ")}
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

        {type === "pending" && (
          <p style={{ color: "orange" }}>⏳ Waiting for approval</p>
        )}

        {type === "rejected" && (
          <p style={{ color: "red" }}>✖ Rejected by doctor</p>
        )}

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
              <>
                {/* ✅ red reminder banner */}
                <div style={{
                  background: "#fef2f2",
                  border: "1.5px solid #fca5a5",
                  borderRadius: "8px",
                  padding: "10px 12px",
                  marginTop: "10px",
                  marginBottom: "10px"
                }}>
                  <p style={{ margin: 0, color: "#dc2626", fontWeight: "600", fontSize: "14px" }}>
                    ⭐ Please rate your experience with Dr. {app.doctor?.name}
                  </p>
                </div>

                <div style={{ marginTop: "5px" }}>
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
                    Submit
                  </button>
                </div>
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

        {/* ✅ red badge on History tab when unrated appointments exist */}
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
