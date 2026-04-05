import { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./MyJobs.css";

function MyJobs() {

  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);

  const user = useMemo(() => {
    return JSON.parse(localStorage.getItem("user"));
  }, []);

  const loadJobs = useCallback(async () => {

    if (!user) {
      navigate("/login");
      return;
    }

    if (user.role !== "employer") {
      navigate("/");
      return;
    }

    try {
      const res = await fetch(
        `${process.env.REACT_APP_API}/myjobs/${user.id}`
      );

      const data = await res.json();

      setJobs(Array.isArray(data) ? data : []);

    } catch {
      setJobs([]);
    }

  }, [navigate, user]);

  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  const deleteJob = async (id) => {

    if (!window.confirm("Rostdan ham o‘chirasizmi?")) return;

    await fetch(
      `${process.env.REACT_APP_API}/jobs/${id}/${user.id}`,
      { method: "DELETE" }
    );

    setJobs(prev => prev.filter(j => j.id !== id));
  };

  const stats = useMemo(() => ({
    totalJobs: jobs.length,
    locations: new Set(jobs.map(j => j.location)).size,
    companies: new Set(jobs.map(j => j.company)).size
  }), [jobs]);

  return (
    <div className="dashboard">

      <h1 className="dashboard-title">
        HR hodim boshqaruv paneli
      </h1>

      {/* STATS */}
      <div className="dashboard-stats">

        <div className="stat-card">
          <h3>{stats.totalJobs}</h3>
          <p>Jami vakansiyalar</p>
        </div>

        <div className="stat-card">
          <h3>{stats.companies}</h3>
          <p>Kompaniyalar</p>
        </div>

        <div className="stat-card">
          <h3>{stats.locations}</h3>
          <p>Lokatsiyalar</p>
        </div>

        <div className="stat-card add-card">
          <Link to="/add" className="add-job-btn">
            + Yangi vakansiya qo‘shish
          </Link>
        </div>

      </div>

      <h2 className="section-title">
        Mening vakansiyalarim
      </h2>

      {/* TABLE */}
      <div className="jobs-table">

        <div className="table-head">
          <span>Vakansiya</span>
          <span>Joylashuv</span>
          <span>Arizalar</span>
          <span>Ko‘rildi</span>
          <span>Amallar</span>
        </div>

        {jobs.length === 0 && (
          <p className="empty">
            Siz hali vakansiya qo‘shmagansiz
          </p>
        )}

        {jobs.map(job => (
          <div key={job.id} className="table-row">

            <div className="job-title">
              {job.title}
              <small>{job.company}</small>
            </div>

            <div>{job.location}</div>

            <div className="apps-cell">

  <span>{job.applications_count || 0}</span>

  {job.applications_count > 0 && (
    <button
      className="apps-btn"
      onClick={() => navigate(`/apps/${job.id}`)}
    >
      Arizalar
    </button>
  )}

</div>

            <div>{job.views_count || 0}</div>

            <div className="actions">

              <Link
                to={`/job/${job.id}`}
                className="view-btn"
              >
                Batafsil
              </Link>

              <Link
                to={`/edit/${job.id}`}
                className="edit-btn"
              >
                Edit
              </Link>

              <button
                onClick={() => deleteJob(job.id)}
                className="delete-btn"
              >
                O‘chirish
              </button>

            </div>

          </div>
        ))}

      </div>

    </div>
  );
}

export default MyJobs;