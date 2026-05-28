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

  // ✅ NEW — stores approval info to show reminder box
  const [approvalInfo, setApprovalInfo] = useState(null);

  const token = localStorage.getItem("doctorToken");

  /* ================= FETCH ================= */
  const fetchAppointments = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        "https://medilink-j44r.onrender.com/api/doctor-appointments/appointments",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setData(res.data);

    } catch (err) {
      console.log(err);
      toast.error("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  /* ================= ACTION ================= */

  const handleAction = async (id, action) => {
    try {

      const res = await axios.put(
        `https://medilink-j44r.onrender.com/api/doctor-appointments/appointments/${id}/${action}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      // ✅ Show reminder messages on approval
      if (action === "approve") {
        setApprovalInfo({
          doctorReminder: res.data.doctorReminder,
          patientMessage: res.data.patientMessage,
          patientEmail: res.data.patientEmail
        });
      } else {
        toast.success(`Appointment ${action}ed successfully`);
      }

      fetchAppointments();

    } catch (err) {
      toast.error(err.response?.data?.message || "Action failed");
    }
  };

  /* ================= VERIFY ================= */

  const handleVerify = async (appointmentId) => {
    try {

      await axios.put(
        "https://medilink-j44r.onrender.com/api/doctor-appointments/verify",
        {
          appointmentId,
          code: enteredCode
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      toast.success("Appointment completed successfully!");

      setShowVerifyBox(null);
      setEnteredCode("");
      fetchAppointments();

    } catch (err) {
      toast.error(err.response?.data?.message || "Verification failed");
    }
  };

  /* ================= UI ================= */

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ padding: "20px" }}>

      <h2>Appointments</h2>

      {/* ✅ APPROVAL REMINDER BOX */}
      {approvalInfo && (
        <div style={{
          background: "#fffbeb",
          border: "1.5px solid #f59e0b",
          borderRadius: "10px",
          padding: "20px",
          marginBottom: "20px"
        }}>
          <h3 style={{ color: "#b45309", marginTop: 0 }}>✅ Appointment Approved</h3>

          <div style={{
            background: "#fef3c7",
            borderRadius: "8px",
            padding: "12px",
            marginBottom: "12px"
          }}>
            <p style={{ margin: 0, fontWeight: "600", color: "#92400e" }}>
              📋 Reminder for you (Doctor):
            </p>
            <p style={{ margin: "6px 0 0", color: "#78350f" }}>
              {approvalInfo.doctorReminder}
            </p>
          </div>

          <div style={{
            background: "#ecfdf5",
            borderRadius: "8px",
            padding: "12px",
            marginBottom: "12px"
          }}>
            <p style={{ margin: 0, fontWeight: "600", color: "#065f46" }}>
              💬 Message sent to patient:
            </p>
            <p style={{ margin: "6px 0 0", color: "#064e3b" }}>
              {approvalInfo.patientMessage}
            </p>
          </div>

          <button
            onClick={() => setApprovalInfo(null)}
            style={{
              padding: "8px 16px",
              background: "#f59e0b",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "600"
            }}
          >
            Got it ✓
          </button>
        </div>
      )}

      {data.length === 0 ? (
        <p>No appointments found</p>
      ) : (

        data.map((group, index) => (

          <div key={index} style={{
            background: "white",
            padding: "15px",
            marginBottom: "20px",
            borderRadius: "8px"
          }}>

            <h3>{group.patient?.name}</h3>
            <p>{group.patient?.email}</p>

            {group.requests.map(req => (

              <div key={req.appointmentId} style={{
                marginTop: "10px",
                borderTop: "1px solid #ddd",
                paddingTop: "10px"
              }}>

                <p>
                  📅 {new Date(req.date).toLocaleDateString()}
                  {" "}⏰ {req.slotTime}
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
                      <p style={{ fontStyle: "italic" }}>
                        "{req.review}"
                      </p>
                    )}
                  </div>
                )}

                {req.status === "pending" && (
                  <>
                    <button
                      onClick={() => handleAction(req.appointmentId, "approve")}
                      style={{ marginRight: "5px", background: "green", color: "white" }}
                    >
                      Accept
                    </button>

                    <button
                      onClick={() => handleAction(req.appointmentId, "reject")}
                      style={{ background: "red", color: "white" }}
                    >
                      Reject
                    </button>
                  </>
                )}

                {req.status === "accepted" && (
                  <>
                    <button
                      onClick={() => setShowVerifyBox(req.appointmentId)}
                      style={{ marginRight: "5px" }}
                    >
                      Verify & Complete
                    </button>

                    <button
                      onClick={() => handleAction(req.appointmentId, "cancel")}
                      style={{ background: "gray", color: "white" }}
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
                      style={{
                        padding: "6px",
                        marginRight: "5px"
                      }}
                    />

                    <button
                      onClick={() => handleVerify(req.appointmentId)}
                      style={{
                        background: "#2563eb",
                        color: "white",
                        padding: "6px 10px"
                      }}
                    >
                      Verify
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
