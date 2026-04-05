import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./JobDetail.css";
import { 
MapPin, 
Briefcase, 
Clock, 
GraduationCap, 
Loader2,
Eye,
Mail
} from "lucide-react";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import L from "leaflet";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

import Chat from "./Chat";
import HomeFooter from "../components/HomeFooter";

// LEAFLET ICON FIX
const DefaultIcon = L.icon({
  iconUrl,
  shadowUrl: iconShadow
});
L.Marker.prototype.options.icon = DefaultIcon;


// DESCRIPTION FORMAT
function formatDescription(text){
if(!text) return ""

let formatted = text

formatted = formatted
.replace(/ • /g,"<br/>• ")
.replace(/ ✓ /g,"<br/>✓ ")
.replace(/ - /g,"<br/>- ")

formatted = formatted.replace(
/(https?:\/\/[^\s]+)/g,
'<a href="$1" target="_blank">$1</a>'
)

return formatted
}


function JobDetail() {

const { id } = useParams();
const navigate = useNavigate();
const [job, setJob] = useState(null);
const [applicationStatus,setApplicationStatus] = useState(null)
const [loadingApply,setLoadingApply] = useState(false)
const [age,setAge] = useState("")
const [experience,setExperience] = useState("")
const [education,setEducation] = useState("")
const [gender,setGender] = useState("")
const viewSent = useRef(false)
const [englishLevel,setEnglishLevel] = useState("")
const [russianLevel,setRussianLevel] = useState("")
const user = JSON.parse(localStorage.getItem("user") || "null")
const isEmployer = user?.role === "employer"
const markerRef = useRef(null)

// JOB LOAD
// JOB LOAD
useEffect(() => {

  const load = async () => {

    try{

      const res = await fetch(`${process.env.REACT_APP_API}/jobs/${id}`)
      const jobData = await res.json()

      setJob(jobData)

      if(!viewSent.current){

        viewSent.current = true

        fetch(`${process.env.REACT_APP_API}/jobs/${id}/view`,{
          method:"POST"
        })

      }

    }catch(e){
      console.log("Job load error",e)
    }

  }

  load()

},[id])



// 🔹 ARIZA STATUSINI TEKSHIRISH
useEffect(()=>{

if(!user?.id) return

fetch(`${process.env.REACT_APP_API}/myapplications/${user.id}`)
.then(res=>res.json())
.then(data=>{

const exist = data.find(a => a.job_id === Number(id))

if(exist){
setApplicationStatus(exist.status)
}

})

},[id, user])



// ARIZA YUBORISH
const applyJob = async ()=>{

// 🔴 AGAR USER LOGIN QILMAGAN BO‘LSA
if(!user){
navigate("/register")
return
}

if(!age){
alert("Yoshingizni kiriting")
return
}

if(!experience || !education || !gender){
alert("Barcha ma'lumotlarni to'ldiring")
return
}

if(!englishLevel || !russianLevel){
alert("Til darajalarini tanlang")
return
}

setLoadingApply(true)

try{

const res = await fetch(`${process.env.REACT_APP_API}/apply`,{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
job_id: job.id,
user_id: user.id,
age: age,
experience: experience,
education: education,
gender: gender,
english_level: englishLevel,
russian_level: russianLevel,
message:"Ariza yuborildi"
})
})

const data = await res.json()

if(!res.ok){
alert(data.detail || "Ariza yuborilmadi")
setLoadingApply(false)
return
}

setApplicationStatus("waiting")

alert("Ariza yuborildi")

}catch(e){
alert("Server xatosi")
}

setLoadingApply(false)

}



if (!job) {
return (
<h2 style={{ textAlign: "center", marginTop: "80px" }}>
Yuklanmoqda...
</h2>
);
}


return (
<div className="job-detail-wrapper">

<div className="job-detail-layout">

{/* LEFT */}
<div className="job-left">

<div className="job-header-card">

<div className="job-header-top">

<div>
<h1>{job.title}</h1>
<p className="company-name">{job.company}</p>

<div className="job-stats">

<span>
<Eye size={16}/> {job.views_count || 0} ko‘rildi
</span>

<span>
<Mail size={16}/> {job.applications_count || 0} ariza
</span>

<span>
<Clock size={16}/>
{
job.created_at
? new Date(job.created_at).toLocaleDateString()
: ""
}
</span>

</div>
</div>

<div className="salary-box">
{job.salary
? `Ish haqi: ${job.salary} mln so'm`
: "Ish haqi: Kelishiladi"}
</div>

</div>

<div className="detail-grid">

<div className="info-row">
<MapPin size={18} />
<span>{job.location}</span>
</div>

<div className="info-row">
<Briefcase size={18} />
<span>{job.employment_type}</span>
</div>

<div className="info-row">
<Clock size={18} />
<span>{job.work_time}</span>
</div>

<div className="info-row">
<GraduationCap size={18} />
<span>{job.education_level || "Ko‘rsatilmagan"}</span>
</div>

</div>

</div>


<div className="job-section">

<h3>Vakansiya tavsifi</h3>

<div
className="description-text"
dangerouslySetInnerHTML={{
__html: formatDescription(job.desc)
}}
></div>

</div>


{/* MAP */}
{job?.lat && job?.lng ? (

<div className="map-box">

<MapContainer
key={`${job.lat}-${job.lng}`}
center={[Number(job.lat), Number(job.lng)]}
zoom={15}
scrollWheelZoom={false}
style={{ height: "320px", width: "100%" }}
>

<TileLayer
attribution="&copy; OpenStreetMap"
url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
/>

<Marker
ref={markerRef}
position={[Number(job.lat), Number(job.lng)]}
eventHandlers={{
add: () => {
  if(markerRef.current){
    markerRef.current.openPopup()
  }
}
}}
>
<Popup>
<b>{job.title}</b><br />
{job.location}
</Popup>
</Marker>

</MapContainer>

</div>

) : null}

</div>


{/* RIGHT */}
<div className="job-right">

{!isEmployer && (

<>
{applicationStatus === "accepted" ? (

<Chat jobId={job.id} workerId={user?.id} employerId={job.user_id} />

) : applicationStatus === "waiting" ? (

<div className="application-waiting">

<div className="waiting-icon">
<Loader2 size={40} className="spin"/>
</div>

<h3>Arizangiz yuborildi</h3>

<p>HR sizning arizangizni ko‘rib chiqmoqda.</p>

<span className="waiting-note">
Javob berilgandan so‘ng chat ochiladi
</span>

</div>

) : (

<div className="chat-placeholder">

<h4>Nomzod talablari</h4>

<p><b>Yosh:</b> {
job.age_required === "Ahamiyatsiz"
? "Ahamiyatsiz"
: `${job.min_age} - ${job.max_age}`
}</p>

<p><b>Tajriba:</b> {job.experience_required || "Ahamiyatsiz"}</p>

<p><b>Ta'lim:</b> {job.education_level || "Ahamiyatsiz"}</p>

<p><b>Jins:</b> {job.gender || "Ahamiyatsiz"}</p>
<p>
<b>Ingliz tili:</b>{" "}
{job.english_level === "none"
? "Ahamiyatsiz"
: `IELTS ${job.english_level}`}
</p>

<p>
<b>Rus tili:</b>{" "}
{job.russian_level === "none"
? "Ahamiyatsiz"
: job.russian_level}
</p>
<hr/>

<p>HR bilan bog‘lanish uchun avval ariza yuboring</p>

<div className="apply-box">

<label>Yoshingiz</label>
<input
type="number"
placeholder="Masalan: 25"
value={age}
onChange={(e)=>setAge(Number(e.target.value))}
/>

<label>Tajribangiz</label>
<select
value={experience}
onChange={(e)=>setExperience(e.target.value)}
>
<option value="">Tajriba tanlang</option>
<option value="0">0 yil</option>
<option value="1">1 yil</option>
<option value="2">2 yil</option>
<option value="3">3 yil</option>
<option value="5">5+ yil</option>
</select>

<label>Ta'lim darajasi</label>
<select
value={education}
onChange={(e)=>setEducation(e.target.value)}
>
<option value="">Ta'lim tanlang</option>
<option>Ahamiyatsiz</option>
<option>O'rta</option>
<option>Bakalavr</option>
<option>Magistr</option>
</select>

<label>Jinsingiz</label>
<select
value={gender}
onChange={(e)=>setGender(e.target.value)}
>
<option value="">Jins tanlang</option>
<option>Erkak</option>
<option>Ayol</option>
</select>
<label>Ingliz tili darajasi (IELTS)</label>

<select
value={englishLevel}
onChange={(e)=>setEnglishLevel(e.target.value)}
>

<option value="">Tanlang</option>
<option value="4.5">IELTS 4.5</option>
<option value="5.5">IELTS 5.5</option>
<option value="6.5">IELTS 6.5</option>
<option value="7.5">IELTS 7.5+</option>

</select>

<label>Rus tili darajasi</label>

<select
value={russianLevel}
onChange={(e)=>setRussianLevel(e.target.value)}
>

<option value="">Tanlang</option>
<option value="A1">A1</option>
<option value="A2">A2</option>
<option value="B1">B1</option>
<option value="B2">B2</option>
<option value="C1">C1</option>

</select>
<button
className="apply-btn"
onClick={applyJob}
disabled={loadingApply}
>
{loadingApply ? "Yuborilmoqda..." : "Ariza yuborish"}
</button>

</div>

</div>

)}
</>

)}

</div>

</div>

<HomeFooter />

</div>
);
}

export default JobDetail;