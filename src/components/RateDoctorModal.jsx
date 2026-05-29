import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

function RateDoctorModal({ appointment, closeModal }) {
  const token = localStorage.getItem("patientToken");
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");

  const submitRating = async () => {
    if (!rating) {
      toast.error("Please select rating");
      return;
    }
    try {
      await axios.post(
        `https://medilink-j44r.onrender.com/api/appointments/${appointment._id}/rate`,
        { rating, review },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Thank you for rating the doctor!");
      closeModal();
    } catch (err) {
      console.error(err);
      toast.error("Error submitting rating");
    }
  };

  return (
    <div style={{
      position: "fixed",
      top: 0, left: 0, right: 0, bottom: 0,
      background: "rgba(0,0,0,0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}>
      <div style={{
        background: "white",
        padding: "30px",
        borderRadius: "8px",
        width: "350px"
      }}>
        <h3>Rate Your Doctor</h3>
        <p>Select Rating (1-5)</p>
        <input
          type="number"
          min="1"
          max="5"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          style={{ width: "100%", marginBottom: "10px" }}
        />
        <textarea
          placeholder="Write review (optional)"
          value={review}
          onChange={(e) => setReview(e.target.value)}
          style={{ width: "100%", height: "70px" }}
        />
        <br /><br />
        <button
          onClick={submitRating}
          style={{
            padding: "10px 20px",
            background: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "5px"
          }}
        >
          Submit Rating
        </button>
      </div>
    </div>
  );
}

export default RateDoctorModal;
