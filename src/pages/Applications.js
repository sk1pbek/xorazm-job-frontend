import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./Applications.css";

function Applications() {

  const { id } = useParams();     // job id
  const [apps, setApps] = useState([]);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const navigate = useNavigate();

  // ===========================
  // 1. ARIZALARNI YUKLASH
  // ===========================

  useEffect(() => {

    if (!user) {
      navigate("/login");
      return;
    }

    if (user.role !== "employer") {
      navigate("/");
      return;
    }

    const load = async () => {

      const res = await fetch(
        `http://localhost:8000/applications/${id}/${user.id}`
      );

      const data = await res.json();
      setApps(data);
    };

    load();

  }, [id, navigate, user]);   // 🔥 WARNING FIX

  // ===========================
  // 2. ACCEPT
  // ===========================

  const accept = async (appId) => {

    await fetch(
      `http://localhost:8000/applications/${appId}/accept/${user.id}`,
      { method: "PUT" }
    );

    setApps(prev =>
      prev.map(a =>
        a.id === appId ? { ...a, status: "accepted" } : a
      )
    );
  };

  // ===========================
  // 3. REJECT
  // ===========================

  const reject = async (appId) => {

    await fetch(
      `http://localhost:8000/applications/${appId}/reject/${user.id}`,
      { method: "PUT" }
    );

    setApps(prev =>
      prev.map(a =>
        a.id === appId ? { ...a, status: "rejected" } : a
      )
    );
  };

  // ===========================
  // UI
  // ===========================

  return (
    <div className="apps-page">

      <h2>Kelgan arizalar</h2>

      {apps.length === 0 && (
        <p>Hozircha arizalar yo‘q</p>
      )}

      <div className="apps-grid">

{apps.map(a => (
        <div className="app-card" key={a.id}>

          <h3 className="app-name">{a.name}</h3>

<p className="app-email">{a.email}</p>

<p>
Moslik:
<b className="match">
 {a.percent ?? 0}%
</b>
</p>

<p>{a.message}</p>

<p>
Status:
<b className={`status ${a.status}`}>
 {a.status}
</b>
</p>

      <div className="app-actions">

{a.status === "waiting" && (

  <>
    <button
      className="btn accept"
      onClick={() => accept(a.id)}
    >
      Qabul qilish
    </button>

    <button
      className="btn reject"
      onClick={() => reject(a.id)}
    >
      Rad etish
    </button>
  </>

)}

<button
  className="btn info"
  onClick={() => navigate(`/worker/${a.worker_id}`)}
>
  Nomzod haqida
</button>

</div>
        </div>
     
))}
</div>
    </div>
  );
}

export default Applications;
