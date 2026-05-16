import React from "react";
import { useNavigate } from "react-router-dom";

const PatientDashboard = () => {
  const navigate = useNavigate();

  return (
    <div style={{ padding: "20px" }}>
      <h1>Patient Dashboard</h1>

      <p>You are logged in successfully ✅</p>

      <button onClick={() => navigate("/patient/predict")}>
        Predict Disease
      </button>

      <br /><br />

      <button onClick={() => navigate("/patient/search")}>
        Search Doctors
      </button>

      <br /><br />

      <button onClick={() => navigate("/patient/appointments")}>
        My Appointments
      </button>
    </div>
  );
};

export default PatientDashboard;