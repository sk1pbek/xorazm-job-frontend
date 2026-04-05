import "./HomeFooter.css";
import { ShieldCheck, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
function HomeFooter() {
  const navigate = useNavigate();
 const user = JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <>
      {/* ===== CTA SECTION (FAKAT LOGIN BO‘LMAGANDA) ===== */}
      {!user && (
        <section className="home-cta">

          <div className="cta-left">
            <h2>Xorazm Job bilan ish topishni boshlang</h2>

            <p>
              Minglab mutaxassislar bizning platforma orqali ish topmoqda.
              Oddiy ro‘yxatdan o‘tish va kuchli imkoniyatlar.
            </p>

            <div className="cta-item">
              <ShieldCheck size={18} />
              Telefon orqali tasdiqlash
            </div>

            <div className="cta-item">
              <Mail size={18} />
              Email orqali bildirishnomalar
            </div>
          </div>

          <div className="cta-right">
            <div className="cta-card">
              <h3>Bepul akkaunt yarating</h3>

              <input placeholder="+998 (__) ___-__-__" />

              <button onClick={() => navigate("/roleselect")}>
                Ro‘yxatdan o‘tish
              </button>

              <small>
                Ro‘yxatdan o‘tish orqali siz xizmat ko‘rsatish
                shartlariga rozilik bildirasiz
              </small>
            </div>
          </div>

        </section>
      )}

      {/* ===== FOOTER (HAR DOIM CHIQADI) ===== */}
      <footer className="footer">

        <div className="footer-col">
          <h3>Xorazm<span>Job</span></h3>
          <p>
            Xorazmdagi ish o‘rinlari uchun yetakchi onlayn platforma.
            Mahalliy mutaxassislarga o‘z kasbini topishda yordam beramiz.
          </p>
        </div>

        <div className="footer-col">
          <h4>Ish izlovchilar uchun</h4>
          <p>Xaritada ko‘rish</p>
          <p>Email orqali bildirishnomalar</p>
          <p>Rezyume boshqaruvi</p>
        </div>

        <div className="footer-col">
          <h4>Ish beruvchilar uchun</h4>
          <p>Ish beruvchi paneli</p>
          <p>Mutaxassislar xaritasi</p>
          <p>Ishga olish bo‘yicha qo‘llanma</p>
        </div>

      </footer>

      <div className="footer-bottom">
        © 2026 Xorazm Job Ish Portali. Barcha huquqlar himoyalangan.
      </div>
    </>
  );
}

export default HomeFooter;