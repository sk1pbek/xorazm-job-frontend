import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Admin() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const [tab, setTab] = useState("stats");
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/");
      return;
    }
    const fetchStats = async () => {
      const res = await fetch(`${process.env.REACT_APP_API}/admin/stats/${user.id}`);
      const data = await res.json();
      setStats(data);
    };
    fetchStats();
  }, [user, navigate]);

  

  const loadUsers = async () => {
    const res = await fetch(`${process.env.REACT_APP_API}/admin/users/${user.id}`);
    const data = await res.json();
    setUsers(data);
  };

  const loadJobs = async () => {
    const res = await fetch(`${process.env.REACT_APP_API}/admin/jobs/${user.id}`);
    const data = await res.json();
    setJobs(data);
  };

  const deleteUser = async (id) => {
    if (!window.confirm("O'chirishni tasdiqlaysizmi?")) return;
    await fetch(`${process.env.REACT_APP_API}/admin/users/${user.id}/${id}`, {
      method: "DELETE"
    });
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  const deleteJob = async (id) => {
    if (!window.confirm("O'chirishni tasdiqlaysizmi?")) return;
    await fetch(`${process.env.REACT_APP_API}/admin/jobs/${user.id}/${id}`, {
      method: "DELETE"
    });
    setJobs(prev => prev.filter(j => j.id !== id));
  };

  const handleTab = (t) => {
    setTab(t);
    if (t === "users") loadUsers();
    if (t === "jobs") loadJobs();
  };

  return (
    <div style={{ padding: "30px", maxWidth: "1100px", margin: "auto" }}>
      <h2 style={{ marginBottom: 24 }}>⚙️ Admin Panel</h2>

      {/* TABS */}
      <div style={{ display: "flex", gap: 12, marginBottom: 28 }}>
        {["stats", "users", "jobs"].map(t => (
          <button
            key={t}
            onClick={() => handleTab(t)}
            style={{
              padding: "10px 22px",
              borderRadius: 10,
              border: "none",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: 14,
              background: tab === t ? "#2563eb" : "#f1f5f9",
              color: tab === t ? "white" : "#333"
            }}
          >
            {t === "stats" ? "📊 Statistika" : t === "users" ? "👥 Foydalanuvchilar" : "💼 Vakansiyalar"}
          </button>
        ))}
      </div>

      {/* STATISTIKA */}
      {tab === "stats" && stats && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16 }}>
          {[
            { label: "Ishchilar", value: stats.workers, color: "#3b82f6" },
            { label: "Ish beruvchilar", value: stats.employers, color: "#8b5cf6" },
            { label: "Vakansiyalar", value: stats.jobs, color: "#10b981" },
            { label: "Arizalar", value: stats.applications, color: "#f59e0b" },
            { label: "Bugun yangi userlar", value: stats.today_users, color: "#ef4444" },
            { label: "Bugun yangi vakansiyalar", value: stats.today_jobs, color: "#06b6d4" },
          ].map(s => (
            <div key={s.label} style={{
              background: "white",
              borderRadius: 14,
              padding: "20px 24px",
              boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
              borderLeft: `4px solid ${s.color}`
            }}>
              <p style={{ color: "#64748b", fontSize: 13, margin: 0 }}>{s.label}</p>
              <h2 style={{ color: s.color, margin: "6px 0 0", fontSize: 32 }}>{s.value}</h2>
            </div>
          ))}
        </div>
      )}

      {/* FOYDALANUVCHILAR */}
      {tab === "users" && (
        <div style={{ background: "white", borderRadius: 14, padding: 20, boxShadow: "0 2px 12px rgba(0,0,0,0.07)" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f8fafc" }}>
                {["ID", "Ism", "Email", "Telefon", "Role", "Amal"].map(h => (
                  <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 13, color: "#64748b" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} style={{ borderTop: "1px solid #f1f5f9" }}>
                  <td style={{ padding: "12px 16px", fontSize: 13 }}>{u.id}</td>
                  <td style={{ padding: "12px 16px", fontSize: 13 }}>{u.name} {u.surname}</td>
                  <td style={{ padding: "12px 16px", fontSize: 13 }}>{u.email}</td>
                  <td style={{ padding: "12px 16px", fontSize: 13 }}>{u.phone}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{
                      padding: "3px 10px",
                      borderRadius: 20,
                      fontSize: 12,
                      fontWeight: 600,
                      background: u.role === "worker" ? "#dbeafe" : u.role === "employer" ? "#d1fae5" : "#fef3c7",
                      color: u.role === "worker" ? "#1d4ed8" : u.role === "employer" ? "#065f46" : "#92400e"
                    }}>
                      {u.role}
                    </span>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    {u.role !== "admin" && (
                      <button
                        onClick={() => deleteUser(u.id)}
                        style={{
                          background: "#fef2f2",
                          color: "#ef4444",
                          border: "1px solid #fecaca",
                          borderRadius: 8,
                          padding: "5px 12px",
                          cursor: "pointer",
                          fontSize: 13
                        }}
                      >
                        O'chirish
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* VAKANSIYALAR */}
      {tab === "jobs" && (
        <div style={{ background: "white", borderRadius: 14, padding: 20, boxShadow: "0 2px 12px rgba(0,0,0,0.07)" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f8fafc" }}>
                {["ID", "Lavozim", "Kompaniya", "Soha", "Arizalar", "Amal"].map(h => (
                  <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 13, color: "#64748b" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {jobs.map(j => (
                <tr key={j.id} style={{ borderTop: "1px solid #f1f5f9" }}>
                  <td style={{ padding: "12px 16px", fontSize: 13 }}>{j.id}</td>
                  <td style={{ padding: "12px 16px", fontSize: 13 }}>{j.title}</td>
                  <td style={{ padding: "12px 16px", fontSize: 13 }}>{j.company}</td>
                  <td style={{ padding: "12px 16px", fontSize: 13 }}>{j.field}</td>
                  <td style={{ padding: "12px 16px", fontSize: 13 }}>{j.applications_count}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <button
                      onClick={() => deleteJob(j.id)}
                      style={{
                        background: "#fef2f2",
                        color: "#ef4444",
                        border: "1px solid #fecaca",
                        borderRadius: 8,
                        padding: "5px 12px",
                        cursor: "pointer",
                        fontSize: 13
                      }}
                    >
                      O'chirish
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Admin;