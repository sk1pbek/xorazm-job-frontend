import { useEffect, useState, useMemo } from "react";
import JobCard from "../components/JobCard";
import HomeFooter from "../components/HomeFooter";
import "./Vacancies.css";
import {
  EMPLOYMENT_TYPES,
  EXPERIENCE_LEVELS,
  EDUCATION_LEVELS,
  WORK_TIMES,
  WORK_MODES,
  JOB_FIELDS
} from "../utils/filterOptions";

const DISTRICTS = [
  "Hammasi", "Urganch", "Xiva", "Bog'ot", "Gurlan",
  "Hazorasp", "Xonqa", "Qo'shko'pir", "Shovot",
  "Yangiariq", "Yangibozor", "Tuproqqal'a"
];

function Vacancies() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // FILTERLAR
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState("Hammasi");
  const [company, setCompany] = useState("Hammasi");
  const [employment, setEmployment] = useState("Barchasi");
  const [experience, setExperience] = useState("Barchasi");
  const [education, setEducation] = useState("Barchasi");
  const [workType, setWorkType] = useState("Barchasi");
  const [workMode, setWorkMode] = useState("Barchasi");
  const [field, setField] = useState("Barchasi");
  const [gender, setGender] = useState("Barchasi");
  const [salarySort, setSalarySort] = useState("none");

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API}/jobs`)
      .then(res => res.json())
      .then(data => { setJobs(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const companies = useMemo(() => {
    const list = jobs.map(j => j.company);
    return ["Hammasi", ...new Set(list)];
  }, [jobs]);

  const filtered = useMemo(() => {
    let result = jobs.filter(j => {
      const searchMatch =
        j.title?.toLowerCase().includes(search.toLowerCase()) ||
        j.company?.toLowerCase().includes(search.toLowerCase());

      const companyMatch = company === "Hammasi" || j.company === company;
      const employmentMatch = employment === "Barchasi" || j.employment_type === employment;
      const experienceMatch = experience === "Barchasi" || j.experience_required === experience;
      const educationMatch = education === "Barchasi" || j.education_level === education;
      const workTypeMatch = workType === "Barchasi" || j.work_time === workType;
      const workModeMatch = workMode === "Barchasi" || j.work_mode === workMode;
      const fieldMatch = field === "Barchasi" || j.field === field;
      const regionMatch = region === "Hammasi" || (j.district || "").toLowerCase().includes(region.toLowerCase());
      const genderMatch = gender === "Barchasi" || j.gender === gender || j.gender === "Ahamiyatsiz" || !j.gender;

      return searchMatch && companyMatch && employmentMatch && experienceMatch &&
        educationMatch && workTypeMatch && workModeMatch && fieldMatch && regionMatch && genderMatch;
    });

    if (salarySort === "asc") result.sort((a, b) => Number(a.salary) - Number(b.salary));
    if (salarySort === "desc") result.sort((a, b) => Number(b.salary) - Number(a.salary));

    return result;
  }, [jobs, search, company, employment, experience, education, workType, workMode, field, region, gender, salarySort]);

  const resetFilters = () => {
    setSearch("");
    setRegion("Hammasi");
    setCompany("Hammasi");
    setEmployment("Barchasi");
    setExperience("Barchasi");
    setEducation("Barchasi");
    setWorkType("Barchasi");
    setWorkMode("Barchasi");
    setField("Barchasi");
    setGender("Barchasi");
    setSalarySort("none");
  };

  const activeFiltersCount = [
    search, region !== "Hammasi", company !== "Hammasi",
    employment !== "Barchasi", experience !== "Barchasi",
    education !== "Barchasi", workType !== "Barchasi",
    workMode !== "Barchasi", field !== "Barchasi",
    gender !== "Barchasi", salarySort !== "none"
  ].filter(Boolean).length;

  return (
    <div className="vacancies-page">

      {/* HEADER */}
      <div className="vacancies-header">
        <div className="vacancies-header-inner">
          <h1>Vakansiyalar</h1>
          <p>{filtered.length} ta vakansiya topildi</p>
        </div>

        {/* QIDIRUV */}
        <div className="vacancies-search-bar">
          <input
            placeholder="Kasb nomi yoki kompaniya..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <button className="search-btn-main">Qidirish</button>
        </div>
      </div>

      <div className="vacancies-layout">

        {/* CHAP — FILTERLAR */}
        <aside className="vacancies-sidebar">

          <div className="sidebar-header">
            <span className="sidebar-title">
              Filterlar
              {activeFiltersCount > 0 && (
                <span className="filter-badge">{activeFiltersCount}</span>
              )}
            </span>
            {activeFiltersCount > 0 && (
              <button className="reset-btn" onClick={resetFilters}>
                Tozalash
              </button>
            )}
          </div>

          {/* TUMAN */}
          <div className="filter-group">
            <label className="filter-label">Tuman</label>
            <select value={region} onChange={e => setRegion(e.target.value)}>
              {DISTRICTS.map(d => <option key={d}>{d}</option>)}
            </select>
          </div>

          {/* SOHA */}
          <div className="filter-group">
            <label className="filter-label">Soha</label>
            <select value={field} onChange={e => setField(e.target.value)}>
              <option value="Barchasi">Barchasi</option>
              {JOB_FIELDS.slice(1).map(f => <option key={f}>{f}</option>)}
            </select>
          </div>

          {/* KOMPANIYA */}
          <div className="filter-group">
            <label className="filter-label">Kompaniya</label>
            <select value={company} onChange={e => setCompany(e.target.value)}>
              {companies.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>

          {/* BANDLIK TURI */}
          <div className="filter-group">
            <label className="filter-label">Bandlik turi</label>
            <select value={employment} onChange={e => setEmployment(e.target.value)}>
              <option value="Barchasi">Barchasi</option>
              {EMPLOYMENT_TYPES.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>

          {/* TAJRIBA */}
          <div className="filter-group">
            <label className="filter-label">Tajriba</label>
            <select value={experience} onChange={e => setExperience(e.target.value)}>
              <option value="Barchasi">Barchasi</option>
              {EXPERIENCE_LEVELS.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>

          {/* TA'LIM */}
          <div className="filter-group">
            <label className="filter-label">Ta'lim darajasi</label>
            <select value={education} onChange={e => setEducation(e.target.value)}>
              <option value="Barchasi">Barchasi</option>
              {EDUCATION_LEVELS.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>

          {/* ISH VAQTI */}
          <div className="filter-group">
            <label className="filter-label">Ish vaqti</label>
            <select value={workType} onChange={e => setWorkType(e.target.value)}>
              <option value="Barchasi">Barchasi</option>
              {WORK_TIMES.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>

          {/* ISH REJIMI */}
          <div className="filter-group">
            <label className="filter-label">Ish rejimi</label>
            <select value={workMode} onChange={e => setWorkMode(e.target.value)}>
              <option value="Barchasi">Barchasi</option>
              {WORK_MODES.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>

          {/* JINS */}
          <div className="filter-group">
            <label className="filter-label">Kimlar uchun</label>
            <div className="gender-filter">
              {["Barchasi", "Erkak", "Ayol"].map(g => (
                <button
                  key={g}
                  className={`gender-btn ${gender === g ? "active" : ""}`}
                  onClick={() => setGender(g)}
                >
                  {g === "Erkak" ? "👨 Erkaklar" : g === "Ayol" ? "👩 Ayollar" : "👥 Barchasi"}
                </button>
              ))}
            </div>
          </div>

          {/* MAOSH */}
          <div className="filter-group">
            <label className="filter-label">Maosh bo'yicha</label>
            <select value={salarySort} onChange={e => setSalarySort(e.target.value)}>
              <option value="none">Saralash</option>
              <option value="asc">Kamdan kattaga</option>
              <option value="desc">Kattadan kamga</option>
            </select>
          </div>

        </aside>

        {/* O'NG — VAKANSIYALAR */}
        <main className="vacancies-content">

          {loading ? (
            <div className="vacancies-loading">Yuklanmoqda...</div>
          ) : filtered.length === 0 ? (
            <div className="vacancies-empty">
              <p>😕 Hech qanday vakansiya topilmadi</p>
              <button className="reset-btn-lg" onClick={resetFilters}>
                Filterlarni tozalash
              </button>
            </div>
          ) : (
            <div className="vacancies-grid">
              {filtered.map(job => (
                <JobCard
                  key={job.id}
                  id={job.id}
                  title={job.title}
                  company={job.company}
                  salary={job.salary}
                  location={job.location}
                  description={job.desc}
                  experience_required={job.experience_required}
                  work_time={job.work_time}
                  education_level={job.education_level}
                  employment_type={job.employment_type}
                  created_at={job.created_at}
                  views_count={job.views_count}
                  applications_count={job.applications_count}
                />
              ))}
            </div>
          )}

        </main>

      </div>

      <HomeFooter />
    </div>
  );
}

export default Vacancies;