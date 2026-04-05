import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, MapPin } from "lucide-react";
import "./Login.css";

function Login({ setUser }) {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const [stats,setStats] = useState({
    jobs:0,
    workers:0,
    companies:0
  });

  useEffect(()=>{

    fetch(`${process.env.REACT_APP_API}/platform-stats`)
    .then(res=>res.json())
    .then(data=>setStats(data))

  },[])

  const enter = async () => {

    // ✅ Frontend validation
    if (!email.trim() || !password.trim()) {
      alert("Email va parolni to‘ldiring!");
      return;
    }

    try {
      setLoading(true);

     const res = await fetch(`${process.env.REACT_APP_API}/login`,{
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      if (!res.ok) {
        alert("Email yoki parol noto‘g‘ri!");
        setLoading(false);
        return;
      }

      const user = await res.json();

      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);

      navigate("/");

    } catch {
      alert("Server bilan bog‘lanishda xatolik!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
    <div className="login-container">

      {/* CHAP QISM */}
      <div className="login-left">

        <div className="logo">XorazmJob</div>

        <h1>
          Iqtidorni imkoniyat <br />
          bilan bog‘laymiz <br />
          Xorazmda.
        </h1>

        <p>
          Urganch, Xiva va boshqa tumanlar bo‘ylab
          minglab ish o‘rinlariga kirish imkoniyati.
        </p>

        <div className="glass-box">

          <div className="region">
            <MapPin size={18} />
            <div>
              <span>Faol hudud</span>
              <b> Xorazm viloyati, O‘zbekiston</b>
            </div>
          </div>

          <div className="stats-box-clean">
            <div>
             <h3>{stats.jobs}+</h3>
<span>Vakansiyalar</span>
            </div>
            <div>
             <h3>{stats.workers}+</h3>
<span>Nomzodlar</span>
            </div>
            <div>
             <h3>{stats.companies}+</h3>
<span>Kompaniyalar</span>
            </div>
          </div>

        </div>
      </div>

      {/* O‘NG QISM */}
      <div className="login-right">

        <div className="login-box">

          <h2>Xush kelibsiz</h2>
          <p>
            Hisobingizga kirish uchun ma’lumotlaringizni kiriting.
          </p>

          {/* EMAIL */}
          <label>Email manzil</label>
          <div className="input">
            <Mail size={18} />
            <input
              type="email"
              placeholder="Email kiriting"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>

          {/* PASSWORD */}
          <label>Parol</label>
          <div className="input">
            <Lock size={18} />
            <input
              type={show ? "text" : "password"}
              placeholder="Parolni kiriting"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            {show ? (
              <EyeOff
                size={18}
                style={{ cursor: "pointer" }}
                onClick={() => setShow(false)}
              />
            ) : (
              <Eye
                size={18}
                style={{ cursor: "pointer" }}
                onClick={() => setShow(true)}
              />
            )}
          </div>

          {/* LOGIN BUTTON */}
          <button
            className="login-btn"
            onClick={enter}
            disabled={loading}
          >
            {loading ? "Kirilmoqda..." : "Kirish"}
          </button>

          <div className="divider">YOKI GOOGLE ORQALI</div>

          <div className="social">
            <button>Google</button>
          </div>

          <div className="signup">
            Hisobingiz yo‘qmi?{" "}
            <span onClick={() => navigate("/select-role")}>
              Ro‘yxatdan o‘tish
            </span>
          </div>
</div>
        </div>
      </div>

    </div>
  );
}

export default Login;