import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import axios from "axios";
import useBackRedirect from "../../hooks/useBackRedirect";
import { toast } from "react-toastify"; // ✅ ADDED

function DoctorCalendar() {
  useBackRedirect("/doctor/profile");

  const [date, setDate] = useState(new Date());
  const [appointments, setAppointments] = useState([]);
  const [selectedDayAppointments, setSelectedDayAppointments] = useState([]);

  const token = localStorage.getItem("doctorToken");

  useEffect(() => {
    const fetchAppointments = async () => {
      try {

        const res = await axios.get(
          "http://localhost:5000/api/doctor-appointments/appointments/calendar",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setAppointments(res.data);

      } catch (err) {
        console.error("Error fetching appointments:", err);
        toast.error("Failed to load calendar data"); // ✅ CHANGED
      }
    };

    fetchAppointments();
  }, [token]);

  const handleDateChange = (selectedDate) => {
    setDate(selectedDate);

    const filtered = appointments.filter((appt) => {
      return (
        new Date(appt.date).toDateString() ===
        selectedDate.toDateString()
      );
    });

    setSelectedDayAppointments(filtered);
  };

  // Mark days that have appointments
  const tileClassName = ({ date, view }) => {

    if (view === "month") {

      const hasAppointment = appointments.some((appt) => {
        return (
          new Date(appt.date).toDateString() ===
          date.toDateString()
        );
      });

      if (hasAppointment) {
        return "appointment-day";
      }
    }

  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Doctor Calendar</h2>

      {/* CSS inside component */}
      <style>
        {`
          .appointment-day {
            background-color: #ff4d4f !important;
            color: white !important;
            font-weight: bold;
            border-radius: 8px;
          }

          .appointment-day:hover {
            background-color: #d9363e !important;
          }
        `}
      </style>

      <Calendar
        onChange={handleDateChange}
        value={date}
        tileClassName={tileClassName}
      />

      <div style={{ marginTop: "20px" }}>
        <h3>Appointments on {date.toDateString()}</h3>

        {selectedDayAppointments.length === 0 ? (
          <p>No confirmed appointments</p>
        ) : (
          selectedDayAppointments.map((appt) => (
            <div
              key={appt._id}
              style={{
                padding: "10px",
                marginBottom: "10px",
                background: "#f3f4f6",
                borderRadius: "6px"
              }}
            >
              <p><strong>Patient:</strong> {appt.patient?.name}</p>
              <p><strong>Time:</strong> {appt.slotTime}</p>
              <p><strong>Status:</strong> {appt.status}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default DoctorCalendar;