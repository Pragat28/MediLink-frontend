import React, { useEffect, useState } from "react";
import axios from "axios";
import useBackRedirect from "../../hooks/useBackRedirect";
import { toast } from "react-toastify";

const daysOfWeek = [
  "monday","tuesday","wednesday","thursday","friday","saturday","sunday",
];

const inputStyle = {
  padding: "10px",
  marginRight: "12px",
  marginTop: "10px",
  border: "1px solid #d1d5db",
  borderRadius: "6px",
  fontSize: "14px",
  width: "250px"
};

const primaryButton = {
  padding: "8px 14px",
  borderRadius: "6px",
  border: "none",
  background: "#1f2937",
  color: "white",
  cursor: "pointer",
  marginTop: "10px",
};

const dangerButton = {
  ...primaryButton,
  background: "#dc2626",
};

const sectionTitle = {
  fontSize: "20px",
  fontWeight: "600",
  marginTop: "40px",
  marginBottom: "10px",
};

const labelStyle = {
  display: "block",
  marginTop: "15px",
  fontWeight: "500"
};

const Profile = () => {
  useBackRedirect(null, true);
  const [doctor,setDoctor] = useState(null);
  const [loading,setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(()=>{

    const fetchProfile = async()=>{

      try{
        const token = localStorage.getItem("doctorToken");

        const res = await axios.get(
          "https://medilink-j44r.onrender.com/api/doctor-profile/me",
          { headers:{ Authorization:`Bearer ${token}` } }
        );

        const data = res.data;

        setDoctor({
          ...data,
          gender: data.gender || "",
          about: data.about || "",
          address: data.address || { street:"", area:"" },
          availability: data.availability || { weekly:{}, overrides:[] }
        });

        const hasSlots = Object.values(data.availability?.weekly || {})
          .some(day => day && day.length > 0);

        if (!hasSlots) {
          setShowPopup(true);
        }

      }catch(err){
        console.error(err);
      }

    };

    fetchProfile();

  },[]);

  const handleChange = (e)=>{
    setDoctor({
      ...doctor,
      [e.target.name]: e.target.value
    });
  };

  const handleAddressChange = (field,value)=>{
    setDoctor({
      ...doctor,
      address:{
        ...doctor.address,
        [field]:value
      }
    });
  };

  /* ================= WEEKLY SLOTS ================= */

  const handleSlotChange = (day,index,field,value)=>{
    const updated = { ...doctor.availability.weekly };
    updated[day][index][field] = value;

    setDoctor({
      ...doctor,
      availability:{
        ...doctor.availability,
        weekly:updated
      }
    });
  };

  const addSlot = (day)=>{
    const updated = { ...doctor.availability.weekly };

    if(!updated[day]) updated[day] = [];

    updated[day].push({ start:"", end:"", maxPatients:1, mode:"online" });

    setDoctor({
      ...doctor,
      availability:{
        ...doctor.availability,
        weekly:updated
      }
    });
  };

  const removeSlot = (day,index)=>{
    const updated = { ...doctor.availability.weekly };
    updated[day].splice(index,1);

    setDoctor({
      ...doctor,
      availability:{
        ...doctor.availability,
        weekly:updated
      }
    });
  };

  /* ================= OVERRIDES ================= */

  const addSpecialAvailability = ()=>{
    const ranges = doctor.availability.overrides || [];

    ranges.push({
      from:"",
      to:"",
      slots:[{start:"", end:"", maxPatients:1, mode:"online"}]
    });

    setDoctor({
      ...doctor,
      availability:{
        ...doctor.availability,
        overrides:ranges
      }
    });
  };

  const handleRangeChange = (index,field,value)=>{
    const ranges = [...doctor.availability.overrides];
    ranges[index][field] = value ? new Date(value).toISOString() : "";

    setDoctor({
      ...doctor,
      availability:{
        ...doctor.availability,
        overrides:ranges
      }
    });
  };

  const handleRangeSlotChange = (rIndex,sIndex,field,value)=>{
    const ranges = [...doctor.availability.overrides];
    ranges[rIndex].slots[sIndex][field] = value;

    setDoctor({
      ...doctor,
      availability:{
        ...doctor.availability,
        overrides:ranges
      }
    });
  };

  const addRangeSlot = (rIndex)=>{
    const ranges = [...doctor.availability.overrides];
    ranges[rIndex].slots.push({start:"", end:"", maxPatients:1, mode:"online"});

    setDoctor({
      ...doctor,
      availability:{
        ...doctor.availability,
        overrides:ranges
      }
    });
  };

  const removeRange = (index)=>{
    const ranges = [...doctor.availability.overrides];
    ranges.splice(index,1);

    setDoctor({
      ...doctor,
      availability:{
        ...doctor.availability,
        overrides:ranges
      }
    });
  };

  const removeRangeSlot = (rIndex,sIndex)=>{
    const ranges = [...doctor.availability.overrides];
    ranges[rIndex].slots.splice(sIndex,1);

    setDoctor({
      ...doctor,
      availability:{
        ...doctor.availability,
        overrides:ranges
      }
    });
  };

  const handleSave = async()=>{
    setLoading(true);

    const token = localStorage.getItem("doctorToken");

    try {

      const cleanedDoctor = {
        ...doctor,
        availability: {
          ...doctor.availability,
          overrides: (doctor.availability.overrides || []).map(r => ({
            ...r,
            from: r.from || null,
            to: r.to || null,
            slots: (r.slots || []).filter(s => s.start && s.end)
          }))
        }
      };

      const res = await axios.put(
        "https://medilink-j44r.onrender.com/api/doctor-profile/me",
        cleanedDoctor,
        { headers:{ Authorization:`Bearer ${token}` } }
      );

      setDoctor(res.data.doctor);
      toast.success("Profile updated successfully");

    } catch (err) {

      console.error("SAVE ERROR:", err.response?.data || err);
      toast.error(err.response?.data?.message || "Failed to save profile");

    } finally {
      setLoading(false);
    }
  };

  if(!doctor) return <p style={{padding:"30px"}}>Loading...</p>;

  return(

    <div style={{
      maxWidth:"950px",
      margin:"auto",
      padding:"50px",
      background:"#fff",
      borderRadius:"12px",
      boxShadow:"0 4px 20px rgba(0,0,0,0.08)"
    }}>

      {showPopup && (
        <div style={{
          background:"#fee2e2",
          color:"#991b1b",
          padding:"12px",
          marginBottom:"20px",
          borderRadius:"8px"
        }}>
          ⚠️ Please complete your slot timings. Without availability, patients cannot see your profile.
          <br/>
          <button
            style={{ marginTop:"8px" }}
            onClick={()=>setShowPopup(false)}
          >
            OK
          </button>
        </div>
      )}

      <h2>Doctor Profile</h2>

      <div style={sectionTitle}>Basic Information</div>

      <input style={inputStyle} name="name" value={doctor.name || ""} onChange={handleChange} placeholder="Full Name"/>
      <input style={inputStyle} value={doctor.email || ""} disabled/>
      <input style={inputStyle} name="phone" value={doctor.phone || ""} onChange={handleChange} placeholder="Phone"/>
      <input style={inputStyle} name="specialty" value={doctor.specialty || ""} onChange={handleChange} placeholder="Specialty"/>

      <select style={inputStyle} name="gender" value={doctor.gender} onChange={handleChange}>
        <option value="">Select Gender</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
        <option value="other">Other</option>
      </select>

      <div style={sectionTitle}>About Doctor</div>

      <label style={labelStyle}>Write a short description about yourself</label>

      <textarea
        style={{...inputStyle,width:"520px",height:"140px"}}
        name="about"
        value={doctor.about}
        onChange={handleChange}
        placeholder="Example: Experienced cardiologist..."
      />

      <div style={sectionTitle}>Clinic Address</div>

      <input
        style={inputStyle}
        placeholder="Street (e.g. Building, Road)"
        value={doctor.address.street || ""}
        onChange={(e)=>handleAddressChange("street",e.target.value)}
      />

      <input
        style={inputStyle}
        placeholder="Area (e.g. Andheri West)"
        value={doctor.address.area || ""}
        onChange={(e)=>handleAddressChange("area",e.target.value)}
      />

      <div style={sectionTitle}>Weekly Availability</div>

      {daysOfWeek.map(day=>(
        <div key={day}>
          <b>{day}</b>

          {(doctor.availability.weekly?.[day] || []).map((slot,index)=>(
            <div key={index} style={{ display: "flex", gap: "12px", alignItems: "flex-end", flexWrap: "wrap" }}>

              <div>
                <label style={{ fontSize: "12px", color: "#6b7280" }}>Start Time</label>
                <input
                  type="time"
                  style={inputStyle}
                  value={slot.start}
                  onChange={(e)=>handleSlotChange(day,index,"start",e.target.value)}
                />
              </div>

              <div>
                <label style={{ fontSize: "12px", color: "#6b7280" }}>End Time</label>
                <input
                  type="time"
                  style={inputStyle}
                  value={slot.end}
                  onChange={(e)=>handleSlotChange(day,index,"end",e.target.value)}
                />
              </div>

              <div>
                <label style={{ fontSize: "12px", color: "#6b7280" }}>Max Patients</label>
                <input
                  type="number"
                  min="1"
                  style={inputStyle}
                  value={slot.maxPatients || 1}
                  onChange={(e)=>handleSlotChange(day,index,"maxPatients",e.target.value)}
                />
              </div>

              <div>
                <label style={{ fontSize: "12px", color: "#6b7280" }}>Mode</label>
                <select
                  style={inputStyle}
                  value={slot.mode || "online"}
                  onChange={(e)=>handleSlotChange(day,index,"mode",e.target.value)}
                >
                  <option value="online">Online</option>
                  <option value="offline">Offline</option>
                </select>
              </div>

              <button style={dangerButton} onClick={()=>removeSlot(day,index)}>
                Remove
              </button>

            </div>
          ))}

          <button style={primaryButton} onClick={()=>addSlot(day)}>Add Slot</button>
        </div>
      ))}

      <div style={sectionTitle}>Special Timings</div>

      {(doctor.availability.overrides || []).map((range,index)=>(
        <div key={index} style={{border:"1px solid #e5e7eb",padding:"20px",borderRadius:"10px",marginBottom:"20px"}}>

          <input type="date" style={inputStyle}
            value={range.from ? range.from.substring(0,10) : ""}
            onChange={(e)=>handleRangeChange(index,"from",e.target.value)}
          />

          <input type="date" style={inputStyle}
            value={range.to ? range.to.substring(0,10) : ""}
            onChange={(e)=>handleRangeChange(index,"to",e.target.value)}
          />

          {(range.slots || []).map((slot,sIndex)=>(
            <div key={sIndex} style={{ display: "flex", gap: "12px", alignItems: "flex-end", flexWrap: "wrap" }}>
              <input type="time" style={inputStyle} value={slot.start}
                onChange={(e)=>handleRangeSlotChange(index,sIndex,"start",e.target.value)}/>
              <input type="time" style={inputStyle} value={slot.end}
                onChange={(e)=>handleRangeSlotChange(index,sIndex,"end",e.target.value)}/>

              <input
                type="number"
                min="1"
                style={inputStyle}
                value={slot.maxPatients || 1}
                onChange={(e)=>handleRangeSlotChange(index,sIndex,"maxPatients",e.target.value)}
                placeholder="Max Patients"
              />

              <select
                style={inputStyle}
                value={slot.mode || "online"}
                onChange={(e)=>handleRangeSlotChange(index,sIndex,"mode",e.target.value)}
              >
                <option value="online">Online</option>
                <option value="offline">Offline</option>
              </select>

              <button style={dangerButton} onClick={()=>removeRangeSlot(index,sIndex)}>Remove Slot</button>
            </div>
          ))}

          <button style={primaryButton} onClick={()=>addRangeSlot(index)}>Add Slot</button>
          <br/>
          <button style={dangerButton} onClick={()=>removeRange(index)}>Remove Date Range</button>
        </div>
      ))}

      <button style={primaryButton} onClick={addSpecialAvailability}>
        Add Special Availability
      </button>

      <br/><br/>

      <button style={primaryButton} onClick={handleSave} disabled={loading}>
        {loading ? "Saving..." : "Save Changes"}
      </button>

    </div>
  );
};

export default Profile;
