import { useState } from "react";
import { MapPin, DollarSign, Clock, GraduationCap } from "lucide-react";
import { Link } from "react-router-dom";
import "./JobCard.css";

function WorkerCard({
  id,
  name,
  surname,
  field,
  salary,
  district,
  experience,
  education,
  about,
  skills
}){

  const [expanded, setExpanded] = useState(false);

  const shortText =
    about && about.length > 160
      ? about.slice(0, 160) + "..."
      : about;

  return (
    <div className="job-card-horizontal">

      {/* HEADER */}
      <div className="job-header">

        <div className="job-title-row">
          <h2 className="job-title">
            {name} {surname}
          </h2>

          <span className="job-badge">
            Nomzod
          </span>
        </div>
<Link to={`/worker/${id}`} className="detail-btn">
    Batafsil
  </Link>
      </div>

      {/* FIELD */}
      <div className="job-company">
        {field}
      </div>

      {/* META */}
      <div className="job-meta">

        <span className="meta-item">
          <MapPin size={16}/>
          {district}
        </span>

        <span className="meta-item">
          <DollarSign size={16}/>
          {salary ? `${salary} mln` : "Kelishiladi"}
        </span>


<span className="meta-item">
<GraduationCap size={16}/>
{education || "Ko‘rsatilmagan"}
</span>
        <span className="meta-item">
          <Clock size={16}/>
          {experience} yil tajriba
        </span>

      </div>
{/* SKILLS */}
{skills && skills.length > 0 && (
  <div className="worker-skills">
    {skills.map((skill, index) => (
      <span key={index} className="skill-tag">
        {skill}
      </span>
    ))}
  </div>
)}
      {/* ABOUT */}
      {about && (
        <p className="job-description">

          {expanded ? about : shortText}

          {about.length > 160 && (
            <button
              className="read-more-btn"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? " Yopish" : " Batafsil"}
            </button>
          )}

        </p>
      )}

    </div>
  );
}

export default WorkerCard;