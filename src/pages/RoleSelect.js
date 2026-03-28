import { useNavigate } from "react-router-dom";
import { Search, Megaphone } from "lucide-react";
import "./RoleSelect.css";

function RoleSelect() {

  const navigate = useNavigate();

  return (
    <div className="role-page">

      <div className="role-container">

        <h1>Qanday maqsadda ro‘yxatdan o‘tmoqchisiz?</h1>

        <p className="subtitle">
          Xorazmning eng yaxshi ish o‘rinlari va mutaxassislarini
          bir joyda jamlagan platformaga xush kelibsiz.
        </p>

        <div className="role-grid">

          {/* WORKER */}
          <div className="role-card">
            <div className="role-icon">
              <Search size={22} />
            </div>

            <h3>Ish izlovchi</h3>

            <p>
              O‘zingizga mos ish o‘rinlarini toping, rezyume yarating
              va ish beruvchilarga murojaat qiling.
            </p>

            <button
              className="role-btn"
              onClick={() => navigate("/register")}
            >
              Tanlash →
            </button>
          </div>

          {/* EMPLOYER */}
          <div className="role-card">
            <div className="role-icon">
              <Megaphone size={22} />
            </div>

            <h3>Ish beruvchi</h3>

            <p>
              Bo‘sh ish o‘rinlari haqida e’lon joylashtiring va
              kompaniyangiz uchun eng yaxshi mutaxassislarni toping.
            </p>

            <button
              className="role-btn"
              onClick={() => navigate("/register-employer")}
            >
              Tanlash →
            </button>
          </div>

        </div>

        <button
          className="back-home"
          onClick={() => navigate("/")}
        >
          ← Bosh sahifaga qaytish
        </button>

      </div>

    </div>
  );
}

export default RoleSelect;
