import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import useBackRedirect from "../../hooks/useBackRedirect";
import { toast } from "react-toastify";

const PLACEHOLDER = "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";

const getPhoto = (photo) => {
  if (photo && photo.trim() !== "") {
    return photo.startsWith("http")
      ? photo
      : `https://medilink-j44r.onrender.com${photo}`;
  }
  return PLACEHOLDER;
};

const container = {
  padding: "40px",
  background: "#f8fafc",
  minHeight: "100vh"
};

const card = {
  background: "white",
  padding: "30px",
  borderRadius: "10px",
  boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
  maxWidth: "900px",
  margin: "auto"
};

const header = {
  display: "flex",
  gap: "30px",
  alignItems: "center"
};

const imgStyle = {
  width: "120px",
  height: "120px",
  borderRadius: "50%",
  objectFit: "cover"
};

const nameStyle = {
  fontSize: "24px",
  fontWeight: "600"
};

const specialtyStyle = {
  color: "#555",
  marginTop: "5px"
};

const infoRow = {
  marginTop: "10px",
  fontSize: "15px"
};

const aboutBox = {
  marginTop: "25px",
  padding: "15px",
  background: "#f1f5f9",
  borderRadius: "8px"
};

const dayRow = {
  marginBottom: "12px"
};

const slot = {
  display: "inline-block",
  background: "#e0f2fe",
  padding: "6px 10px",
  borderRadius: "6px",
  marginRight: "8px",
  marginBottom: "5px",
  fontSize: "14px"
};

const buttonStyle = {
  marginTop: "25px",
  padding: "10px 16px",
  border: "none",
  borderRadius: "6px",
  background: "#2563eb",
  color: "white",
  cursor: "pointer",
  fontSize: "15px"
};

const DoctorProfile = () => {

  const { id } = useParams();

  const [doctor, setDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const res = await axios.get(
          `https://medilink-j44r.onrender.com/api/doctors/${id}`
        );
        setDoctor(res.data);
      } catch (err) {
        toast.error("Failed to fetch doctor profile");
        console.log(err);
      }
    };

    fetchDoctor();
  }, [id]);

  const normalizeDate = (d) => new Date(d).setHours(0,0,0,0);

  const weekly = doctor?.availability?.weekly || {};
  const overrides = doctor?.availability?.overrides || [];

  const getNext7Days = () => {
    const days = [];

    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);

      days.push({
        date: d,
        dayName: d.toLocaleDateString("en-US", { weekday: "long" }),
        key: d.toISOString().split("T")[0]
      });
    }

    return days;
  };

  const next7Days = getNext7Days();

  const getSlotsForDate = (dateObj) => {
    const selected = normalizeDate(dateObj.date);

    const dayKey = dateObj.dayName.toLowerCase();
    const weeklySlots = weekly[dayKey] || [];

    const matchedOverrides = overrides.filter(o => {
      if (!o.from || !o.to) return false;

      const start = normalizeDate(o.from);
      const end = normalizeDate(o.to);

      return selected >= start && selected <= end;
    });

    let overrideSlots = [];

    matchedOverrides.forEach(o => {
      overrideSlots = [...overrideSlots, ...(o.slots || [])];
    });

    const allSlots = [...weeklySlots, ...overrideSlots];

    const uniqueSlots = [];
    const seen = new Set();

    allSlots.forEach(s => {
      const key = `${s.start}-${s.end}`;
      if (!seen.has(key)) {
        seen.add(key);
        uniqueSlots.push(s);
      }
    });

    return uniqueSlots;
  };

  const bookAppointment = async () => {
    if (!selectedDate || !selectedTime) {
      toast.error("Please select date and time");
      return;
    }

    try {
      const token = localStorage.getItem("patientToken");

      await axios.post(
        "https://medilink-j44r.onrender.com/api/appointments/request",
        {
          doctorId: doctor._id,
          date: selectedDate,
          slotTime: selectedTime
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      toast.success("Appointment request sent!");

    } catch (err) {
      console.log(err);
      toast.error(err.response?.data?.message || "Error booking appointment");
    }
  };

  if (!doctor) {
    return <p style={{ padding: "40px" }}>Loading doctor profile...</p>;
  }

  return (
    <div style={container}>
      <div style={card}>

        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "30px"
        }}>

          <div style={header}>
            {/* ✅ CHANGED — same photo logic as SearchDoctors.jsx */}
            <img
              src={getPhoto(doctor.photo)}
              alt="doctor"
              style={imgStyle}
              onError={(e) => { e.target.src = PLACEHOLDER; }}
            />

            <div>
              <div style={nameStyle}>{doctor.name}</div>
              <div style={specialtyStyle}>{doctor.specialty}</div>
              <div style={infoRow}>⭐ {doctor.rating || 4}</div>
              <div style={infoRow}>💰 ₹ {doctor.consultationFee}</div>
              <div style={infoRow}>
                📍 {doctor.address?.street}, {doctor.address?.area}, {doctor.address?.city}
              </div>
              <div style={infoRow}>💻 Mode: {doctor.mode}</div>
              <div style={infoRow}>👤 Gender: {doctor.gender}</div>
            </div>
          </div>

          <div style={{ width: "320px" }}>
            <h3>Availability This Week</h3>

            {next7Days.map((d, idx) => {
              const slots = getSlotsForDate(d);

              return (
                <div key={idx} style={dayRow}>

                  <strong>{d.dayName}</strong>

                  <div style={{ fontSize: "12px", color: "#666" }}>
                    {d.date.toLocaleDateString()}
                  </div>

                  <div style={{ marginTop: "5px" }}>
                    {slots.length > 0 ? (
                      slots.map((s, i) => (
                        <span key={i} style={slot}>
                          {s.start} - {s.end}
                        </span>
                      ))
                    ) : (
                      <span style={{ fontSize: "13px", color: "#999" }}>
                        Not available
                      </span>
                    )}
                  </div>

                </div>
              );
            })}
          </div>

        </div>

        {doctor.about && (
          <div style={aboutBox}>
            <h3>About Doctor</h3>
            <p>{doctor.about}</p>
          </div>
        )}

        <div style={{ marginTop: "20px" }}>
          <label>Select Date:</label>
          <input
            type="date"
            min={today}
            value={selectedDate}
            onChange={(e) => {
              setSelectedDate(e.target.value);
              setSelectedTime("");
            }}
            style={{ marginLeft: "10px" }}
          />
        </div>

        {selectedDate && (
          <div style={{ marginTop: "25px" }}>
            <h3>Select Slot</h3>

            {getSlotsForDate({
              date: new Date(selectedDate),
              dayName: new Date(selectedDate).toLocaleDateString("en-US",{weekday:"long"})
            }).map((s, i) => {

              const slotValue = `${s.start}-${s.end}`;

              return (
                <span
                  key={i}
                  style={{
                    ...slot,
                    cursor: "pointer",
                    background:
                      selectedTime === slotValue ? "#2563eb" : "#e0f2fe",
                    color:
                      selectedTime === slotValue ? "white" : "black"
                  }}
                  onClick={() => setSelectedTime(slotValue)}
                >
                  {s.start} - {s.end}
                </span>
              );
            })}
          </div>
        )}

        <button style={buttonStyle} onClick={bookAppointment}>
          Book Appointment
        </button>

      </div>
    </div>
  );
};

export default DoctorProfile;
