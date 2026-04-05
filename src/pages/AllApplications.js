import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function AllApplications() {

  const [list, setList] = useState([]);
  const navigate = useNavigate();

 const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {

    if (!user || user.role !== "employer") {
      navigate("/");
      return;
    }

    fetch(`${process.env.REACT_APP_API}/notifications/${user.id}`)
      .then(res => res.json())
      .then(data => {
  if (data.applications > 0) {
    setList([{ job_id: 1, title: "Yangi ariza mavjud", count: data.applications }]);
  } else {
    setList([]);
  }
});

  }, [user, navigate]);   // 🔥 warning FIX

  return (
    <div style={{ padding: 20 }}>

      <h2>Qaysi e’lonlarga ariza kelgan</h2>

      {list.length === 0 && (
        <p>Hozircha yangi arizalar yo‘q</p>
      )}

      {list.map(j => (
        <div className="card" key={j.job_id}>

          <h3>{j.title}</h3>

          <p>
            Yangi arizalar: <b>{j.count}</b>
          </p>

          <Link to={`/apps/${j.job_id}`}>
            Arizalarni ko‘rish
          </Link>

        </div>
      ))}

    </div>
  );
}

export default AllApplications;
