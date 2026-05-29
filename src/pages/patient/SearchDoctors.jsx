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

/* ─── Injected Styles ─────────────────────────────────── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; }

  .sd-root {
    --accent:        #1d4ed8;
    --accent-bg:     #eff6ff;
    --accent-border: rgba(29,78,216,0.18);
    --success:       #166534;
    --success-bg:    #f0fdf4;
    --neutral-bg:    #f8f9fb;
    --border:        rgba(0,0,0,0.08);
    --border-md:     rgba(0,0,0,0.13);
    --text:          #111;
    --muted:         #6b7280;
    --surface:       #fff;
    --page-bg:       #f0f4fa;
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    color: var(--text);
    background: var(--page-bg);
    min-height: 100vh;
    padding: 32px 16px 80px;
  }

  .sd-layout {
    max-width: 1100px;
    margin: 0 auto;
    display: flex;
    gap: 22px;
    align-items: flex-start;
  }

  /* ── Sidebar ── */
  .sd-sidebar {
    width: 248px;
    flex-shrink: 0;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 14px;
    overflow: hidden;
    position: sticky;
    top: 32px;
  }
  .sd-sidebar-header {
    padding: 16px 20px;
    border-bottom: 1px solid var(--border);
    display: flex;
    align-items: center;
    gap: 9px;
  }
  .sd-sidebar-header-icon {
    width: 30px; height: 30px;
    background: var(--accent-bg);
    border-radius: 7px;
    display: flex; align-items: center; justify-content: center;
    color: var(--accent);
    font-size: 15px;
    flex-shrink: 0;
  }
  .sd-sidebar-header span {
    font-size: 14px;
    font-weight: 600;
    color: var(--text);
  }
  .sd-sidebar-body { padding: 16px 18px; }

  .sd-filter-group { margin-bottom: 14px; }
  .sd-filter-label {
    display: block;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: .05em;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 5px;
  }
  .sd-filter-select,
  .sd-filter-input {
    width: 100%;
    padding: 7px 10px;
    border: 1px solid var(--border-md);
    border-radius: 7px;
    font-family: 'Inter', sans-serif;
    font-size: 13px;
    color: var(--text);
    background: var(--surface);
    outline: none;
    transition: border-color .15s;
    appearance: none;
    -webkit-appearance: none;
  }
  .sd-filter-select { background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 10px center; padding-right: 28px; }
  .sd-filter-select:focus,
  .sd-filter-input:focus  { border-color: var(--accent); box-shadow: 0 0 0 2px var(--accent-bg); }

  .sd-time-row { display: flex; gap: 8px; }
  .sd-time-row .sd-filter-group { flex: 1; margin-bottom: 0; }

  .sd-reset-btn {
    width: 100%;
    padding: 8px;
    border: 1px solid var(--accent-border);
    border-radius: 7px;
    background: var(--accent-bg);
    color: var(--accent);
    font-family: 'Inter', sans-serif;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    margin-top: 4px;
    display: flex; align-items: center; justify-content: center; gap: 5px;
    transition: background .15s;
  }
  .sd-reset-btn:hover { background: #dbeafe; }
  .sd-reset-btn i { font-size: 14px; }

  /* ── Results pane ── */
  .sd-results { flex: 1; min-width: 0; }

  .sd-results-header {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 14px;
    padding: 18px 24px;
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .sd-results-icon {
    width: 34px; height: 34px;
    background: var(--accent-bg);
    border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    color: var(--accent);
    font-size: 16px;
    flex-shrink: 0;
  }
  .sd-results-title { font-size: 16px; font-weight: 600; margin: 0 0 1px; color: var(--text); }
  .sd-results-sub   { font-size: 12.5px; color: var(--muted); margin: 0; }
  .sd-count-badge {
    margin-left: auto;
    background: var(--accent-bg);
    color: var(--accent);
    border: 1px solid var(--accent-border);
    border-radius: 20px;
    padding: 3px 10px;
    font-size: 12px;
    font-weight: 600;
  }

  /* ── Loading ── */
  .sd-loading {
    display: flex; align-items: center; gap: 10px;
    padding: 48px 0;
    justify-content: center;
    color: var(--muted);
    font-size: 13px;
  }
  .sd-spinner {
    width: 18px; height: 18px;
    border: 2px solid var(--border);
    border-top-color: var(--accent);
    border-radius: 50%;
    animation: sd-spin .7s linear infinite;
  }
  @keyframes sd-spin { to { transform: rotate(360deg); } }

  /* ── Empty state ── */
  .sd-empty {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 52px 24px;
    text-align: center;
    color: var(--muted);
  }
  .sd-empty-icon {
    width: 46px; height: 46px;
    background: var(--accent-bg);
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    color: var(--accent);
    font-size: 20px;
    margin: 0 auto 12px;
  }
  .sd-empty h3 { font-size: 15px; font-weight: 600; color: var(--text); margin: 0 0 4px; }
  .sd-empty p  { font-size: 13px; margin: 0; }

  /* ── Doctor card ── */
  .sd-doc-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 18px 20px;
    margin-bottom: 12px;
    display: flex;
    gap: 18px;
    align-items: flex-start;
    transition: border-color .15s;
  }
  .sd-doc-card:hover { border-color: var(--accent-border); }

  .sd-doc-avatar {
    width: 76px; height: 76px;
    border-radius: 50%;
    object-fit: cover;
    border: 2.5px solid var(--accent-bg);
    flex-shrink: 0;
  }
  .sd-doc-body { flex: 1; min-width: 0; }

  .sd-doc-top {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 8px;
  }
  .sd-doc-name    { font-size: 15px; font-weight: 600; color: var(--text); }
  .sd-doc-spec    {
    font-size: 12px; font-weight: 500;
    background: var(--accent-bg);
    color: var(--accent);
    border: 1px solid var(--accent-border);
    padding: 2px 9px; border-radius: 20px;
  }

  .sd-pill-row { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 10px; }
  .sd-pill {
    display: inline-flex; align-items: center; gap: 4px;
    font-size: 12.5px; color: var(--muted);
    background: var(--neutral-bg);
    border: 1px solid var(--border);
    padding: 3px 8px; border-radius: 6px;
  }
  .sd-pill i { font-size: 13px; }
  .sd-pill strong { color: var(--text); font-weight: 500; }
  .sd-pill-accent {
    background: var(--accent-bg);
    border-color: var(--accent-border);
    color: var(--accent);
  }
  .sd-pill-accent strong { color: var(--accent); }
  .sd-pill-green {
    background: var(--success-bg);
    border-color: rgba(22,101,52,0.15);
    color: var(--success);
  }
  .sd-pill-green strong { color: var(--success); }

  .sd-view-btn {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 7px 14px;
    border: none; border-radius: 7px;
    background: var(--accent); color: #fff;
    font-family: 'Inter', sans-serif;
    font-size: 13px; font-weight: 600;
    cursor: pointer;
    transition: opacity .15s, transform .1s;
  }
  .sd-view-btn:hover  { opacity: .87; }
  .sd-view-btn:active { transform: scale(.97); }
  .sd-view-btn i { font-size: 14px; }

  @media (max-width: 720px) {
    .sd-layout    { flex-direction: column; }
    .sd-sidebar   { width: 100%; position: static; }
    .sd-doc-card  { flex-direction: column; }
    .sd-doc-avatar { width: 60px; height: 60px; }
  }
  @media (max-width: 480px) {
    .sd-root { padding: 16px 12px 60px; }
  }
`;

/* ─── Component ─────────────────────────────────────────── */
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

  /* ── inject styles ── */
  useEffect(() => {
    const sid = "sd-styles";
    if (!document.getElementById(sid)) {
      const tag = document.createElement("style");
      tag.id = sid; tag.textContent = STYLES;
      document.head.appendChild(tag);
    }
  }, []);

  /* ── sync filters → URL ── */
  useEffect(() => {
    const params = {};
    Object.keys(filters).forEach(k => { if (filters[k]) params[k] = filters[k]; });
    const current = Object.fromEntries(searchParams);
    if (JSON.stringify(params) !== JSON.stringify(current)) setSearchParams(params);
  }, [filters]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── fetch areas ── */
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

  /* ── fetch doctors (debounced + abortable) ── */
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

  const PLACEHOLDER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='76' height='76'%3E%3Crect width='76' height='76' fill='%23dbeafe'/%3E%3Ccircle cx='38' cy='30' r='13' fill='%2393c5fd'/%3E%3Cellipse cx='38' cy='65' rx='20' ry='15' fill='%2393c5fd'/%3E%3C/svg%3E";

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  return (
    <div className="sd-root">
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3.19.0/dist/tabler-icons.min.css" />

      <div className="sd-layout">

        {/* ── Sidebar ── */}
        <aside className="sd-sidebar">
          <div className="sd-sidebar-header">
            <div className="sd-sidebar-header-icon">
              <i className="ti ti-adjustments-horizontal" aria-hidden="true" />
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
                <i className="ti ti-x" aria-hidden="true" /> Clear all filters
              </button>
            )}

          </div>
        </aside>

        {/* ── Results ── */}
        <div className="sd-results">

          <div className="sd-results-header">
            <div className="sd-results-icon">
              <i className="ti ti-stethoscope" aria-hidden="true" />
            </div>
            <div>
              <p className="sd-results-title">Available Doctors</p>
              <p className="sd-results-sub">Showing results based on your filters</p>
            </div>
            {!loading && (
              <span className="sd-count-badge">
                {doctors.length} found
              </span>
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
                <i className="ti ti-user-search" aria-hidden="true" />
              </div>
              <h3>No doctors found</h3>
              <p>Try adjusting your filters or clearing some to see more results.</p>
            </div>
          )}

          {!loading && doctors.map(doc => (
            <div key={doc._id} className="sd-doc-card">
              <img
                src={doc.photo || PLACEHOLDER}
                alt={doc.name}
                className="sd-doc-avatar"
              />
              <div className="sd-doc-body">
                <div className="sd-doc-top">
                  <span className="sd-doc-name">{doc.name}</span>
                  <span className="sd-doc-spec">{doc.specialty}</span>
                </div>

                <div className="sd-pill-row">
                  <span className="sd-pill sd-pill-accent">
                    <i className="ti ti-star" aria-hidden="true" />
                    <strong>{doc.rating || "—"}</strong> rating
                  </span>
                  <span className="sd-pill sd-pill-accent">
                    <i className="ti ti-currency-rupee" aria-hidden="true" />
                    <strong>₹{doc.consultationFee}</strong>
                  </span>
                  {doc.gender && (
                    <span className="sd-pill">
                      <i className="ti ti-gender-bigender" aria-hidden="true" />
                      <strong>{doc.gender}</strong>
                    </span>
                  )}
                  {(doc.address?.area || doc.address?.street) && (
                    <span className="sd-pill">
                      <i className="ti ti-map-pin" aria-hidden="true" />
                      <strong>{[doc.address?.street, doc.address?.area].filter(Boolean).join(", ")}</strong>
                    </span>
                  )}
                  {doc.availableDays?.length > 0 && (
                    <span className="sd-pill sd-pill-green">
                      <i className="ti ti-calendar-check" aria-hidden="true" />
                      <strong>{doc.availableDays.join(", ")}</strong>
                    </span>
                  )}
                </div>

                <button className="sd-view-btn" onClick={() => viewProfile(doc._id)}>
                  <i className="ti ti-user-circle" aria-hidden="true" /> View profile
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
