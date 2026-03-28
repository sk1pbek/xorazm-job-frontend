import { useEffect, useState, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import HomeFooter from "../components/HomeFooter";
import "./MyApplications.css";

function MyApplications() {

  const [apps, setApps] = useState([]);
  const navigate = useNavigate();

  const user = useState(() =>
    JSON.parse(localStorage.getItem("user"))
  )[0];

  const loadApps = useCallback(async () => {

    if (!user) {
      alert("Avval tizimga kiring!");
      navigate("/login");
      return;
    }

    try {

      const res = await fetch(
        `http://localhost:8000/myapplications/${user.id}`
      );

      const data = await res.json();
      setApps(data);

    } catch {
      alert("Arizalarni yuklashda xatolik!");
    }

  }, [user, navigate]);

  useEffect(() => {
    loadApps();
  }, [loadApps]);


  const renderStatus = (status) => {

    if (status === "waiting") {
      return (
        <span className="status waiting">
          Ko‘rib chiqilmoqda
        </span>
      );
    }

    if (status === "accepted") {
      return (
        <span className="status accepted">
          Qabul qilindi
        </span>
      );
    }

    if (status === "rejected") {
      return (
        <span className="status rejected">
          Rad etildi
        </span>
      );
    }

    return status;
  };


  return (

    <div className="apps-page">

      <div className="apps-header">
        <h1>Mening arizalarim</h1>
        <p>
          Barcha topshirilgan vakansiyalaringiz
          holatini kuzatib boring.
        </p>
      </div>


      {/* STATS */}

      <div className="stats">

        <div className="stat-card">
          <h3>{apps.length}</h3>
          <span>Barcha arizalar</span>
        </div>

        <div className="stat-card">
          <h3>
            {apps.filter(a => a.status === "accepted").length}
          </h3>
          <span>Qabul qilindi</span>
        </div>

        <div className="stat-card">
          <h3>
            {apps.filter(a => a.status === "waiting").length}
          </h3>
          <span>Ko‘rib chiqilmoqda</span>
        </div>

      </div>


      {/* APPLICATION LIST */}

      <div className="apps-list">

        {apps.length === 0 && (
          <p>Siz hali ariza yubormagansiz</p>
        )}

        {apps.map(app => (

          <div key={app.id} className="app-row">

            <div className="app-left">

              <img
                className="company-logo"
                src={`https://ui-avatars.com/api/?name=${app.company}&background=random`}
                alt="logo"
              />

              <div>
                <h3>{app.title}</h3>
                <p>{app.company}</p>
              </div>

            </div>


            <div className="app-right">

              {renderStatus(app.status)}

              <Link
                className="view-link"
                to={`/job/${app.job_id}`}
              >
                Vakansiyani ko‘rish →
              </Link>

            </div>

          </div>

        ))}

      </div>

      {/* FOOTER */}

      <HomeFooter />

    </div>

  );

}

export default MyApplications;