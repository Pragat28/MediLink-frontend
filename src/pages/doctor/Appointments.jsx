import React, { useEffect, useState } from "react";
import axios from "axios";
import useBackRedirect from "../../hooks/useBackRedirect";
import { toast } from "react-toastify"; // ✅ ADDED

const Appointments = () => {
  useBackRedirect("/doctor/profile");

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  // ⭐ NEW STATES
  const [showVerifyBox, setShowVerifyBox] = useState(null);
  const [enteredCode, setEnteredCode] = useState("");

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
      toast.error("Failed to load appointments"); // ✅ CHANGED
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

      await axios.put(
        `https://medilink-j44r.onrender.com/api/doctor-appointments/appointments/${id}/${action}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      toast.success(`Appointment ${action}ed successfully`); // ✅ ADDED
      fetchAppointments();

    } catch (err) {
      toast.error(err.response?.data?.message || "Action failed"); // ✅ CHANGED
    }
  };

  /* ⭐ NEW VERIFY FUNCTION */
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

      toast.success("Appointment completed successfully!"); // ✅ CHANGED

      setShowVerifyBox(null);
      setEnteredCode("");
      fetchAppointments();

    } catch (err) {
      toast.error(err.response?.data?.message || "Verification failed"); // ✅ CHANGED
    }
  };

  /* ================= UI ================= */

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ padding: "20px" }}>

      <h2>Appointments</h2>

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

                {/* ✅ SHOW REVIEW */}
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

                {/* ACTIONS */}

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

                {/* ⭐ VERIFY INPUT BOX */}
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