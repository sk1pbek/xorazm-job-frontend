import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";

import "./JobDetail.css";

import {
MapPin,
Briefcase,
Clock,
DollarSign,
Phone,
GraduationCap,
Languages,
User
} from "lucide-react";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import L from "leaflet";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

import HomeFooter from "../components/HomeFooter";

const DefaultIcon = L.icon({
  iconUrl,
  shadowUrl: iconShadow
});
L.Marker.prototype.options.icon = DefaultIcon;

function WorkerDetail() {

const { id } = useParams()

const [worker,setWorker] = useState(null)

const markerRef = useRef(null)

useEffect(()=>{

fetch(`http://localhost:8000/workers/${id}`)
.then(res=>res.json())
.then(data=>setWorker(data))

},[id])

if(!worker){
return <h2 style={{textAlign:"center",marginTop:"80px"}}>Yuklanmoqda...</h2>
}

/* AGE CALCULATION */
const age = worker.birth_year
? new Date().getFullYear() - worker.birth_year
: null

return (

<div className="job-detail-wrapper">

<div className="job-detail-layout">

<div className="job-left">

{/* HEADER */}
<div className="job-header-card">

<div className="job-header-top">

<div>
<h1>{worker.name} {worker.surname}</h1>
<p className="company-name">{worker.field}</p>
</div>

<div className="salary-box">
{worker.salary
? `Kutilayotgan ish haqi: ${worker.salary} mln`
: "Ish haqi: Kelishiladi"}
</div>

</div>

{/* INFO GRID */}
<div className="worker-info-grid">

<div className="worker-info-item">
<MapPin size={18}/>
<span>{worker.district}</span>
</div>

<div className="worker-info-item">
📍
<span>{worker.address}</span>
</div>

<div className="worker-info-item">
<Briefcase size={18}/>
<span>{worker.field}</span>
</div>

<div className="worker-info-item">
<GraduationCap size={18}/>
<span>{worker.education}</span>
</div>

<div className="worker-info-item">
<User size={18}/>
<span>{age} yosh</span>
</div>

<div className="worker-info-item">
<Languages size={18}/>
<span>English: {worker.english_level}</span>
</div>

<div className="worker-info-item">
<Languages size={18}/>
<span>Russian: {worker.russian_level}</span>
</div>

<div className="worker-info-item">
<Phone size={18}/>
<a href={`tel:${worker.phone}`} className="worker-phone">
{worker.phone}
</a>
</div>

<div className="worker-info-item">
<Clock size={18}/>
<span>{worker.experience} yil tajriba</span>
</div>

<div className="worker-info-item">
<DollarSign size={18}/>
<span>{worker.salary} mln</span>
</div>

</div>

</div>

{/* SKILLS */}
{worker.skills && worker.skills.length > 0 && (

<div className="job-section">

<h3>Ko'nikmalar</h3>

<div className="worker-skills">
{worker.skills.map((s,i)=>(
<span key={i} className="skill-tag">{s}</span>
))}
</div>

</div>

)}

{/* ABOUT */}
{worker.about && (

<div className="job-section">

<h3>Nomzod haqida</h3>
<p>{worker.about}</p>

</div>

)}

{/* MAP */}
{worker?.lat && worker?.lng && (

<div className="map-box">

<MapContainer
center={[Number(worker.lat), Number(worker.lng)]}
zoom={14}
scrollWheelZoom={false}
style={{height:"320px",width:"100%"}}
>

<TileLayer
url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
/>

<Marker
ref={markerRef}
position={[Number(worker.lat), Number(worker.lng)]}
eventHandlers={{
add:()=>{
markerRef.current.openPopup()
}
}}
>

<Popup>
<b>{worker.name}</b><br/>
{worker.address}
</Popup>

</Marker>

</MapContainer>

</div>

)}

</div>

</div>

<HomeFooter/>

</div>

)

}

export default WorkerDetail