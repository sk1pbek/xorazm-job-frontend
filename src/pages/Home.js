import { useEffect, useState, useMemo } from "react";
import JobCard from "../components/JobCard";
import "./Home.css";
import WorkerCard from "../components/WorkerCard";
import LiveMap from "../components/LiveMap";
import HomeFooter from "../components/HomeFooter";
import FilterSelect from "../components/FilterSelect";
import {
  EMPLOYMENT_TYPES,
  EXPERIENCE_LEVELS,
  EDUCATION_LEVELS,
  WORK_TIMES,
  WORKER_EDUCATION
} from "../utils/filterOptions";

function Home() {

  const [jobs, setJobs] = useState([]);
const user = JSON.parse(localStorage.getItem("user"));
const role = user?.role;
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState("Hammasi");
  const [company, setCompany] = useState("Hammasi");
  const [salarySort, setSalarySort] = useState("none");

  const [employment, setEmployment] = useState("Barchasi");
  const [experience, setExperience] = useState("Barchasi");
  const [education, setEducation] = useState("Barchasi");
  const [workType, setWorkType] = useState("Barchasi");

  // ================= LOAD JOBS =================
  useEffect(() => {

  const url =
    role === "employer"
      ? "http://localhost:8000/workers"
      : "http://localhost:8000/jobs";

  fetch(url)
    .then(res => res.json())
    .then(data => setJobs(data));

}, [role]);
// 👇 SHU YERGA
const companies = useMemo(() => {
  const list = jobs.map(j => j.company);
  return ["Hammasi", ...new Set(list)];
}, [jobs]);
  // ================= UNIQUE COMPANIES =================
  const filtered = useMemo(() => {

  let result = jobs.filter(j => {

    // ===== EMPLOYER FILTR =====
    if (role === "employer") {

const searchMatch =
j.field?.toLowerCase().includes(search.toLowerCase()) ||
j.name?.toLowerCase().includes(search.toLowerCase());

const fieldMatch =
company === "Hammasi" || j.field === company;

const experienceMatch =
experience === "Barchasi" ||
j.experience >= parseInt(experience);

const educationMatch =
education === "Barchasi" ||
(j.education || "")
.toLowerCase()
.includes(education.toLowerCase());

const regionMatch =
region === "Hammasi" || j.district === region;

return searchMatch && fieldMatch && experienceMatch && educationMatch && regionMatch;

}

    // ===== WORKER FILTR =====
    const searchMatch =
      j.title?.toLowerCase().includes(search.toLowerCase()) ||
      j.company?.toLowerCase().includes(search.toLowerCase());

    const companyMatch =
      company === "Hammasi" || j.company === company;

    const employmentMatch =
      employment === "Barchasi" || j.employment_type === employment;

    const experienceMatch =
      experience === "Barchasi" || j.experience_required === experience;

    const educationMatch =
      education === "Barchasi" || j.education_level === education;

    const workTypeMatch =
      workType === "Barchasi" || j.work_time === workType;

    const regionMatch =
  region === "Hammasi" || j.district === region;

    return (
      searchMatch &&
      companyMatch &&
      employmentMatch &&
      experienceMatch &&
      educationMatch &&
      workTypeMatch &&
      regionMatch
    );

  });

  if (salarySort === "asc") {
    result.sort((a, b) => Number(a.salary) - Number(b.salary));
  }

  if (salarySort === "desc") {
    result.sort((a, b) => Number(b.salary) - Number(a.salary));
  }

  return result;

}, [
  jobs,
  search,
  company,
  employment,
  experience,
  education,
  workType,
  salarySort,
  role,
  region
]);
  // ================= RESET FILTER =================
  const resetFilters = () => {
    setSearch("");
    setRegion("Hammasi");
    setCompany("Hammasi");
    setEmployment("Barchasi");
    setExperience("Barchasi");
    setEducation("Barchasi");
    setWorkType("Barchasi");
    setSalarySort("none");
  };

  return (
  <div className="home">

    {/* ===== FULL WIDTH MAP HERO ===== */}
    <section className="map-hero">

      <LiveMap
  jobs={role === "employer" ? [] : filtered}
  workers={role === "employer" ? filtered : []}
  selectedDistrict={region}
/>

      {/* FILTER MAP USTIDA */}
      <div className="map-overlay">

        

          {/* TOP FILTER */}
          <div className="filter-top">

            <input
             placeholder={
role === "employer"
? "Kasb yoki yo'nalish..."
: "Kasb nomi yoki kompaniya..."
}
              value={search}
              onChange={e => setSearch(e.target.value)}
            />

            <select
  value={region}
  onChange={e => setRegion(e.target.value)}
>
  <option>Hammasi</option>
  <option>Urganch</option>
  <option>Xiva</option>
  <option>Bog‘ot</option>
  <option>Gurlan</option>
  <option>Hazorasp</option>
  <option>Xonqa</option>
  <option>Qo‘shko‘pir</option>
  <option>Shovot</option>
  <option>Yangiariq</option>
  <option>Yangibozor</option>
  <option>Tuproqqal'a</option>
</select>

            <button className="search-btn">
              Qidirish
            </button>

            <button
              className="search-btn"
              style={{ background: "#64748b" }}
              onClick={resetFilters}
            >
              Tozalash
            </button>

          </div>

        </div>

    

    </section>

    {/* ===== PASTKI FILTERLAR ===== */}
   {/* ===== PASTKI FILTERLAR ===== */}
<section className="filters-section">
  <div className="filter-bottom">

  {/* ===== WORKER FILTRLAR (o‘zgarmaydi) ===== */}
  {role !== "employer" && (
    <>
      <FilterSelect
        label="Kompaniya"
        value={company}
        onChange={setCompany}
        options={companies.slice(1)}
      />

      <FilterSelect
        label="Bandlik turi"
        value={employment}
        onChange={setEmployment}
        options={EMPLOYMENT_TYPES}
      />

      <FilterSelect
        label="Tajriba"
        value={experience}
        onChange={setExperience}
        options={EXPERIENCE_LEVELS}
      />

      <FilterSelect
        label="Ma'lumot"
        value={education}
        onChange={setEducation}
        options={EDUCATION_LEVELS}
      />

      <FilterSelect
        label="Ish vaqti"
        value={workType}
        onChange={setWorkType}
        options={WORK_TIMES}
      />
    </>
  )}

  {/* ===== EMPLOYER FILTRLAR ===== */}
  {role === "employer" && (
    <>
      <FilterSelect
        label="Soha"
        value={company}
        onChange={setCompany}
        options={[...new Set(jobs.map(w => w.field))]}
      />

      <FilterSelect
        label="Tajriba"
        value={experience}
        onChange={setExperience}
        options={EXPERIENCE_LEVELS}
      />

      <FilterSelect
  label="Ma'lumot"
  value={education}
  onChange={setEducation}
  options={WORKER_EDUCATION}
/>
    </>
  )}

  {/* ===== IKKALASIGA HAM UMUMIY ===== */}
  <div className="filter-item">
    <label>Ish haqi bo‘yicha</label>
    <select
      value={salarySort}
      onChange={e => setSalarySort(e.target.value)}
    >
      <option value="none">Saralash</option>
      <option value="asc">Kamdan kattaga</option>
      <option value="desc">Kattadan kamga</option>
    </select>
  </div>

  </div>
</section>

    {/* ================= STATS ================= */}
    <section className="stats">

      <div className="stat-item">
       <h3>{jobs.length}+</h3>
<p>
{role === "employer" ? "Nomzodlar" : "Vakansiyalar"}
</p>
      </div>

      <div className="stat-item">
        <h3>{companies.length - 1}+</h3>
        <p>
{role === "employer" ? "Yo'nalishlar" : "Kompaniyalar"}
</p>
      </div>

      <div className="stat-item">
        <h3>{filtered.length}+</h3>
<p>
{role === "employer" ? "Nomzodlar" : "Vakansiyalar"}
</p>
      </div>

      <div className="stat-item">
        <h3>12</h3>
        <p>Tumanlar</p>
      </div>

    </section>

    <h2 className="section-title">
  {role === "employer"
    ? "Mavjud nomzodlar"
    : "Eng so‘nggi vakansiyalar"}
</h2>

    <div className="jobs-list">
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

    <HomeFooter />

  </div>
);
}

export default Home;