import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import symptomsByBodyPart from "../../data/symptomsByBodyPart";
import useBackRedirect from "../../hooks/useBackRedirect";
import { toast } from "react-toastify"; // ✅ ADDED

const Predict = () => {
  useBackRedirect("/patient/profile");

  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  /* --------------------
     TOGGLE SYMPTOM
  -------------------- */
  const toggleSymptom = (symptom) => {

    setResult(null);

    setSelectedSymptoms(prev =>
      prev.includes(symptom)
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    );

  };

  /* --------------------
     REMOVE SINGLE SYMPTOM
  -------------------- */
  const removeSymptom = (symptom) => {

    setResult(null);

    setSelectedSymptoms(prev =>
      prev.filter(s => s !== symptom)
    );

  };

  /* --------------------
     CLEAR ALL SYMPTOMS
  -------------------- */
  const clearAllSymptoms = () => {

    setResult(null);
    setSelectedSymptoms([]);

  };

  /* --------------------
     SUBMIT PREDICTION
  -------------------- */
  const submitPrediction = async () => {

    if (selectedSymptoms.length === 0) {
      toast.error("Please select at least one symptom");
      return;
    }

    try {

      setLoading(true);

      const token = localStorage.getItem("token");

      const res = await axios.post(
        "https://medilink-j44r.onrender.com/api/predict",
        { symptoms: selectedSymptoms },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setResult(res.data);

    } catch (err) {

      toast.error(err.response?.data?.error || "Prediction failed");

    } finally {

      setLoading(false);

    }

  };

  /* =========================
     NAVIGATE TO SEARCH DOCTORS
  ========================= */
  const goToDoctors = () => {

    const specialties =
      result?.currentAnalysis?.recommendedSpecialties?.map(
        s => s.specialty
      ) ?? [];

    console.log("Sending specialties to search:", specialties);

    navigate("/patient/search", {
      state: { specialties }
    });

  };

  /* =========================
     STEP 1 — CATEGORY PAGE
  ========================= */

  if (step === 1) {

    return (
      <div style={{ padding: "20px", maxWidth: "700px" }}>

        <h2>Disease Prediction</h2>
        <h3>Select Problem Area</h3>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          style={{ width: "100%", padding: "10px" }}
        >

          <option value="">-- Select Body Part --</option>

          {Object.keys(symptomsByBodyPart).map(category => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}

        </select>

        <br /><br />

        <button
          disabled={!selectedCategory}
          onClick={() => setStep(2)}
        >
          Next
        </button>

        {/* ================= SELECTED SYMPTOMS ================= */}

        {selectedSymptoms.length > 0 && (
          <>
            <hr />

            <h4>Symptoms selected:</h4>

            <ul>

              {selectedSymptoms.map(s => (

                <li key={s}>

                  {s}

                  <button
                    onClick={() => removeSymptom(s)}
                    style={{
                      marginLeft: "10px",
                      color: "red",
                      border: "none",
                      background: "transparent",
                      cursor: "pointer",
                      fontWeight: "bold"
                    }}
                  >
                    ❌
                  </button>

                </li>

              ))}

            </ul>

            <button
              onClick={clearAllSymptoms}
              style={{
                backgroundColor: "darkred",
                color: "white",
                padding: "6px 10px",
                marginRight: "10px",
                cursor: "pointer"
              }}
            >
              Clear All
            </button>

            <button
              onClick={submitPrediction}
              disabled={loading}
            >
              {loading ? "Analyzing..." : "Submit for Prediction"}
            </button>

          </>
        )}

        {/* =========================
           PREDICTION RESULT
        ========================= */}

        {result && (
          <>
            <hr />

            <h3>Predicted Health Problem</h3>

            {result.emergency ? (

              <p style={{ color: "red", fontWeight: "bold" }}>
                🚨 {result.message}
              </p>

            ) : (
              <>

                <h4 style={{ color: "green" }}>
                  🟢 Current Condition Analysis
                </h4>

                <p>{result.currentAnalysis?.message}</p>

                <ul>
                  {result.currentAnalysis?.topConditions?.map(c => (
                    <li key={c.condition}>
                      {c.condition} ({c.score})
                    </li>
                  ))}
                </ul>

                <h4>Recommended Doctor(s):</h4>

                <ul>
                  {result.currentAnalysis?.recommendedSpecialties?.map((s, i) => (
                    <li key={i}>{s.specialty}</li>
                  ))}
                </ul>

                {/* FIND DOCTORS BUTTON */}

                <button
                  onClick={goToDoctors}
                  style={{
                    marginTop: "10px",
                    padding: "10px 14px",
                    background: "#2563eb",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer"
                  }}
                >
                  🔎 Find Doctors
                </button>

                {/* HISTORY INSIGHTS */}

                {result.historyInsights?.riskConditions?.length > 0 && (
                  <>
                    <hr />

                    <h4 style={{ color: "#b58900" }}>
                      🟡 Health History Insights
                    </h4>

                    <p>{result.historyInsights?.message}</p>

                    <ul>
                      {result.historyInsights?.riskConditions?.map(c => (
                        <li key={c.condition}>
                          {c.condition} ({c.score})
                        </li>
                      ))}
                    </ul>

                  </>
                )}

                <p style={{ fontSize: "0.9em", color: "#555" }}>
                  ⚠️ This is not a diagnosis. Please consult a doctor for confirmation.
                </p>

              </>
            )}

            <button
              onClick={() => {
                setResult(null);
                setSelectedSymptoms([]);
                setSelectedCategory("");
              }}
            >
              🔄 Start New Prediction
            </button>

          </>
        )}

      </div>
    );

  }

  /* =========================
     STEP 2 — SYMPTOM SELECTION
  ========================= */

  return (

    <div style={{ padding: "20px", maxWidth: "700px" }}>

      <h2>{selectedCategory}</h2>

      {symptomsByBodyPart[selectedCategory].map(symptom => (

        <label key={symptom} style={{ display: "block" }}>
          <input
            type="checkbox"
            checked={selectedSymptoms.includes(symptom)}
            onChange={() => toggleSymptom(symptom)}
          />
          {" "}
          {symptom}
        </label>

      ))}

      <br />

      <button onClick={() => setStep(1)}>
        ⬅ Back
      </button>

      {" "}

      <button
        onClick={() => {
          setStep(1);
          setSelectedCategory("");
        }}
      >
        Confirm & Add More
      </button>

    </div>

  );

};

export default Predict;
