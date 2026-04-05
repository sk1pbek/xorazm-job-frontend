import { useEffect, useState, useRef } from "react";
import HomeFooter from "../components/HomeFooter";
import LocationPicker from "../components/LocationPicker";
import defaultAvatar from "../assets/default.png";
import maleAvatar from "../assets/male.png";
import femaleAvatar from "../assets/female.png";
import "./Profile.css";

const DISTRICTS = [
  "Bogʻot","Gurlan","Urganch","Xiva","Xonqa",
  "Shovot","Yangiariq","Yangibozor",
  "Qoʻshkoʻpir","Hazorasp","Tuproqqalʼa"
];

function Profile() {

  const [avatar, setAvatar] = useState(defaultAvatar);
  const [user, setUser] = useState(null);
  const [skills, setSkills] = useState([]);
  const [jobs, setJobs] = useState([]);

  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [about, setAbout] = useState("");
  const [address, setAddress] = useState("");
  const [district, setDistrict] = useState("");
  const [education, setEducation] = useState("");
  const [experience, setExperience] = useState("");
  const [salary, setSalary] = useState("");
  const [phone, setPhone] = useState("");
  const [englishLevel, setEnglishLevel] = useState("");
  const [russianLevel, setRussianLevel] = useState("");
  const [position, setPosition] = useState(null);

  const [secTab, setSecTab] = useState("password");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMsg, setPasswordMsg] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [emailPassword, setEmailPassword] = useState("");
  const [emailMsg, setEmailMsg] = useState("");

  const uRef = useRef(null);
  if (!uRef.current) {
    const stored = localStorage.getItem("user");
    uRef.current = stored ? JSON.parse(stored) : null;
  }
  const u = uRef.current;

  useEffect(() => {
    const saved = localStorage.getItem("avatar");
    if (saved === "male") setAvatar(maleAvatar);
    else if (saved === "female") setAvatar(femaleAvatar);
    else setAvatar(defaultAvatar);
  }, []);

  useEffect(() => {
    if (!u) return;
    fetch(`http://localhost:8000/profile/${u.id}`)
      .then(r => r.json())
      .then(data => {
        setUser(data.user);
        setSkills(data.skills);
        setJobs(data.jobs);
        fillForm(data.user);
      })
      .catch(() => console.error("Profil yuklanmadi"));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fillForm = (d) => {
    setName(d.name || "");
    setSurname(d.surname || "");
    setAbout(d.about || "");
    setAddress(d.address || "");
    setDistrict(d.district || "");
    setEducation(d.education || "");
    setExperience(d.experience || "");
    setSalary(d.salary || "");
    setPhone(d.phone || "");
    setEnglishLevel(d.english_level || "");
    setRussianLevel(d.russian_level || "");
    if (d.lat && d.lng) setPosition([d.lat, d.lng]);
  };

  const handleStartEdit = () => {
    if (user) fillForm(user);
    setEditMode(true);
  };

  const changeAvatar = (type) => {
    localStorage.setItem("avatar", type);
    if (type === "male") setAvatar(maleAvatar);
    else if (type === "female") setAvatar(femaleAvatar);
    else setAvatar(defaultAvatar);
  };

  const saveProfile = async () => {
    try {
      await fetch(`http://localhost:8000/profile/update/${u.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name, surname, about, address, district,
          education, experience, salary, phone,
          english_level: englishLevel,
          russian_level: russianLevel,
          lat: position ? position[0] : null,
          lng: position ? position[1] : null,
        })
      });
      setUser(prev => ({
        ...prev,
        name, surname, about, address, district,
        education, experience, salary, phone,
        english_level: englishLevel,
        russian_level: russianLevel,
        lat: position ? position[0] : null,
        lng: position ? position[1] : null,
      }));
      setEditMode(false);
    } catch {
      alert("Saqlashda xatolik");
    }
  };

  const savePassword = async () => {
    setPasswordMsg("");
    if (!oldPassword || !newPassword || !confirmPassword) {
      setPasswordMsg("Barcha maydonlarni to'ldiring"); return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMsg("Yangi parollar mos emas"); return;
    }
    try {
      const res = await fetch(`http://localhost:8000/profile/change-password/${u.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ old_password: oldPassword, new_password: newPassword })
      });
      if (!res.ok) { const err = await res.json(); setPasswordMsg(err.detail || "Xatolik"); return; }
      setPasswordMsg("✅ Parol muvaffaqiyatli o'zgartirildi");
      setOldPassword(""); setNewPassword(""); setConfirmPassword("");
      setTimeout(() => setPasswordMsg(""), 2000);
    } catch { setPasswordMsg("Server xatosi"); }
  };

  const saveEmail = async () => {
    setEmailMsg("");
    if (!newEmail || !emailPassword) { setEmailMsg("Barcha maydonlarni to'ldiring"); return; }
    try {
      const res = await fetch(`http://localhost:8000/profile/change-email/${u.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ new_email: newEmail, password: emailPassword })
      });
      if (!res.ok) { const err = await res.json(); setEmailMsg(err.detail || "Xatolik"); return; }
      setEmailMsg("✅ Email muvaffaqiyatli o'zgartirildi");
      setUser(prev => ({ ...prev, email: newEmail }));
      setNewEmail(""); setEmailPassword("");
      setTimeout(() => setEmailMsg(""), 2000);
    } catch { setEmailMsg("Server xatosi"); }
  };

  if (!user) return <div className="profile-loading">Loading...</div>;

  return (
    <div className="profile-container">
      <div className="profile-main">

        {/* HEADER */}
        <div className="profile-header">
          <img className="profile-avatar" src={avatar} alt="avatar" />
          <div className="profile-info">
            {!editMode && <h2>{user.name} {user.surname}</h2>}
            {editMode && (
              <div className="edit-name">
                <input value={name} onChange={e => setName(e.target.value)} placeholder="Ism" />
                <input value={surname} onChange={e => setSurname(e.target.value)} placeholder="Familiya" />
              </div>
            )}
            {user.role === "worker" && <p>{user.field || "Kasb ko'rsatilmagan"}</p>}
            {user.role === "employer" && <p>Ish beruvchi</p>}
          </div>
          {!editMode
            ? <button className="edit-btn" onClick={handleStartEdit}>Profilni tahrirlash</button>
            : (
              <div className="edit-buttons">
                <button className="save-btn" onClick={saveProfile}>Saqlash</button>
                <button className="edit-btn" onClick={() => setEditMode(false)}>Bekor qilish</button>
              </div>
            )
          }
        </div>

        {/* AVATAR */}
        {editMode && (
          <div className="avatar-select">
            <button onClick={() => changeAvatar("male")}>Erkak avatar</button>
            <button onClick={() => changeAvatar("female")}>Ayol avatar</button>
            <button onClick={() => changeAvatar("default")}>Logo</button>
          </div>
        )}

        {/* MEN HAQIMDA */}
        <div className="profile-card">
          <h3>Men haqimda</h3>
          {!editMode
            ? <p>{user.about || "Foydalanuvchi hali ma'lumot kiritmagan"}</p>
            : <textarea value={about} onChange={e => setAbout(e.target.value)} className="about-input" />
          }
        </div>

        {/* ALOQA */}
        <div className="profile-card">
          <h3>Aloqa ma'lumotlari</h3>
          <div className="profile-grid">
            <div>
              <span>Telefon</span>
              {!editMode
                ? <p>{user.phone || "-"}</p>
                : <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+998 __ ___ __ __" />
              }
            </div>
            <div>
              <span>Email</span>
              <p>{user.email}</p>
            </div>
            <div>
              <span>Manzil</span>
              {!editMode
                ? <p>{user.address || "-"}</p>
                : <input value={address} onChange={e => setAddress(e.target.value)} placeholder="Ko'cha, uy..." />
              }
            </div>
          </div>
        </div>

        {/* JOYLASHUV */}
        <div className="profile-card">
          <h3>Joylashuv</h3>

          {/* TUMAN */}
          <p className="location-label">Tumaningiz</p>
          <div className="districts">
            {DISTRICTS.map(d => (
              <button
                key={d}
                type="button"
                disabled={!editMode}
                className={`district ${district === d ? "active" : ""} ${!editMode ? "district-disabled" : ""}`}
                onClick={() => editMode && setDistrict(d)}
              >
                {d}
              </button>
            ))}
          </div>

          {/* XARITA */}
          <p className="location-label" style={{ marginTop: 24 }}>
            Uy joylashuvi (xaritada)
          </p>

          {editMode ? (
            <>
              <LocationPicker
                position={position}
                setPosition={(pos) => setPosition(pos)}
              />
              <input
                className="location-address-input"
                style={{ marginTop: 10 }}
                value={address}
                onChange={e => setAddress(e.target.value)}
                placeholder="Aniq manzil (ko'cha, uy raqami...)"
              />
            </>
          ) : (
            position
              ? (
                <div className="location-view">
                  <span className="location-pin">📍</span>
                  <div>
                    <p className="location-coords">{position[0]?.toFixed(5)}, {position[1]?.toFixed(5)}</p>
                    {user.address && <p className="location-address-text">{user.address}</p>}
                  </div>
                </div>
              )
              : <p className="location-empty">Joylashuv belgilanmagan</p>
          )}
        </div>

        {/* PROFESSIONAL */}
        {user.role === "worker" && (
          <div className="profile-card">
            <h3>Professional ma'lumotlar</h3>
            <div className="profile-grid">
              <div>
                <span>Ma'lumoti</span>
                {!editMode
                  ? <p>{user.education || "-"}</p>
                  : <input value={education} onChange={e => setEducation(e.target.value)} />
                }
              </div>
              <div>
                <span>Tajriba</span>
                {!editMode
                  ? <p>{user.experience ? `${user.experience} yil` : "-"}</p>
                  : <input type="number" value={experience} onChange={e => setExperience(e.target.value)} />
                }
              </div>
              <div>
                <span>Kutilayotgan maosh</span>
                {!editMode
                  ? <p>{user.salary ? `${user.salary} UZS` : "Kelishiladi"}</p>
                  : <input type="number" value={salary} onChange={e => setSalary(e.target.value)} />
                }
              </div>
              <div>
                <span>Ingliz tili (IELTS)</span>
                {!editMode
                  ? <p>{user.english_level || "-"}</p>
                  : (
                    <select value={englishLevel} onChange={e => setEnglishLevel(e.target.value)}>
                      <option value="">Tanlang</option>
                      <option value="4.5">IELTS 4.5</option>
                      <option value="5.5">IELTS 5.5</option>
                      <option value="6.5">IELTS 6.5</option>
                      <option value="7.5">IELTS 7.5+</option>
                    </select>
                  )
                }
              </div>
              <div>
                <span>Rus tili</span>
                {!editMode
                  ? <p>{user.russian_level || "-"}</p>
                  : (
                    <select value={russianLevel} onChange={e => setRussianLevel(e.target.value)}>
                      <option value="">Tanlang</option>
                      <option value="A1">A1</option>
                      <option value="A2">A2</option>
                      <option value="B1">B1</option>
                      <option value="B2">B2</option>
                      <option value="C1">C1</option>
                    </select>
                  )
                }
              </div>
            </div>
          </div>
        )}

        {/* KO'NIKMALAR */}
        {user.role === "worker" && (
          <div className="profile-card">
            <h3>Ko'nikmalar</h3>
            <div className="skills">
              {skills.length === 0
                ? <p>Ko'nikmalar kiritilmagan</p>
                : skills.map(s => <span key={s.id}>{s.name}</span>)
              }
            </div>
          </div>
        )}

        {/* XAVFSIZLIK */}
        <div className="profile-card security-card">
          <h3>Xavfsizlik</h3>
          <div className="security-tabs">
            <button className={`sec-tab ${secTab === "password" ? "active" : ""}`}
              onClick={() => { setSecTab("password"); setPasswordMsg(""); setEmailMsg(""); }}>
              🔒 Parol o'zgartirish
            </button>
            <button className={`sec-tab ${secTab === "email" ? "active" : ""}`}
              onClick={() => { setSecTab("email"); setPasswordMsg(""); setEmailMsg(""); }}>
              ✉️ Email o'zgartirish
            </button>
          </div>

          {secTab === "password" && (
            <div className="sec-form">
              <div className="sec-field">
                <label>Eski parol</label>
                <input type="password" placeholder="••••••••" value={oldPassword} onChange={e => setOldPassword(e.target.value)} />
              </div>
              <div className="sec-field">
                <label>Yangi parol</label>
                <input type="password" placeholder="••••••••" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
              </div>
              <div className="sec-field">
                <label>Yangi parolni tasdiqlang</label>
                <input type="password" placeholder="••••••••" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
              </div>
              {passwordMsg && <p className={passwordMsg.startsWith("✅") ? "msg-ok" : "msg-err"}>{passwordMsg}</p>}
              <button className="sec-save-btn" onClick={savePassword}>Saqlash</button>
            </div>
          )}

          {secTab === "email" && (
            <div className="sec-form">
              <div className="sec-field">
                <label>Joriy email</label>
                <input type="text" value={user.email} disabled className="disabled-input" />
              </div>
              <div className="sec-field">
                <label>Yangi email</label>
                <input type="email" placeholder="yangi@email.com" value={newEmail} onChange={e => setNewEmail(e.target.value)} />
              </div>
              <div className="sec-field">
                <label>Parolingiz (tasdiqlash)</label>
                <input type="password" placeholder="••••••••" value={emailPassword} onChange={e => setEmailPassword(e.target.value)} />
              </div>
              {emailMsg && <p className={emailMsg.startsWith("✅") ? "msg-ok" : "msg-err"}>{emailMsg}</p>}
              <button className="sec-save-btn" onClick={saveEmail}>Saqlash</button>
            </div>
          )}
        </div>

        {/* EMPLOYER VAKANSIYALARI */}
        {user.role === "employer" && (
          <div className="profile-card">
            <h3>Mening vakansiyalarim</h3>
            {jobs.length === 0
              ? <p>Siz hali vakansiya joylamagansiz</p>
              : (
                <div className="employer-jobs">
                  {jobs.map(job => (
                    <div className="job-card" key={job.id}>
                      <h4>{job.title}</h4>
                      <p>Maosh: {job.salary}</p>
                      <p>Ko'rishlar: {job.views}</p>
                    </div>
                  ))}
                </div>
              )
            }
          </div>
        )}

      </div>
      <HomeFooter />
    </div>
  );
}

export default Profile;