import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Briefcase } from "lucide-react";
import LocationPicker from "../components/LocationPicker";
import "../Register.css";

import {
JOB_FIELDS,
EMPLOYMENT_TYPES,
EXPERIENCE_LEVELS,
EDUCATION_LEVELS,
WORK_TIMES,
WORK_MODES,
JOB_FOR
} from "../utils/filterOptions";

function AddJob() {

const [step,setStep]=useState(1)

const navigate=useNavigate()
const user=JSON.parse(localStorage.getItem("user"))

const [position,setPosition]=useState(null)

const [form,setForm]=useState({

age_required:"Ahamiyatsiz",
min_age:"",
max_age:"",

field:"Barchasi",

title:"",
company:"",
desc:"",
location:"",

salary:3,
negotiable:false,


english_level: "none",
russian_level: "none",

experience_required:"Talab etilmaydi",
work_time:"09:00 - 18:00",
employment_type:"Doimiy",

work_mode:"Odatiy (ish joyida)",

job_for:"Ahamiyatsiz",

education_levels:[
{level:"Ahamiyatsiz",university:"",faculty:""}
],

gender:"Ahamiyatsiz",
district:""
})

const update=(k,v)=>
setForm(prev=>({...prev,[k]:v}))



const updateEducation=(index,key,value)=>{
const updated=[...form.education_levels]
updated[index][key]=value
update("education_levels",updated)
}



const save=async()=>{

const payload = {
  ...form,
  salary: form.negotiable ? null : Number(form.salary),
  payment_type: form.negotiable ? "Suhbatda kelishiladi" : "Aniq",
  user_id: user.id,
  lat: position?.[0] || null,
  lng: position?.[1] || null
}

await fetch("http://localhost:8000/jobs",{
method:"POST",
headers:{ "Content-Type":"application/json"},
body:JSON.stringify(payload)
})

alert("Vakansiya qo‘shildi")
navigate("/my")

}

return(

<div className="reg-page">

<div className="reg-container">

<h2>Vakansiya joylash</h2>

<div className="step-bar">

<div className={`step ${step>=1?"active":""}`}>
<div className="step-circle">1</div>
<span>Ma'lumotlar</span>
</div>

<div className={`step-line ${step>=2?"active":""}`}></div>

<div className={`step ${step>=2?"active":""}`}>
<div className="step-circle">2</div>
<span>Talablar</span>
</div>

</div>

<div className="reg-card">

{step===1 &&(

<div className="career-card">

<div className="career-header">
<Briefcase size={30} className="section-icon"/>
<div>
<h3>Vakansiya ma'lumotlari</h3>
<p>Kerakli xodim haqida ma'lumot kiriting</p>
</div>
</div>

{/* SOHA */}
<label className="label-top">Soha</label>
<select
value={form.field}
onChange={e=>update("field",e.target.value)}
>
{JOB_FIELDS.map(f=>(
<option key={f} value={f}>{f}</option>
))}
</select>

<input
placeholder="Lavozim nomi"
value={form.title}
onChange={e=>update("title",e.target.value)}
/>

<input
placeholder="Kompaniya nomi"
value={form.company}
onChange={e=>update("company",e.target.value)}
/>

{/* MAOSH */}

{!form.negotiable &&(
<>
<label className="label-top">
Maosh: {form.salary} mln
</label>

<input
type="range"
min="1"
max="10"
value={form.salary}
onChange={e=>update("salary",e.target.value)}
className="exp-range"
/>
</>
)}

<label className="negotiable">

<input
type="checkbox"
checked={form.negotiable}
onChange={e=>update("negotiable",e.target.checked)}
/>

Suhbatda kelishamiz

</label>


{/* ISH VAQTI */}

<label className="label-top">
Ish vaqti
</label>

<select
value={form.work_time}
onChange={e=>update("work_time",e.target.value)}
>
{WORK_TIMES.map(t=>(
<option key={t} value={t}>{t}</option>
))}
</select>

{/* BANDLIK */}

<label className="label-top">
Bandlik turi
</label>

<select
value={form.employment_type}
onChange={e=>update("employment_type",e.target.value)}
>
{EMPLOYMENT_TYPES.map(type=>(
<option key={type} value={type}>{type}</option>
))}
</select>

{/* ISH USULI */}

<label className="label-top">
Ish usuli (rejimi)
</label>

<select
value={form.work_mode}
onChange={e=>update("work_mode",e.target.value)}
>
{WORK_MODES.map(mode=>(
<option key={mode} value={mode}>{mode}</option>
))}
</select>

{/* ISH KIMLAR UCHUN */}

<label className="label-top">
Ish kimlar uchun
</label>

<select
value={form.job_for}
onChange={e=>update("job_for",e.target.value)}
>

<option value="Ahamiyatsiz">Ahamiyatsiz</option>

{JOB_FOR.map(j=>(
<option key={j} value={j}>{j}</option>
))}

</select>


<label className="label-top">
Ish joyi joylashuvi (xaritada belgilang)
</label>

<LocationPicker
position={position}
setPosition={setPosition}
/>
{/* DISTRICT */}

<label className="label-top">Tuman</label>

<div className="districts">

{[
"Bogʻot","Gurlan","Urganch","Xiva","Xonqa",
"Shovot","Yangiariq","Yangibozor",
"Qoʻshkoʻpir","Hazorasp","Tuproqqalʼa"
].map(d => (

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
<label className="label-top">
Ish joyi manzili
</label>

<input
placeholder="Masalan: Urganch sh., Al-Xorazmiy ko‘chasi 12"
value={form.location || ""}
onChange={e=>update("location",e.target.value)}
/>


<label className="label-top">
Vakansiya tavsifi
</label>

<textarea
rows="4"
placeholder="Vakansiya haqida batafsil yozing..."
value={form.desc}
onChange={e=>update("desc",e.target.value)}
/>

<div className="reg-actions">

<button
className="btn"
onClick={()=>setStep(2)}
>
Keyingi →
</button>

</div>

</div>

)}

{/* STEP 2 */}

{step===2 &&(

<div className="career-card">

<div className="career-header">
<Briefcase size={30} className="section-icon"/>
<div>
<h3>Nomzodga qo‘yiladigan talablar</h3>
<p>Nomzod uchun talablarni belgilang</p>
</div>
</div>

{/* YOSH */}
<label className="label-top">
Yosh talabi
</label>

<select
value={form.age_required}
onChange={e=>update("age_required",e.target.value)}
>
<option>Ahamiyatsiz</option>
<option>Oraliq tanlash</option>
</select>

{form.age_required==="Oraliq tanlash" &&(

<div style={{display:"flex",gap:"10px",marginBottom:"15px"}}>

<input
type="number"
placeholder="Min yosh"
value={form.min_age}
onChange={e=>update("min_age",e.target.value)}
/>

<input
type="number"
placeholder="Max yosh"
value={form.max_age}
onChange={e=>update("max_age",e.target.value)}
/>

</div>

)}

{/* TAJRIBA */}

<label className="label-top">
Ish tajribasi
</label>

<select
value={form.experience_required}
onChange={e=>update("experience_required",e.target.value)}
>
{EXPERIENCE_LEVELS.map(exp=>(
<option key={exp} value={exp}>{exp}</option>
))}
</select>

{/* TALIM */}

<label className="label-top">
Ta'lim darajasi
</label>

<select
value={form.education_levels[0].level}
onChange={e=>updateEducation(0,"level",e.target.value)}
>
{EDUCATION_LEVELS.map(level=>(
<option key={level} value={level}>{level}</option>
))}
</select>

{/* TIL */}

<label className="label-top">
Ingliz tili darajasi
</label>

<select
value={form.english_level}
onChange={e=>update("english_level",e.target.value)}
>

<option value="none">Ahamiyatsiz</option>
<option value="4.5">IELTS 4.5</option>
<option value="5.5">IELTS 5.5</option>
<option value="6.5">IELTS 6.5</option>
<option value="7.5">IELTS 7.5+</option>

</select>

<label className="label-top">
Rus tili darajasi
</label>

<select
value={form.russian_level}
onChange={e=>update("russian_level",e.target.value)}
>

<option value="none">Ahamiyatsiz</option>
<option value="A1">A1</option>
<option value="A2">A2</option>
<option value="B1">B1</option>
<option value="B2">B2</option>
<option value="C1">C1</option>

</select>



{/* JINS */}

<label className="label-top">
Jins talabi
</label>

<select
value={form.gender}
onChange={e=>update("gender",e.target.value)}
>
<option>Ahamiyatsiz</option>
<option>Erkak</option>
<option>Ayol</option>
</select>

<div className="reg-actions">

<button
className="btn-secondary"
onClick={()=>setStep(1)}
>
← Orqaga
</button>

<button
className="btn"
onClick={save}
>
Joylash
</button>

</div>

</div>

)}

</div>

</div>

</div>

)

}

export default AddJob