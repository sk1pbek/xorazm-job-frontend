import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useRef, useCallback, useState } from "react";
import "./Navbar.css";
import { Bell } from "lucide-react";
import logo from "../assets/logo1.png";

function Navbar({ user, setUser }) {

  const navigate = useNavigate();
  const location = useLocation();

  const [notif, setNotif] = useState({
  total: 0,
  by_jobs: [],
  messages: 0
});

  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  // ==========================
  // SCROLL TO JOBS
  // ==========================
  const scrollToJobs = () => {

    if (location.pathname === "/") {

      const el = document.getElementById("vakansiyalar");
      el?.scrollIntoView({ behavior: "smooth" });

    } else {

      navigate("/");

      setTimeout(() => {
        const el = document.getElementById("vakansiyalar");
        el?.scrollIntoView({ behavior: "smooth" });
      }, 300);

    }
  };

  // ==========================
  // LOGOUT
  // ==========================
  const chiqish = () => {
  localStorage.removeItem("user");
  setUser(null);

  // sahifani tozalab yuboradi
  window.location.href = "/";
};

  // ==========================
  // LOAD NOTIFICATIONS
  // ==========================
  const loadNotif = useCallback(async () => {

    if (!user || user.role !== "employer") return;

    try {
      const res = await fetch(
        `http://localhost:8000/notifications/${user.id}`
      );

      if (!res.ok) return;

      const data = await res.json();

      setNotif({
  total: data.total || 0,
  by_jobs: data.by_jobs || [],
  messages: data.messages || 0
});

    }catch {
  setNotif({ total: 0, by_jobs: [], messages: 0 });
}
  }, [user]);

  // ==========================
  // POLLING
  // ==========================
  useEffect(() => {

    if (!user || user.role !== "employer") return;

    loadNotif();

    const timer = setInterval(loadNotif, 30000);

    return () => clearInterval(timer);

  }, [loadNotif, user]);
// ==========================
// REALTIME NOTIF UPDATE
// ==========================
useEffect(() => {

  const handler = () => {
    loadNotif();
  };

  window.addEventListener("notif_update", handler);

  return () => {
    window.removeEventListener("notif_update", handler);
  };

}, [loadNotif]);
  // ==========================
  // CLICK OUTSIDE
  // ==========================
  useEffect(() => {

    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };

  }, []);

  // ==========================
  // UI
  // ==========================
  return (
    <nav className="nav">

      {/* LOGO */}
      <Link to="/" className="nav-logo">
        <img src={logo} alt="XorazmJob" className="site-logo" />
        <h2>
          Xorazm<span>Job</span>
        </h2>
      </Link>

      {/* RIGHT */}
      <div className="links">

        {/* VAKANSIYALAR */}
        <button className="nav-btn ghost" onClick={scrollToJobs}>
  {user?.role === "employer" ? "Nomzodlar" : "Vakansiyalar"}
</button>

        {user?.role === "employer" && (
          <>
            <Link className="nav-btn ghost" to="/add">
              Vakansiya qo‘shish
            </Link>

            <Link className="nav-btn ghost" to="/my">
              Mening ishlarim
            </Link>
              <Link className="nav-btn ghost" to="/employer-chat/1">
              Chat
             </Link>
            {/* 🔔 NOTIFICATION */}
            <div className="notif-wrapper" ref={dropdownRef}>
              <button
                className="notif-link bell-btn"
                onClick={() => setOpen(prev => !prev)}
              >
                <Bell size={18} strokeWidth={2.3} />

                {notif.total > 0 && (
                  <span className="notif-badge">
                    {notif.total}
                  </span>
                )}
              </button>

              {open && (
                <div className="notif-dropdown">

                  <div className="notif-header">
                    Yangi arizalar
                  </div>
                  {notif.messages > 0 && (
  <Link
    to="/employer-chat/1"
    className="notif-item"
    onClick={() => setOpen(false)}
  >
    <span>Yangi chat xabarlar</span>
    <span className="notif-count">
      {notif.messages}
    </span>
  </Link>
)}
                  {notif.by_jobs.length === 0 && (
                    <div className="notif-empty">
                      Hozircha yangi arizalar yo‘q
                    </div>
                  )}

                  {notif.by_jobs.map(n => (
                    <Link
                      key={n.job_id}
                      to={`/apps/${n.job_id}`}
                      className="notif-item"
                      onClick={() => setOpen(false)}
                    >
                      <span>{n.title}</span>
                      <span className="notif-count">
                        {n.count}
                      </span>
                    </Link>
                  ))}

                  {notif.by_jobs.length > 0 && (
                    <Link
                      to="/allapps"
                      className="notif-footer"
                      onClick={() => setOpen(false)}
                    >
                      Barchasini ko‘rish →
                    </Link>
                  )}

                </div>
              )}
            </div>
          </>
        )}

        {!user && (
          <>
            <Link className="nav-btn solid" to="/select-role">
              Ro‘yxatdan o'tish
            </Link>

            <Link className="nav-btn solid" to="/login">
              Kirish
            </Link>
          </>
        )}

        {user?.role === "worker" && (
          <Link className="nav-btn ghost" to="/myapps">
            Mening arizalarim
          </Link>
        )}

        {user && (
          <button className="nav-btn solid" onClick={chiqish}>
            Chiqish
          </button>
        )}

      </div>
    </nav>
  );
}

export default Navbar;