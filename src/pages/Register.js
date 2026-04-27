import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Briefcase, Languages } from "lucide-react";
import LocationPicker from "../components/LocationPicker";
import "../Register.css";

function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [skills, setSkills] = useState([]);
  const [position, setPosition] = useState(null);
  const [form, setForm] = useState({
    name: "",
    surname: "",
    phone: "",
    email: "",
    password: "",
    role: "worker",
    district: "",
    education: "O‘rta maxsus",
    field: "",
    experience: 1,
    salary: "",
    negotiable: false,
    about: "",
    english_level: "Ahamiyatsiz",
    russian_level: "Ahamiyatsiz",
    birth_year: "",
    skills: [],
    lat: null,
    lng: null,
    address: ""
  });

  const update = (key, value) =>
    setForm(prev => ({ ...prev, [key]: value }));

  // VALIDATION
const validate = () => {
  if (!form.name.trim())     { alert("Ism kiriting");     return false; }
  if (!form.surname.trim())  { alert("Familiya kiriting"); return false; }
  if (!form.phone.trim())    { alert("Telefon kiriting");  return false; }
  if (!form.email.trim())    { alert("Email kiriting");    return false; }
  if (!form.password.trim()) { alert("Parol kiriting");    return false; }
  return true;
};

 const save = async () => {
  if (!validate()) return;

  setLoading(true);

  try {
   const res = await fetch(`${process.env.REACT_APP_API}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    // ✅ server xatosini tekshirish
    if (!res.ok) {
      const err = await res.json();
      alert(err.detail || "Xatolik yuz berdi");
      return;
    }

    alert("Ro'yxatdan o'tildi");
    navigate("/login");

  } catch (err) {
    alert("Serverda xatolik");
  } finally {
    setLoading(false);
  }
};

  // SKILL TANLASH
  const toggleSkill = (id) => {

    if (form.skills.includes(id)) {

      update("skills", form.skills.filter(s => s !== id));

    } else {

      update("skills", [...form.skills, id]);

    }

  };

  return (
    <div className="reg-page">
      <div className="reg-container">
        <h2>Nomzod sifatida ro'yxatdan o'tish</h2>

        <div className="reg-card">

          {/* SHAXSIY MALUMOT */}
          <div className="career-card">

            <div className="career-header">
              <User size={30} className="section-icon" />
              <div>
                <h3>Shaxsiy ma'lumotlar</h3>
                <p>Asosiy kontakt ma'lumotlaringizni kiriting</p>
              </div>
            </div>

            <input
              placeholder="Ism"
              value={form.name}
              onChange={(e)=>update("name", e.target.value)}
            />

            <input
              placeholder="Familiya"
              value={form.surname}
              onChange={(e)=>update("surname", e.target.value)}
            />

            <input
              type="number"
              placeholder="Tug‘ilgan yil"
              value={form.birth_year}
              onChange={(e)=>{
  const v = e.target.value
  update("birth_year", v ? Number(v) : null)
}}
            />

            <input
              placeholder="+998 90 123 45 67"
              value={form.phone}
              onChange={(e)=>{
                let v = e.target.value.replace(/\D/g,"");
                if(!v.startsWith("998")) v = "998"+v;
                v = "+" + v.slice(0,12);
                update("phone", v);
              }}
            />
        <label className="label-top">
Uy joylashuvi (xaritada belgilang)
</label>

<LocationPicker
position={position}
setPosition={(pos)=>{
  setPosition(pos)

  update("lat", pos?.[0])
  update("lng", pos?.[1])
}}
/>

<label className="label-top">
Uy manzili
</label>

<input
placeholder="Masalan: Bog‘ot tumani Navbahor MFY"
value={form.address}
onChange={e=>update("address", e.target.value)}
/>



            <input
              placeholder="Email yarating"
              value={form.email}
              onChange={(e)=>update("email", e.target.value)}
            />

            <input
              type="password"
              placeholder="Parol yarating"
              value={form.password}
              onChange={(e)=>update("password", e.target.value)}
            />

            <div className="pass-strength">
              <div
                style={{
                  width:
                  form.password.length < 4
                  ? "30%"
                  : form.password.length < 8
                  ? "60%"
                  : "100%"
                }}
              />
            </div>
            

          </div>


          {/* KASBIY */}
          <div className="career-card">

            <div className="career-header">
              <Briefcase size={30} className="section-icon" />
              <div>
                <h3>Kasbiy ma'lumotlar va Tajriba</h3>
                <p>Professional ko‘nikmalaringizni belgilang</p>
              </div>
            </div>


            <div className="career-grid">

              {/* SOHA */}
              <div>

                <label>Soha / Mutaxassislik</label>

                <select
                  value={form.field}
                  onChange={async (e)=>{

                    const field = e.target.value;

                    update("field", field);

                    if(!field) return;

                    const res = await fetch(
                      `${process.env.REACT_APP_API}/skills?field=${encodeURIComponent(field)}`
                    );

                    const data = await res.json();

                    setSkills(data);

                  }}
                >

                  <option value="">Sohani tanlang</option>

                  {/* BU SOHALAR DATABASE dagi skills.field bilan bir xil */}
                  <option>Sanoat va ishlab chiqarish</option>
                  <option>Xizmatlar</option>
                  <option>Ta'lim, madaniyat, sport</option>
                  <option>Sog'liqni saqlash</option>
                  <option>Qishloq xo'jaligi</option>
                  <option>Moliya, iqtisod, boshqaruv</option>
                  <option>Qurilish</option>
                  <option>Transport</option>
                  <option>Savdo va marketing</option>
                  <option>Axborot texnologiyalari</option>
                  <option>Qurilish va ta'mirlash</option>
                  <option>Go'zallik va sog'lomlashtirish</option>
                  <option>Oziq-ovqat va oshpazlik</option>
                  <option>Xavfsizlik va qo'riqchilik</option>
                  <option>Huquq va davlat xizmati</option>
                  <option>Uy xizmatlari</option>
                  <option>Kadrlar va HR</option>
                  <option>Energetika va kommunal xizmatlar</option>
                  <option>Boshqa</option>
                </select>

              </div>


              {/* TALIM */}
              <div>

                <label>Ma'lumot darajasi</label>

                <select
                  value={form.education}
                  onChange={(e)=>update("education", e.target.value)}
                >
                  <option>O‘rta maxsus</option>
                  <option>Bakalavr</option>
                  <option>Magistr</option>
                </select>

              </div>

            </div>


          {skills.length > 0 && (
  <>
    <label className="label-top">Ko'nikmalar</label>
    <div className="skills-grid">
      {skills.map(s => (
        <label key={s.id} className="skill-item">
          <input
            type="checkbox"
            checked={form.skills.includes(s.id)}
            onChange={()=>toggleSkill(s.id)}
          />
          <span>{s.name}</span>
        </label>
      ))}
    </div>
  </>
)}


            {/* DISTRICT */}
            <label className="label-top">Tumaningiz</label>

            <div className="districts">

              {[
                "Bogʻot","Gurlan","Urganch","Xiva","Xonqa",
                "Shovot","Yangiariq","Yangibozor",
                "Qoʻshkoʻpir","Hazorasp","Tuproqqalʼa"
              ].map(d=>(
                <button
                  key={d}
                  type="button"
                  className={form.district===d ? "district active":"district"}
                  onClick={()=>update("district", d)}
                >
                  {d}
                </button>
              ))}

            </div>


            {/* EXPERIENCE */}
            <label className="label-top">
              Ish tajribasi (yil)
              <span className="exp-badge">{form.experience} yil</span>
            </label>

            <input
              type="range"
              min="0"
              max="10"
              value={form.experience}
             onChange={(e)=>update("experience", parseInt(e.target.value))}
              className="exp-range"
            />


            {/* SALARY */}
            <label className="label-top">
              Kutilayotgan ish haqi (mln UZS)
            </label>

            <div className="salary-row">

              <div className="salary-input-wrap">

                <input
                  type="text"
                  placeholder="Masalan: 5"
                  value={form.salary}
                 onChange={(e)=>{
  const v = e.target.value.replace(/\D/g,"")
  update("salary", v ? Number(v) : null)
}}
                  className="salary-input"
                />

                <span className="salary-suffix">mln</span>

              </div>

              <span className="salary-or">yoki</span>

              <label className="negotiable">

                <input
                  type="checkbox"
                  checked={form.negotiable}
                  onChange={(e)=>update("negotiable", e.target.checked)}
                />

                Suhbatda kelishamiz

              </label>

            </div>


            {/* LANGUAGE */}
            <label className="label-top icon-label">
              <Languages size={30} className="section-icon"/>
              Biladigan tillar
            </label>

            <div className="career-grid">

<div>

<label>Ingliz tili darajasi</label>

<select
value={form.english_level}
onChange={(e)=>update("english_level", e.target.value)}
>

<option>Ahamiyatsiz</option>
<option>A1</option>
<option>A2</option>
<option>B1</option>
<option>B2</option>
<option>C1</option>
<option>C2</option>

</select>

</div>

<div>

<label>Rus tili darajasi</label>

<select
value={form.russian_level}
onChange={(e)=>update("russian_level", e.target.value)}
>

<option>Ahamiyatsiz</option>
<option>A1</option>
<option>A2</option>
<option>B1</option>
<option>B2</option>
<option>C1</option>
<option>C2</option>

</select>

</div>

</div>


            {/* ABOUT */}
            <label className="label-top">Qo‘shimcha ma'lumotlar</label>

            <textarea
              rows="4"
              placeholder="O'zingiz haqida qisqacha yozing..."
              value={form.about}
              onChange={(e)=>update("about", e.target.value)}
            />

          </div>


          <div className="reg-actions">

            <button
              className="btn"
              onClick={save}
              disabled={loading}
            >

              {loading ? "Yuklanmoqda..." : "Ro‘yxatdan o‘tish"}

            </button>

          </div>

        </div>
      </div>
    </div>
  );
}

export default Register;