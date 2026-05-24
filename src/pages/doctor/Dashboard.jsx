import React, { useEffect, useState } from "react";
import axios from "axios";
import useBackRedirect from "../../hooks/useBackRedirect";
import { toast } from "react-toastify"; // ✅ ADDED

const Dashboard = () => {
  useBackRedirect("/doctor/profile", true);

  const [stats, setStats] = useState({
    today: 0,
    total: 0,
    pending: 0,
    approved: 0,
    completed: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const fetchAppointments = async () => {

      try {

        const token = localStorage.getItem("doctorToken");

        if (!token) {
          window.location.href = "/doctor/login";
          return;
        }

        const res = await axios.get(
          "https://medilink-j44r.onrender.com/api/doctor-profile/appointments",
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        const data = res.data || [];

        const todayDate = new Date().toDateString();

        setStats({
          total: data.length,
          pending: data.filter((a) => a.status === "pending").length,
          approved: data.filter((a) => a.status === "approved").length,
          completed: data.filter((a) => a.status === "completed").length,
          today: data.filter(
            (a) => new Date(a.date).toDateString() === todayDate
          ).length
        });

      } catch (error) {

        console.error(error);

        // ✅ SHOW ERROR TOAST
        toast.error("Failed to load dashboard data");

        if (error.response?.status === 401) {
          localStorage.removeItem("doctorToken");
          localStorage.removeItem("doctorData");
          window.location.href = "/doctor/login";
        }

      } finally {
        setLoading(false);
      }

    };

    fetchAppointments();

  }, []);

  if (loading) return <p>Loading dashboard...</p>;

  return (

    <div style={{ padding: "30px" }}>

      <h2>Doctor Dashboard</h2>

      <div style={{
        display: "flex",
        gap: "20px",
        marginTop: "30px",
        flexWrap: "wrap"
      }}>

        <Card title="Today's Appointments" value={stats.today} />
        <Card title="Total Appointments" value={stats.total} />
        <Card title="Pending" value={stats.pending} />
        <Card title="Approved" value={stats.approved} />
        <Card title="Completed" value={stats.completed} />

      </div>

    </div>

  );
};

const Card = ({ title, value }) => (

  <div
    style={{
      padding: "20px",
      borderRadius: "10px",
      background: "#f3f4f6",
      minWidth: "180px",
      textAlign: "center",
      boxShadow: "0 3px 8px rgba(0,0,0,0.1)"
    }}
  >
    <h2 style={{ margin: 0 }}>{value}</h2>
    <p style={{ marginTop: "10px" }}>{title}</p>
  </div>

);

export default Dashboard;
