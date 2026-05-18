import React, { useEffect, useRef, useState, useCallback } from "react";
import api from "../../api/axios";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import useBackRedirect from "../../hooks/useBackRedirect";
import { toast } from "react-toastify";

const specialties = [
  "General Physician", "Cardiologist", "Neurologist", "ENT Specialist",
  "Pulmonologist", "Allergist", "Vascular Specialist", "Gastroenterologist",
  "Endocrinologist", "Orthopedic", "Dermatologist", "Psychiatrist",
  "Nephrologist", "Gynecologist", "Pediatrician"
];

// ─── Styles ────────────────────────────────────────────────────────────────
const container   = { display:"flex", gap:"30px", background:"#f8fafc", padding:"30px", minHeight:"100vh", alignItems:"flex-start" };
const sidebar     = { width:"260px", background:"white", padding:"20px", borderRadius:"10px", boxShadow:"0 2px 10px rgba(0,0,0,0.05)", height:"fit-content", position:"sticky", top:"30px", flexShrink:0 };
const results     = { flex:1 };
const inputStyle  = { width:"100%", padding:"8px", marginBottom:"15px", borderRadius:"6px", border:"1px solid #ddd" };
const doctorCard  = { display:"flex", gap:"20px", background:"white", padding:"15px", borderRadius:"10px", marginBottom:"15px", boxShadow:"0 2px 10px rgba(0,0,0,0.05)" };
const imgStyle    = { width:"90px", height:"90px", borderRadius:"50%", objectFit:"cover" };
const cardContent = { flex:1 };
const topRow      = { display:"flex", alignItems:"center", gap:"15px", flexWrap:"wrap" };
const nameStyle   = { fontSize:"18px", fontWeight:"600" };
const ratingStyle = { fontWeight:"500", color:"#f59e0b" };
const feeStyle    = { fontWeight:"600", color:"#2563eb" };
const addressStyle = { marginTop:"5px", color:"#555" };
const slotStyle   = { marginTop:"5px", color:"#16a34a", fontSize:"14px" };
const buttonStyle = { marginTop:"10px", padding:"8px 12px", border:"none", borderRadius:"6px", background:"#2563eb", color:"white", cursor:"pointer" };

// ─── Component ─────────────────────────────────────────────────────────────
const SearchDoctors = () => {
  useBackRedirect("/patient/profile");

  const location     = useLocation();
  const navigate     = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // FIX 1 ─ Stabilise predictedSpecialties with a ref so it never causes
  //          re-renders. location.state gives a fresh array reference every
  //          render; putting it in a ref makes the identity stable.
  const predictedSpecialtiesRef = useRef(location.state?.specialties || []);
  const predictedSpecialties    = predictedSpecialtiesRef.current;

  const [doctors, setDoctors] = useState([]);
  const [areas,   setAreas]   = useState([]);
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({
    area:       searchParams.get("area")        || "",
    specialty:  searchParams.get("specialty")   || "",
    maxFee:     searchParams.get("maxFee")      || "",
    rating:     searchParams.get("rating")      || "",
    experience: searchParams.get("experience")  || "",
    mode:       searchParams.get("mode")        || "",
    gender:     searchParams.get("gender")      || "",
    startTime:  searchParams.get("startTime")   || "",
    endTime:    searchParams.get("endTime")     || "",
  });

  // ── Sync filters → URL (guarded to prevent infinite loop) ────────────────
  useEffect(() => {
    const params = {};
    Object.keys(filters).forEach((k) => { if (filters[k]) params[k] = filters[k]; });
    const current = Object.fromEntries(searchParams);
    if (JSON.stringify(params) !== JSON.stringify(current)) setSearchParams(params);
  }, [filters]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Fetch available areas (runs once on mount) ────────────────────────────
  useEffect(() => {
    let cancelled = false;
    const fetchAreas = async () => {
      try {
        const res = await api.get("/doctors/filters", {
          params: predictedSpecialties.length
            ? { specialties: predictedSpecialties.join(",") }
            : {},
        });
        if (!cancelled) setAreas(res.data?.areas || []);
      } catch (err) {
        if (!cancelled && err.response) toast.error("Failed to fetch areas");
      }
    };
    fetchAreas();
    return () => { cancelled = true; };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  //          ^ empty deps: areas only depend on predictedSpecialties which is
  //            stable (ref). No need to re-fetch on every filter change.

  // ── Fetch doctors (debounced + abortable) ────────────────────────────────
  // FIX 2 ─ Debounce by 400 ms so rapid keystrokes (maxFee field, etc.) don't
  //          each fire a separate request.
  // FIX 3 ─ AbortController cancels the previous in-flight request before
  //          starting a new one, eliminating the stale-response error storm.
  const abortRef = useRef(null);

  const fetchDoctors = useCallback(async (currentFilters) => {
    // Cancel any previous request still in flight
    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();

    setLoading(true);
    try {
      const res = await api.post(
        "/doctors/search",
        { specialties: predictedSpecialties, ...currentFilters },
        { signal: abortRef.current.signal }
      );
      setDoctors(res.data?.doctors || []);
    } catch (err) {
      if (err.name === "CanceledError" || err.name === "AbortError") return; // stale request — ignore
      if (err.response && err.response.status !== 404) toast.error("Failed to fetch doctors");
      setDoctors([]);
    } finally {
      setLoading(false);
    }
  }, [predictedSpecialties]);

  useEffect(() => {
    const timer = setTimeout(() => fetchDoctors(filters), 400);
    return () => clearTimeout(timer);
  }, [filters, fetchDoctors]);

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleChange = (e) => {
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const viewProfile = (doctorId) => navigate(`/patient/doctor/${doctorId}`);

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div style={container}>

      {/* SIDEBAR */}
      <div style={sidebar}>
        <h3 style={{ marginBottom:"20px" }}>Filters</h3>

        <label>Area</label>
        <select name="area" style={inputStyle} onChange={handleChange} value={filters.area}>
          <option value="">All Areas</option>
          {areas.map((area) => <option key={area}>{area}</option>)}
        </select>

        <label>Specialty</label>
        <select name="specialty" style={inputStyle} onChange={handleChange} value={filters.specialty}>
          <option value="">All Specialties</option>
          {specialties.map((spec) => <option key={spec}>{spec}</option>)}
        </select>

        <label>Max Consultation Fee</label>
        <input
          type="number" name="maxFee" style={inputStyle}
          placeholder="₹ Max Fee" onChange={handleChange} value={filters.maxFee}
        />

        <label>Minimum Rating</label>
        <select name="rating" style={inputStyle} onChange={handleChange} value={filters.rating}>
          <option value="">Any</option>
          <option value="4">4+</option>
          <option value="3">3+</option>
        </select>

        <label>Consultation Mode</label>
        <select name="mode" style={inputStyle} onChange={handleChange} value={filters.mode}>
          <option value="">Any</option>
          <option value="online">Online</option>
          <option value="offline">Offline</option>
          <option value="both">Both</option>
        </select>

        <label>Gender</label>
        <select name="gender" style={inputStyle} onChange={handleChange} value={filters.gender}>
          <option value="">Any</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>

        <label>Start Time</label>
        <input type="time" name="startTime" style={inputStyle} onChange={handleChange} value={filters.startTime}/>

        <label>End Time</label>
        <input type="time" name="endTime" style={inputStyle} onChange={handleChange} value={filters.endTime}/>
      </div>

      {/* RESULTS */}
      <div style={results}>
        <h2 style={{ marginBottom:"20px" }}>Available Doctors</h2>

        {loading && <p style={{ color:"#888" }}>Searching…</p>}

        {!loading && doctors.length === 0 && (
          <p>No doctors found matching your filters.</p>
        )}

        {doctors.map((doc) => (
          <div key={doc._id} style={doctorCard}>
            <img
              src={doc.photo ? `https://medilink-j44r.onrender.com${doc.photo}` : "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='90' height='90'%3E%3Crect width='90' height='90' fill='%23e2e8f0'/%3E%3Ccircle cx='45' cy='35' r='16' fill='%2394a3b8'/%3E%3Cellipse cx='45' cy='75' rx='24' ry='18' fill='%2394a3b8'/%3E%3C/svg%3E"}
              alt="doctor"
              style={imgStyle}
            />
            <div style={cardContent}>
              <div style={topRow}>
                <div style={nameStyle}>{doc.name}</div>
                <div style={ratingStyle}>⭐ {doc.rating || 4}</div>
                <div style={feeStyle}>₹ {doc.consultationFee}</div>
              </div>
              <div style={addressStyle}>{doc.address?.street || ""} {doc.address?.area || ""}</div>
              <div style={addressStyle}>Gender: {doc.gender || "N/A"}</div>
              {doc.availableDays && (
                <div style={slotStyle}>Available: {doc.availableDays.join(", ")}</div>
              )}
              <button style={buttonStyle} onClick={() => viewProfile(doc._id)}>
                View Profile
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default SearchDoctors;