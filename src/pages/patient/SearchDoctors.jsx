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

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Serif+Display&display=swap');
  *, *::before, *::after { box-sizing: border-box; }

  .sd-root {
    --accent:        #3b6b9e;
    --accent-light:  #4d7daf;
    --accent-bg:     #eef3f9;
    --accent-border: rgba(59,107,158,0.18);
    --accent-muted:  #6a94bc;
    --success:       #1a6640;
    --success-bg:    #eef8f2;
    --neutral-bg:    #f4f6f9;
    --border:        rgba(0,0,0,0.07);
    --border-md:     rgba(0,0,0,0.11);
    --text:          #1a1f2e;
    --text-sec:      #3d4a5c;
    --muted:         #697586;
    --surface:       #fff;
    --page-bg:       #edf0f5;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    color: var(--text);
    background: var(--page-bg);
  }

  /*
   * THE FIX:
   * Instead of relying on position:sticky (which breaks when a parent div
   * is the scroll container), we make the layout itself fill the viewport
   * and give each column its own independent overflow-y: auto.
   * The sidebar never moves. Only the results column scrolls.
   */
  .sd-root {
    height: 100vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .sd-layout {
    max-width: 1100px;
    width: 100%;
    margin: 0 auto;
    display: flex;
    gap: 20px;
    flex: 1;
    overflow: hidden;
    padding: 24px 16px;
  }

  /* Sidebar: fixed height, scrolls only its own content if needed */
  .sd-sidebar {
    width: 236px;
    flex-shrink: 0;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 14px;
    overflow-y: auto;
    height: 100%;
    box-shadow: 0 2px 12px rgba(0,0,0,0.05);
    scrollbar-width: thin;
    scrollbar-color: var(--accent-border) transparent;
  }
  .sd-sidebar::-webkit-scrollbar { width: 4px; }
  .sd-sidebar::-webkit-scrollbar-track { background: transparent; }
  .sd-sidebar::-webkit-scrollbar-thumb { background: var(--accent-border); border-radius: 4px; }

  .sd-sidebar-header {
    padding: 13px 18px;
    border-bottom: 1px solid var(--border);
    display: flex;
    align-items: center;
    gap: 9px;
    background: var(--neutral-bg);
    position: sticky;
    top: 0;
    z-index: 1;
  }
  .sd-sidebar-header-icon {
    width: 28px; height: 28px;
    background: var(--accent-bg);
    border-radius: 6px;
    display: flex; align-items: center; justify-content: center;
    color: var(--accent);
    font-size: 14px;
    flex-shrink: 0;
  }
  .sd-sidebar-header span {
    font-size: 13.5px;
    font-weight: 700;
    color: var(--text);
  }
  .sd-sidebar-body { padding: 14px 16px; }

  .sd-filter-group { margin-bottom: 12px; }
  .sd-filter-label {
    display: block;
    font-size: 10.5px;
    font-weight: 700;
    letter-spacing: .06em;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 4px;
  }
  .sd-filter-select,
  .sd-filter-input {
    width: 100%;
    padding: 7px 10px;
    border: 1px solid var(--border-md);
    border-radius: 7px;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    color: var(--text);
    background: var(--surface);
    outline: none;
    transition: border-color .15s;
    appearance: none;
    -webkit-appearance: none;
  }
  .sd-filter-select {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 10px center;
    padding-right: 28px;
  }
  .sd-filter-select:focus,
  .sd-filter-input:focus { border-color: var(--accent); box-shadow: 0 0 0 2px var(--accent-bg); }

  .sd-time-row { display: flex; gap: 6px; }
  .sd-time-row .sd-filter-group { flex: 1; margin-bottom: 0; }

  .sd-reset-btn {
    width: 100%;
    padding: 7px;
    border: 1px solid var(--accent-border);
    border-radius: 7px;
    background: var(--accent-bg);
    color: var(--accent);
    font-family: 'DM Sans', sans-serif;
    font-size: 12.5px;
    font-weight: 600;
    cursor: pointer;
    margin-top: 4px;
    display: flex; align-items: center; justify-content: center; gap: 5px;
    transition: background .15s;
  }
  .sd-reset-btn:hover { background: #d9e5f3; }

  /* Results: fills remaining width, only this column scrolls */
  .sd-results {
    flex: 1;
    min-width: 0;
    overflow-y: auto;
    height: 100%;
    padding-right: 4px;
    scrollbar-width: thin;
    scrollbar-color: var(--accent-border) transparent;
  }
  .sd-results::-webkit-scrollbar { width: 4px; }
  .sd-results::-webkit-scrollbar-track { background: transparent; }
  .sd-results::-webkit-scrollbar-thumb { background: var(--accent-border); border-radius: 4px; }

  .sd-results-header {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 14px 20px;
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    gap: 10px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  }
  .sd-results-icon {
    width: 32px; height: 32px;
    background: var(--accent-bg);
    border-radius: 7px;
    display: flex; align-items: center; justify-content: center;
    color: var(--accent);
    font-size: 15px;
    flex-shrink: 0;
  }
  .sd-results-title { font-size: 15px; font-weight: 700; margin: 0 0 1px; color: var(--text); }
  .sd-results-sub   { font-size: 12px; color: var(--muted); margin: 0; }
  .sd-count-badge {
    margin-left: auto;
    background: var(--accent-bg);
    color: var(--accent);
    border: 1px solid var(--accent-border);
    border-radius: 20px;
    padding: 3px 10px;
    font-size: 12px;
    font-weight: 700;
  }

  .sd-loading {
    display: flex; align-items: center; gap: 10px;
    padding: 48px 0;
    justify-content: center;
    color: var(--muted);
    font-size: 13px;
  }
  .sd-spinner {
    width: 16px; height: 16px;
    border: 2px solid var(--border);
    border-top-color: var(--accent);
    border-radius: 50%;
    animation: sd-spin .7s linear infinite;
  }
  @keyframes sd-spin { to { transform: rotate(360deg); } }

  .sd-empty {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 48px 24px;
    text-align: center;
    color: var(--muted);
  }
  .sd-empty-icon {
    width: 42px; height: 42px;
    background: var(--accent-bg);
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    color: var(--accent);
    font-size: 18px;
    margin: 0 auto 10px;
  }
  .sd-empty h3 { font-size: 15px; font-weight: 600; color: var(--text); margin: 0 0 4px; }
  .sd-empty p  { font-size: 12.5px; margin: 0; }

  .sd-doc-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    margin-bottom: 10px;
    display: flex;
    align-items: stretch;
    transition: border-color .15s, box-shadow .15s;
    overflow: hidden;
    box-shadow: 0 1px 6px rgba(0,0,0,0.04);
  }
  .sd-doc-card:hover {
    border-color: var(--accent-border);
    box-shadow: 0 3px 14px rgba(59,107,158,0.1);
  }

  .sd-doc-left {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 18px 16px;
    background: linear-gradient(160deg, #eef3f9 0%, #e4ecf5 100%);
    border-right: 1px solid var(--border);
    min-width: 110px;
    gap: 8px;
  }
  .sd-doc-avatar {
    width: 68px; height: 68px;
    border-radius: 50%;
    object-fit: cover;
    border: 2.5px solid var(--surface);
    box-shadow: 0 2px 8px rgba(59,107,158,0.15);
    flex-shrink: 0;
    background: #d9e5f3;
  }
  .sd-doc-rating-pill {
    display: inline-flex;
    align-items: center;
    gap: 3px;
    font-size: 11.5px;
    font-weight: 700;
    color: #7a5200;
    background: #fef7e0;
    border: 1px solid rgba(122,82,0,0.14);
    padding: 2px 8px;
    border-radius: 20px;
  }
  .sd-doc-rating-pill.no-rating {
    color: var(--muted);
    background: var(--neutral-bg);
    border-color: var(--border-md);
    font-weight: 500;
  }

  .sd-doc-body { flex: 1; padding: 14px 18px; min-width: 0; }

  .sd-doc-top {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 6px;
    margin-bottom: 8px;
  }
  .sd-doc-name {
    font-family: 'DM Serif Display', serif;
    font-size: 16px;
    font-weight: 400;
    color: var(--text);
    display: block;
    margin-bottom: 2px;
  }
  .sd-doc-spec {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: .04em;
    text-transform: uppercase;
    color: var(--accent);
  }
  .sd-fee-tag {
    display: inline-flex;
    align-items: center;
    gap: 3px;
    padding: 5px 12px;
    background: var(--accent);
    color: #fff;
    border-radius: 7px;
    font-size: 13px;
    font-weight: 700;
    flex-shrink: 0;
  }
  .sd-fee-tag small { font-size: 10px; font-weight: 400; opacity: .8; }

  .sd-info-row {
    display: flex;
    flex-wrap: wrap;
    gap: 5px 10px;
    margin-bottom: 12px;
  }
  .sd-info-chip {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-size: 12px;
    color: var(--text-sec);
    background: var(--neutral-bg);
    border: 1px solid var(--border);
    padding: 3px 9px;
    border-radius: 6px;
  }
  .sd-info-chip i { font-size: 13px; color: var(--accent-muted); flex-shrink: 0; }
  .sd-info-chip strong { color: var(--text); font-weight: 600; }

  .sd-info-chip-avail {
    background: var(--accent-bg);
    border-color: var(--accent-border);
    color: var(--accent);
  }
  .sd-info-chip-avail i { color: var(--accent); }
  .sd-info-chip-avail strong { color: var(--accent); }

  .sd-view-btn {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 7px 14px;
    border: none; border-radius: 7px;
    background: var(--accent); color: #fff;
    font-family: 'DM Sans', sans-serif;
    font-size: 12.5px; font-weight: 700;
    cursor: pointer;
    transition: opacity .15s, transform .1s;
  }
  .sd-view-btn:hover  { opacity: .87; }
  .sd-view-btn:active { transform: scale(.97); }
  .sd-view-btn i { font-size: 13px; }

  /* Mobile: revert to natural page scroll */
  @media (max-width: 720px) {
    .sd-root {
      height: auto;
      overflow: visible;
    }
    .sd-layout {
      flex-direction: column;
      overflow: visible;
      height: auto;
      padding: 14px 10px 50px;
    }
    .sd-sidebar {
      width: 100%;
      height: auto;
      overflow-y: visible;
    }
    .sd-results {
      height: auto;
      overflow-y: visible;
      padding-right: 0;
    }
    .sd-doc-card  { flex-direction: column; }
    .sd-doc-left  {
      flex-direction: row;
      padding: 14px 16px;
      border-right: none;
      border-bottom: 1px solid var(--border);
      justify-content: flex-start;
      min-width: unset;
    }
    .sd-doc-avatar { width: 52px; height: 52px; }
  }
`;

const PLACEHOLDER = "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";

const SearchDoctors = () => {
  useBackRedirect("/patient/profile");

  const location  = useLocation();
  const navigate  = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const predictedSpecialtiesRef = useRef(location.state?.specialties || []);
  const predictedSpecialties    = predictedSpecialtiesRef.current;

  const [doctors, setDoctors] = useState([]);
  const [areas,   setAreas]   = useState([]);
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({
    area:       searchParams.get("area")       || "",
    specialty:  searchParams.get("specialty")  || "",
    maxFee:     searchParams.get("maxFee")     || "",
    rating:     searchParams.get("rating")     || "",
    experience: searchParams.get("experience") || "",
    mode:       searchParams.get("mode")       || "",
    gender:     searchParams.get("gender")     || "",
    startTime:  searchParams.get("startTime")  || "",
    endTime:    searchParams.get("endTime")    || "",
  });

  useEffect(() => {
    const sid = "sd-styles";
    if (!document.getElementById(sid)) {
      const tag = document.createElement("style");
      tag.id = sid; tag.textContent = STYLES;
      document.head.appendChild(tag);
    }
  }, []);

  useEffect(() => {
    const params = {};
    Object.keys(filters).forEach(k => { if (filters[k]) params[k] = filters[k]; });
    const current = Object.fromEntries(searchParams);
    if (JSON.stringify(params) !== JSON.stringify(current)) setSearchParams(params);
  }, [filters]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    let cancelled = false;
    const fetchAreas = async () => {
      try {
        const res = await api.get("/doctors/filters", {
          params: predictedSpecialties.length ? { specialties: predictedSpecialties.join(",") } : {},
        });
        if (!cancelled) setAreas(res.data?.areas || []);
      } catch (err) {
        if (!cancelled && err.response) toast.error("Failed to fetch areas.");
      }
    };
    fetchAreas();
    return () => { cancelled = true; };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const abortRef = useRef(null);

  const fetchDoctors = useCallback(async (currentFilters) => {
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
      if (err.name === "CanceledError" || err.name === "AbortError") return;
      if (err.response && err.response.status !== 404) toast.error("Failed to fetch doctors.");
      setDoctors([]);
    } finally {
      setLoading(false);
    }
  }, [predictedSpecialties]);

  useEffect(() => {
    const timer = setTimeout(() => fetchDoctors(filters), 400);
    return () => clearTimeout(timer);
  }, [filters, fetchDoctors]);

  const handleChange = (e) =>
    setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const resetFilters = () =>
    setFilters({ area: "", specialty: "", maxFee: "", rating: "", experience: "", mode: "", gender: "", startTime: "", endTime: "" });

  const viewProfile = (doctorId) => navigate(`/patient/doctor/${doctorId}`);

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  const hasRating = (doc) => doc.rating && Number(doc.rating) > 0;

  const placeholder = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='76' height='76'%3E%3Crect width='76' height='76' fill='%23d9e5f3'/%3E%3Ccircle cx='38' cy='30' r='13' fill='%236a94bc'/%3E%3Cellipse cx='38' cy='65' rx='20' ry='15' fill='%236a94bc'/%3E%3C/svg%3E";

  const getPhoto = (doc) =>
    doc.photo && doc.photo.trim() !== ""
      ? doc.photo.startsWith("http")
        ? doc.photo
        : `https://medilink-j44r.onrender.com${doc.photo}`
      : placeholder;

  return (
    <div className="sd-root">
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3.19.0/dist/tabler-icons.min.css" />

      <div className="sd-layout">

        {/* ── Sidebar — stays fixed, never scrolls with the page ── */}
        <aside className="sd-sidebar">
          <div className="sd-sidebar-header">
            <div className="sd-sidebar-header-icon">
              <i className="ti ti-adjustments-horizontal" />
            </div>
            <span>Filters {activeFilterCount > 0 && `(${activeFilterCount})`}</span>
          </div>

          <div className="sd-sidebar-body">

            <div className="sd-filter-group">
              <label className="sd-filter-label">Area</label>
              <select className="sd-filter-select" name="area" onChange={handleChange} value={filters.area}>
                <option value="">All areas</option>
                {areas.map(a => <option key={a}>{a}</option>)}
              </select>
            </div>

            <div className="sd-filter-group">
              <label className="sd-filter-label">Specialty</label>
              <select className="sd-filter-select" name="specialty" onChange={handleChange} value={filters.specialty}>
                <option value="">All specialties</option>
                {specialties.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>

            <div className="sd-filter-group">
              <label className="sd-filter-label">Max consultation fee</label>
              <input
                type="number" name="maxFee" className="sd-filter-input"
                placeholder="₹ e.g. 500" onChange={handleChange} value={filters.maxFee}
              />
            </div>

            <div className="sd-filter-group">
              <label className="sd-filter-label">Minimum rating</label>
              <select className="sd-filter-select" name="rating" onChange={handleChange} value={filters.rating}>
                <option value="">Any rating</option>
                <option value="4">4★ and above</option>
                <option value="3">3★ and above</option>
              </select>
            </div>

            <div className="sd-filter-group">
              <label className="sd-filter-label">Consultation mode</label>
              <select className="sd-filter-select" name="mode" onChange={handleChange} value={filters.mode}>
                <option value="">Any mode</option>
                <option value="online">Online</option>
                <option value="offline">In-clinic</option>
                <option value="both">Both</option>
              </select>
            </div>

            <div className="sd-filter-group">
              <label className="sd-filter-label">Gender</label>
              <select className="sd-filter-select" name="gender" onChange={handleChange} value={filters.gender}>
                <option value="">Any</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>

            <div className="sd-filter-group">
              <label className="sd-filter-label">Availability window</label>
              <div className="sd-time-row">
                <div className="sd-filter-group">
                  <label className="sd-filter-label">From</label>
                  <input type="time" name="startTime" className="sd-filter-input" onChange={handleChange} value={filters.startTime} />
                </div>
                <div className="sd-filter-group">
                  <label className="sd-filter-label">To</label>
                  <input type="time" name="endTime" className="sd-filter-input" onChange={handleChange} value={filters.endTime} />
                </div>
              </div>
            </div>

            {activeFilterCount > 0 && (
              <button className="sd-reset-btn" onClick={resetFilters}>
                <i className="ti ti-x" /> Clear all filters
              </button>
            )}

          </div>
        </aside>

        {/* ── Results — only this column scrolls ── */}
        <div className="sd-results">

          <div className="sd-results-header">
            <div className="sd-results-icon">
              <i className="ti ti-stethoscope" />
            </div>
            <div>
              <p className="sd-results-title">Available Doctors</p>
              <p className="sd-results-sub">Showing results based on your filters</p>
            </div>
            {!loading && (
              <span className="sd-count-badge">{doctors.length} found</span>
            )}
          </div>

          {loading && (
            <div className="sd-loading">
              <div className="sd-spinner" /> Searching for doctors…
            </div>
          )}

          {!loading && doctors.length === 0 && (
            <div className="sd-empty">
              <div className="sd-empty-icon">
                <i className="ti ti-user-search" />
              </div>
              <h3>No doctors found</h3>
              <p>Try adjusting your filters or clearing some to see more results.</p>
            </div>
          )}

          {!loading && doctors.map(doc => (
            <div key={doc._id} className="sd-doc-card">

              <div className="sd-doc-left">
                <img
                  src={getPhoto(doc)}
                  alt={doc.name}
                  className="sd-doc-avatar"
                  onError={(e) => { e.target.src = PLACEHOLDER; }}
                />
                {hasRating(doc) ? (
                  <span className="sd-doc-rating-pill">
                    ⭐ {Number(doc.rating).toFixed(1)}
                  </span>
                ) : (
                  <span className="sd-doc-rating-pill no-rating">
                    No ratings yet
                  </span>
                )}
              </div>

              <div className="sd-doc-body">
                <div className="sd-doc-top">
                  <div>
                    <span className="sd-doc-name">{doc.name}</span>
                    <span className="sd-doc-spec">{doc.specialty}</span>
                  </div>
                  <span className="sd-fee-tag">
                    ₹{doc.consultationFee}
                    <small>/visit</small>
                  </span>
                </div>

                <div className="sd-info-row">
                  {doc.gender && (
                    <span className="sd-info-chip">
                      <i className="ti ti-gender-bigender" />
                      <strong>{doc.gender}</strong>
                    </span>
                  )}
                  {(doc.address?.area || doc.address?.street) && (
                    <span className="sd-info-chip">
                      <i className="ti ti-map-pin" />
                      <strong>{[doc.address?.street, doc.address?.area].filter(Boolean).join(", ")}</strong>
                    </span>
                  )}
                  {doc.experience && (
                    <span className="sd-info-chip">
                      <i className="ti ti-briefcase-medical" />
                      <strong>{doc.experience} yr</strong> exp
                    </span>
                  )}
                  {doc.availableDays?.length > 0 && (
                    <span className="sd-info-chip sd-info-chip-avail">
                      <i className="ti ti-calendar-check" />
                      <strong>{doc.availableDays.join(", ")}</strong>
                    </span>
                  )}
                </div>

                <button className="sd-view-btn" onClick={() => viewProfile(doc._id)}>
                  <i className="ti ti-user-circle" /> View profile
                </button>
              </div>

            </div>
          ))}

        </div>
      </div>
    </div>
  );
};

export default SearchDoctors;
