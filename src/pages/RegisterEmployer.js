import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User } from "lucide-react";
import "../Register.css";

function RegisterEmployer() {

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    surname: "",
    phone: "",
    email: "",
    password: "",
    gender: "male",
    role: "employer"
  });

  const update = (k, v) =>
    setForm(prev => ({ ...prev, [k]: v }));

  const save = async () => {
    setLoading(true);

    try {

      await fetch("http://localhost:8000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      alert("HR xodim ro‘yxatdan o‘tdi");
      navigate("/login");

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reg-page">

      <div className="reg-container">

        <h2>HR xodim sifatida ro‘yxatdan o‘tish</h2>

        <div className="reg-card">

          <div className="career-card">

            <div className="career-header">
              <User size={30} className="section-icon" />
              <div>
                <h3>Shaxsiy ma’lumotlar</h3>
                <p>Tizimga kirish uchun ma’lumotlarni kiriting</p>
              </div>
            </div>

            <input
              placeholder="Ism"
              value={form.name}
              onChange={e => update("name", e.target.value)}
            />

            <input
              placeholder="Familiya"
              value={form.surname}
              onChange={e => update("surname", e.target.value)}
            />

            <input
              placeholder="+998 90 123 45 67"
              value={form.phone}
              onChange={e => update("phone", e.target.value)}
            />

            <input
              placeholder="Email yarating"
              value={form.email}
              onChange={e => update("email", e.target.value)}
            />

            <input
              type="password"
              placeholder="Parol yarating"
              value={form.password}
              onChange={e => update("password", e.target.value)}
            />

            {/* Gender tanlash */}
            <select
              value={form.gender}
              onChange={e => update("gender", e.target.value)}
              className="gender-select"
            >
              <option value="male">Erkak</option>
              <option value="female">Ayol</option>
            </select>

          </div>

          <div className="reg-actions">
            <button className="btn" onClick={save}>
              {loading ? "Yuklanmoqda..." : "Ro‘yxatdan o‘tish"}
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}

export default RegisterEmployer;