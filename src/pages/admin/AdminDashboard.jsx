import { useEffect, useState } from "react";
import axios from "axios";

function AdminDashboard() {

  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ GET ADMIN TOKEN
  const token = localStorage.getItem("adminToken");

  /* ================= FETCH ================= */

  const fetchDoctors = async () => {
    try {
      const res = await axios.get(
        "https://medilink-j44r.onrender.com/api/admin/pending-doctors",
        {
          headers: {
            Authorization: `Bearer ${token}` // ✅ FIX
          }
        }
      );
      setDoctors(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  /* ================= ACTIONS ================= */

  const verifyDoctor = async (id) => {
    try {
      await axios.put(
        `https://medilink-j44r.onrender.com/api/admin/verify-doctor/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}` // ✅ FIX
          }
        }
      );

      fetchDoctors();
    } catch (err) {
      console.error(err);
    }
  };

  const rejectDoctor = async (id) => {
    try {
      await axios.put(
        `https://medilink-j44r.onrender.com/api/admin/reject-doctor/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}` // ✅ FIX
          }
        }
      );

      fetchDoctors();
    } catch (err) {
      console.error(err);
    }
  };

  const openNMC = () => {
    window.open(
      "https://www.nmc.org.in/information-desk/indian-medical-register/",
      "_blank"
    );
  };

  /* ================= UI ================= */

  if (loading) {
    return <p style={{ padding: "30px" }}>Loading doctors...</p>;
  }

  return (
    <div style={container}>

      <h2 style={{ marginBottom: "20px" }}>
        Doctor Verification Panel
      </h2>

      {doctors.length === 0 && (
        <p>No pending doctors 🎉</p>
      )}

      <div style={grid}>

        {doctors.map((doc) => (

          <div key={doc._id} style={card}>

            <h3 style={{ marginBottom: "5px" }}>{doc.name}</h3>
            <p style={email}>{doc.email}</p>

            <div style={section}>
              <strong>📞 Phone:</strong> {doc.phone}
            </div>

            <div style={section}>
              <strong>🏥 Specialty:</strong> {doc.specialty}
            </div>

            <div style={verifyBox}>
              <p><strong>Reg No:</strong> {doc.verificationDetails?.registrationNumber}</p>
              <p><strong>Council:</strong> {doc.verificationDetails?.councilName}</p>
              <p><strong>Degree:</strong> {doc.verificationDetails?.degree}</p>
            </div>

            <div style={buttonRow}>

              <button
                style={approveBtn}
                onClick={() => verifyDoctor(doc._id)}
              >
                Approve
              </button>

              <button
                style={rejectBtn}
                onClick={() => rejectDoctor(doc._id)}
              >
                Reject
              </button>

              <button
                style={checkBtn}
                onClick={openNMC}
              >
                Check NMC
              </button>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}

/* ================= STYLES ================= */

const container = {
  padding: "30px",
  background: "#f8fafc",
  minHeight: "100vh"
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
  gap: "20px"
};

const card = {
  background: "white",
  padding: "20px",
  borderRadius: "10px",
  boxShadow: "0 2px 10px rgba(0,0,0,0.08)"
};

const email = {
  fontSize: "13px",
  color: "#555",
  marginBottom: "10px"
};

const section = {
  marginTop: "8px",
  fontSize: "14px"
};

const verifyBox = {
  marginTop: "12px",
  padding: "10px",
  background: "#f1f5f9",
  borderRadius: "6px",
  fontSize: "14px"
};

const buttonRow = {
  marginTop: "15px",
  display: "flex",
  gap: "8px",
  flexWrap: "wrap"
};

const approveBtn = {
  background: "#16a34a",
  color: "white",
  border: "none",
  padding: "8px 12px",
  borderRadius: "6px",
  cursor: "pointer"
};

const rejectBtn = {
  background: "#dc2626",
  color: "white",
  border: "none",
  padding: "8px 12px",
  borderRadius: "6px",
  cursor: "pointer"
};

const checkBtn = {
  background: "#0ea5e9",
  color: "white",
  border: "none",
  padding: "8px 12px",
  borderRadius: "6px",
  cursor: "pointer"
};

export default AdminDashboard;