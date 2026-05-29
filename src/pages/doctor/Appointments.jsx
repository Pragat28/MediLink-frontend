import React, { useEffect, useState } from "react";
import axios from "axios";
import useBackRedirect from "../../hooks/useBackRedirect";
import { toast } from "react-toastify";

const Appointments = () => {
  useBackRedirect("/doctor/profile");

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showVerifyBox, setShowVerifyBox] = useState(null);
  const [enteredCode, setEnteredCode] = useState("");

  const token = localStorage.getItem("doctorToken");

  const fetchAppointments = async () => {
    if (!token) {
      toast.error("You are not logged in. Please log in again.");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.get(
        "https://medilink-j44r.onrender.com/api/doctor-appointments/appointments",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setData(res.data);
    } catch (err) {
      if (!err.response) {
        toast.error("Network error — please check your internet connection.");
      } else if (err.response.status === 401) {
        toast.error("Session expired. Please log in again.");
      } else {
        toast.error(err.response?.data?.message || "Failed to load appointments.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleAction = async (id, action) => {
    if (!token) {
      toast.error("You are not logged in. Please log in again.");
      return;
    }

    try {
      const res = await axios.put(
        `https://medilink-j44r.onrender.com/api/doctor-appointments/appointments/${id}/${action}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (action === "approve") {
        if (res.data.mode === "online") {
          toast.info(`📩 Kindly send meeting link to: ${res.data.patientEmail}`, { autoClose: 8000 });
        } else {
          toast.success("Appointment accepted successfully.");
        }
      } else if (action === "reject") {
        toast.success("Appointment rejected.");
      } else if (action === "cancel") {
        toast.success("Appointment cancelled.");
      }

      fetchAppointments();

    } catch (err) {
      if (!err.response) {
        toast.error("Network error — could not perform action. Please try again.");
      } else {
        toast.error(err.response?.data?.message || "Action failed. Please try again.");
      }
    }
  };

  const handleVerify = async (appointmentId) => {
    if (!enteredCode.trim()) {
      toast.error("Please enter the patient code before verifying.");
      return;
    }

    if (!token) {
      toast.error("You are not logged in. Please log in again.");
      return;
    }

    try {
      await axios.put(
        "https://medilink-j44r.onrender.com/api/doctor-appointments/verify",
        { appointmentId, code: enteredCode },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Appointment verified and marked as completed!");
      setShowVerifyBox(null);
      setEnteredCode("");
      fetchAppointments();

    } catch (err) {
      if (!err.response) {
        toast.error("Network error — verification failed. Please try again.");
      } else {
        toast.error(err.response?.data?.message || "Verification failed. Please check the code and try again.");
      }
    }
  };

  if (loading) return <p style={{ padding: "20px", color: "#888" }}>Loading appointments...</p>;

  return (
    <div style={{ padding: "20px" }}>

      <h2>Appointments</h2>

      {data.length === 0 ? (
        <p style={{ color: "#888" }}>No appointments found.</p>
      ) : (
        data.map((group, index) => (
          <div key={index} style={{
            background: "white",
            padding: "15px",
            marginBottom: "20px",
            borderRadius: "8px"
          }}>

            <h3>{group.patient?.name || "Unknown Patient"}</h3>
            <p>{group.patient?.email || ""}</p>

            {group.requests.map(req => (
              <div key={req.appointmentId} style={{
                marginTop: "10px",
                borderTop: "1px solid #ddd",
                paddingTop: "10px"
              }}>

                <p>
                  📅 {new Date(req.date).toLocaleDateString()}
                  {" "}⏰ {req.slotTime}
                  {req.mode && <span> · {req.mode === "online" ? "🌐 Online" : "🏥 Offline"}</span>}
                </p>

                <p>Status: <b>{req.status}</b></p>

                {req.status === "completed" && req.rated && (
                  <div style={{
                    marginTop: "10px",
                    padding: "10px",
                    background: "#f1f5f9",
                    borderRadius: "6px"
                  }}>
                    <p>⭐ <b>{req.rating}/5</b></p>
                    {req.review && (
                      <p style={{ fontStyle: "italic" }}>"{req.review}"</p>
                    )}
                  </div>
                )}

                {req.status === "pending" && (
                  <>
                    <button
                      onClick={() => handleAction(req.appointmentId, "approve")}
                      style={{ marginRight: "5px", background: "green", color: "white", padding: "6px 12px", border: "none", borderRadius: "4px", cursor: "pointer" }}
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleAction(req.appointmentId, "reject")}
                      style={{ background: "red", color: "white", padding: "6px 12px", border: "none", borderRadius: "4px", cursor: "pointer" }}
                    >
                      Reject
                    </button>
                  </>
                )}

                {req.status === "accepted" && (
                  <>
                    <button
                      onClick={() => setShowVerifyBox(req.appointmentId)}
                      style={{ marginRight: "5px", padding: "6px 12px", border: "1px solid #ddd", borderRadius: "4px", cursor: "pointer" }}
                    >
                      Verify & Complete
                    </button>
                    <button
                      onClick={() => handleAction(req.appointmentId, "cancel")}
                      style={{ background: "gray", color: "white", padding: "6px 12px", border: "none", borderRadius: "4px", cursor: "pointer" }}
                    >
                      Cancel
                    </button>
                  </>
                )}

                {showVerifyBox === req.appointmentId && (
                  <div style={{ marginTop: "10px" }}>
                    <input
                      type="text"
                      placeholder="Enter patient code"
                      value={enteredCode}
                      onChange={(e) => setEnteredCode(e.target.value)}
                      style={{ padding: "6px", marginRight: "5px", border: "1px solid #ddd", borderRadius: "4px" }}
                    />
                    <button
                      onClick={() => handleVerify(req.appointmentId)}
                      style={{ background: "#2563eb", color: "white", padding: "6px 10px", border: "none", borderRadius: "4px", cursor: "pointer" }}
                    >
                      Verify
                    </button>
                    <button
                      onClick={() => { setShowVerifyBox(null); setEnteredCode(""); }}
                      style={{ marginLeft: "5px", padding: "6px 10px", border: "1px solid #ddd", borderRadius: "4px", cursor: "pointer" }}
                    >
                      Cancel
                    </button>
                  </div>
                )}

              </div>
            ))}

          </div>
        ))
      )}

    </div>
  );
};

export default Appointments;
