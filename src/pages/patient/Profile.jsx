import { useEffect, useState } from "react";
import axios from "axios";
import useBackRedirect from "../../hooks/useBackRedirect";
import { toast } from "react-toastify"; // ✅ ADDED

function PatientProfile() {
  useBackRedirect("/patient/profile");

  const token = localStorage.getItem("patientToken");

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    age: "",
    gender: "",
    height: "",
    weight: "",
    bloodGroup: "",
    contactNumber: "",
    birthDate: "",
    pastSurgeriesMedicalComplications: "",
    chronicDiseases: "",
    allergies: "",
    medications: "",
    isPregnant: false,
    pregnancyMonths: "",
    numberOfKids: "",
    lastPregnancyYear: ""
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {

      const res = await axios.get(
        "http://localhost:5000/api/patient/profile",
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setProfile({
        ...res.data,
        birthDate: res.data.birthDate
          ? res.data.birthDate.split("T")[0]
          : "",
        pastSurgeriesMedicalComplications:
          res.data.pastSurgeriesMedicalComplications?.join(", ") || "",
        chronicDiseases:
          res.data.chronicDiseases?.join(", ") || "",
        allergies:
          res.data.allergies?.join(", ") || "",
        medications:
          res.data.medications
            ?.map(m => `${m.name}-${m.dosage}`)
            .join(", ") || "",
        pregnancyMonths: res.data.pregnancyMonths || "",
        numberOfKids: res.data.numberOfKids || "",
        lastPregnancyYear: res.data.lastPregnancyYear || ""
      });

    } catch (err) {
      console.error("Error fetching profile", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const saveProfile = async () => {

    try {

      const dataToSend = {
        ...profile,

        pastSurgeriesMedicalComplications:
          profile.pastSurgeriesMedicalComplications
            .split(",")
            .map(item => item.trim()),

        chronicDiseases:
          profile.chronicDiseases
            .split(",")
            .map(item => item.trim()),

        allergies:
          profile.allergies
            .split(",")
            .map(item => item.trim()),

        medications:
          profile.medications
            .split(",")
            .map(m => {
              const parts = m.split("-");
              return {
                name: parts[0]?.trim(),
                dosage: parts[1]?.trim()
              };
            })
      };

      await axios.put(
        "http://localhost:5000/api/patient/profile",
        dataToSend,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      toast.success("Profile updated successfully");

      fetchProfile();

    } catch (err) {
      console.error("Error updating profile", err);
    }
  };

  const inputStyle = {
    padding: "8px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    width: "100%"
  };

  const rowStyle = {
    display: "flex",
    gap: "20px",
    marginBottom: "20px"
  };

  const cardStyle = {
    background: "white",
    padding: "25px",
    borderRadius: "8px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
    marginBottom: "25px"
  };

  return (
    <div style={{ maxWidth: "900px", margin: "auto", padding: "30px" }}>

      <h2 style={{ marginBottom: "30px" }}>Patient Profile</h2>

      {/* BASIC INFO */}
      <div style={cardStyle}>

        <div style={rowStyle}>
          <div style={{ flex: 1 }}>
            <label>Name</label>
            <input
              style={inputStyle}
              name="name"
              value={profile.name}
              onChange={handleChange}
            />
          </div>

          <div style={{ flex: 1 }}>
            <label>Email</label>
            <input
              style={inputStyle}
              value={profile.email}
              disabled
            />
          </div>
        </div>

        <div style={rowStyle}>
          <div style={{ flex: 1 }}>
            <label>Contact Number</label>
            <input
              style={inputStyle}
              name="contactNumber"
              value={profile.contactNumber || ""}
              onChange={handleChange}
            />
          </div>

          <div style={{ flex: 1 }}>
            <label>Date of Birth</label>
            <input
              style={inputStyle}
              type="date"
              name="birthDate"
              value={profile.birthDate || ""}
              onChange={handleChange}
            />
          </div>
        </div>

        <div style={rowStyle}>
          <div style={{ flex: 1 }}>
            <label>Age</label>
            <input
              style={inputStyle}
              type="number"
              name="age"
              value={profile.age || ""}
              onChange={handleChange}
            />
          </div>

          <div style={{ flex: 1 }}>
            <label>Gender</label>
            <select
              style={inputStyle}
              name="gender"
              value={profile.gender || ""}
              onChange={handleChange}
            >
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
        </div>

        <div style={rowStyle}>
          <div style={{ flex: 1 }}>
            <label>Height (cm)</label>
            <input
              style={inputStyle}
              type="number"
              name="height"
              value={profile.height || ""}
              onChange={handleChange}
            />
          </div>

          <div style={{ flex: 1 }}>
            <label>Weight (kg)</label>
            <input
              style={inputStyle}
              type="number"
              name="weight"
              value={profile.weight || ""}
              onChange={handleChange}
            />
          </div>
        </div>

        <div style={rowStyle}>
          <div style={{ flex: 1 }}>
            <label>Blood Group</label>
            <select
              style={inputStyle}
              name="bloodGroup"
              value={profile.bloodGroup || ""}
              onChange={handleChange}
            >
              <option value="">Select</option>
              <option>A+</option>
              <option>A-</option>
              <option>B+</option>
              <option>B-</option>
              <option>O+</option>
              <option>O-</option>
              <option>AB+</option>
              <option>AB-</option>
            </select>
          </div>
        </div>

        {/* Pregnancy Section */}
        {profile.gender === "female" && (
          <div style={{ marginTop: "15px" }}>

            <label>
              <input
                type="checkbox"
                checked={profile.isPregnant}
                onChange={(e) =>
                  setProfile(prev => ({
                    ...prev,
                    isPregnant: e.target.checked
                  }))
                }
              />
              {" "}Currently Pregnant
            </label>

            {profile.isPregnant && (
              <div style={{ marginTop: "15px" }}>
                <label>Pregnancy Months</label>
                <input
                  style={inputStyle}
                  type="number"
                  name="pregnancyMonths"
                  value={profile.pregnancyMonths || ""}
                  onChange={handleChange}
                />
              </div>
            )}

            <div style={{ marginTop: "15px" }}>
              <label>Number of Kids</label>
              <input
                style={inputStyle}
                type="number"
                name="numberOfKids"
                value={profile.numberOfKids || ""}
                onChange={handleChange}
              />
            </div>

            {profile.numberOfKids > 0 && (
              <div style={{ marginTop: "15px" }}>
                <label>Last Pregnancy Year</label>
                <input
                  style={inputStyle}
                  type="number"
                  name="lastPregnancyYear"
                  value={profile.lastPregnancyYear || ""}
                  onChange={handleChange}
                />
              </div>
            )}

          </div>
        )}

      </div>

      {/* PAST SURGERIES */}
      <div style={cardStyle}>
        <h3>Past Surgeries / Medical Complications</h3>
        <textarea
          style={{ ...inputStyle, height: "80px" }}
          name="pastSurgeriesMedicalComplications"
          value={profile.pastSurgeriesMedicalComplications || ""}
          onChange={handleChange}
        />
      </div>

      {/* CHRONIC DISEASES */}
      <div style={cardStyle}>
        <h3>Chronic Diseases</h3>
        <textarea
          style={{ ...inputStyle, height: "80px" }}
          name="chronicDiseases"
          value={profile.chronicDiseases || ""}
          onChange={handleChange}
        />
      </div>

      {/* ALLERGIES */}
      <div style={cardStyle}>
        <h3>Allergies</h3>
        <textarea
          style={{ ...inputStyle, height: "80px" }}
          name="allergies"
          value={profile.allergies || ""}
          onChange={handleChange}
        />
      </div>

      {/* MEDICATIONS */}
      <div style={cardStyle}>
        <h3>Medications</h3>
        <textarea
          style={{ ...inputStyle, height: "80px" }}
          name="medications"
          value={profile.medications || ""}
          onChange={handleChange}
          placeholder="Example: Paracetamol-500mg, Insulin-10units"
        />
      </div>

      <button
        onClick={saveProfile}
        style={{
          padding: "12px 25px",
          background: "#2563eb",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          fontSize: "15px"
        }}
      >
        Save Profile
      </button>

    </div>
  );
}

export default PatientProfile;