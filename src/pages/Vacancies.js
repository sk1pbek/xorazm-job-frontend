import { useEffect, useState, useMemo } from "react";
import JobCard from "../components/JobCard";
import HomeFooter from "../components/HomeFooter";
import "./Vacancies.css";
import WorkerCard from "../components/WorkerCard";
import {
  EMPLOYMENT_TYPES,
  EXPERIENCE_LEVELS,
  WORK_TIMES,
  WORK_MODES,
  JOB_FIELDS,
  WORKER_EDUCATION
} from "../utils/filterOptions";

const DISTRICTS = [
  "Hammasi", "Urganch", "Xiva", "Bog'ot", "Gurlan",
  "Hazorasp", "Xonqa", "Qo'shko'pir", "Shovot",
  "Yangiariq", "Yangibozor", "Tuproqqal'a"
];

function Vacancies() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role;

  // FILTERLAR (umumiy)
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState("Hammasi");
  const [company, setCompany] = useState("Hammasi");
  const [employment, setEmployment] = useState("Barchasi");
  const [experience, setExperience] = useState("Barchasi");
  const [education, setEducation] = useState("Barchasi");
  const [workType, setWorkType] = useState("Barchasi");
  const [workMode, setWorkMode] = useState("Barchasi");
  const [field, setField] = useState("Barchasi");
  const [salarySort, setSalarySort] = useState("none");
  const [skillFilter, setSkillFilter] = useState("");

  useEffect(() => {
    const url = role === "employer"
      ? `${process.env.REACT_APP_API}/workers`
      : `${process.env.REACT_APP_API}/jobs`;
    fetch(url)
      .then(res => res.json())
      .then(data => { setJobs(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [role]);

  const companies = useMemo(() => {
    const list = jobs.map(j => j.company);
    return ["Hammasi", ...new Set(list)];
  }, [jobs]);

  const filtered = useMemo(() => {
    let result = jobs.filter(j => {
      if (role === "employer") {
        // ---- WORKER FILTERLARI ----
        const searchMatch =
          (j.name || "").toLowerCase().includes(search.toLowerCase()) ||
          (j.surname || "").toLowerCase().includes(search.toLowerCase()) ||
          (j.field || "").toLowerCase().includes(search.toLowerCase());

        const regionMatch =
          region === "Hammasi" ||
          (j.district || "").toLowerCase().includes(region.toLowerCase());

        const fieldMatch =
          field === "Barchasi" || j.field === field;

        const experienceMatch =
          experience === "Barchasi" ||
          String(j.experience) === experience.replace(" yil", "").replace("+", "").trim() ||
          (experience === "5+ yil" && Number(j.experience) >= 5) ||
          (experience === "3+ yil" && Number(j.experience) >= 3);

        const educationMatch =
          education === "Barchasi" || j.education === education;
const skillMatch =
  skillFilter === "" ||
  (j.skills || []).some(s =>
    s.toLowerCase().includes(skillFilter.toLowerCase())
  );

return searchMatch && regionMatch && fieldMatch && experienceMatch && educationMatch && skillMatch;
      } else {
        // ---- VAKANSIYA FILTERLARI ----
        const searchMatch =
          (j.title || "").toLowerCase().includes(search.toLowerCase()) ||
          (j.company || "").toLowerCase().includes(search.toLowerCase());

        const companyMatch = company === "Hammasi" || j.company === company;
        const employmentMatch = employment === "Barchasi" || j.employment_type === employment;
        const experienceMatch = experience === "Barchasi" || j.experience_required === experience;
        const educationMatch = education === "Barchasi" || j.education_level === education;
        const workTypeMatch = workType === "Barchasi" || j.work_time === workType;
        const workModeMatch = workMode === "Barchasi" || j.work_mode === workMode;
        const fieldMatch = field === "Barchasi" || j.field === field;
        const regionMatch =
          region === "Hammasi" ||
          (j.district || "").toLowerCase().includes(region.toLowerCase());
        return searchMatch && companyMatch && employmentMatch && experienceMatch &&
          educationMatch && workTypeMatch && workModeMatch && fieldMatch && regionMatch;
      }
    });

    if (salarySort === "asc") result.sort((a, b) => Number(a.salary) - Number(b.salary));
    if (salarySort === "desc") result.sort((a, b) => Number(b.salary) - Number(a.salary));

    return result;
}, [jobs, search, company, employment, experience, education, workType, workMode, field, region, salarySort, role, skillFilter]);

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
    setSalarySort("none");
    setSkillFilter("");
  };

  const activeFiltersCount = [
    search,
    region !== "Hammasi",
    company !== "Hammasi",
    employment !== "Barchasi",
    experience !== "Barchasi",
    education !== "Barchasi",
    workType !== "Barchasi",
    workMode !== "Barchasi",
    field !== "Barchasi",
    salarySort !== "none",
    skillFilter !== ""
  ].filter(Boolean).length;

  return (
    <div className="vacancies-page">

      {/* HEADER */}
      <div className="vacancies-header">
        <div className="vacancies-header-inner">
          <h1>{role === "employer" ? "Nomzodlar" : "Vakansiyalar"}</h1>
          <p>
            {filtered.length} ta {role === "employer" ? "nomzod" : "vakansiya"} topildi
          </p>
        </div>

        {/* QIDIRUV */}
        <div className="vacancies-search-bar">
          <input
            placeholder={
              role === "employer"
                ? "Ism, familiya yoki soha..."
                : "Kasb nomi yoki kompaniya..."
            }
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
              {WORKER_EDUCATION.slice(1).map(t => <option key={t}>{t}</option>)}
            </select>
          </div>

         {/* KO'NIKMALAR — faqat employer uchun */}
          {role === "employer" && (
            <div className="filter-group">
              <label className="filter-label">Ko'nikma</label>
              <input
                placeholder="Masalan: Excel"
                value={skillFilter}
                onChange={e => setSkillFilter(e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  fontSize: "13px"
                }}
              />
            </div>
          )}

          {/* VAKANSIYALAR UCHUN QOSHIMCHA FILTERLAR */}
          {role !== "employer" && (
            <>
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
            </>
          )}

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

        {/* O'NG — KONTENT */}
        <main className="vacancies-content">

          {loading ? (
            <div className="vacancies-loading">Yuklanmoqda...</div>
          ) : filtered.length === 0 ? (
            <div className="vacancies-empty">
              <p>😕 Hech narsa topilmadi</p>
              <button className="reset-btn-lg" onClick={resetFilters}>
                Filterlarni tozalash
              </button>
            </div>
          ) : (
            <div className="vacancies-grid">
              {filtered.map(job => (
                role === "employer" ? (
                  <WorkerCard
                    key={job.id}
                    id={job.id}
                    name={job.name}
                    surname={job.surname}
                    field={job.field}
                    salary={job.salary}
                    district={job.district}
                    experience={job.experience}
                    education={job.education}
                    about={job.about}
                    skills={job.skills}
                  />
                ) : (
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
                )
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