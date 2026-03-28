import { Link } from "react-router-dom";
import { useState } from "react";
import {
  MapPin,
  
  Clock,
  
  DollarSign,
  
  Eye,
  Mail
} from "lucide-react";

import "./JobCard.css";

function formatDate(date){
if(!date) return ""

const created = new Date(date)
const now = new Date()

created.setHours(0,0,0,0)
now.setHours(0,0,0,0)

const diff = Math.floor((now - created) / (1000*60*60*24))

if(diff === 0) return "Bugun"
if(diff === 1) return "Kecha"
if(diff < 7) return diff + " kun oldin"

return created.toLocaleDateString()
}

function JobCard({
  id,
  title,
  company,
  salary,
  location,
  description,
  experience_required,
  work_time,
  education_level,
  employment_type,
  created_at,
  views_count,
  applications_count
}) {

  const [expanded, setExpanded] = useState(false);

  const shortText =
    description && description.length > 160
      ? description.slice(0, 160) + "..."
      : description;

  return (
    <div className="job-card-horizontal">

      {/* HEADER */}
      <div className="job-header">
        <div className="job-title-row">
          <h2 className="job-title">{title}</h2>

          <span className="job-badge">
            {employment_type}
          </span>
        </div>

        <Link to={`/job/${id}`} className="detail-btn">
          Batafsil
        </Link>
      </div>

      {/* COMPANY */}
      <div className="job-company">
        {company}
      </div>

      {/* META */}
      <div className="job-meta">

        <span className="meta-item">
          <MapPin size={16}/>
          {location}
        </span>

        <span className="meta-item">
          <DollarSign size={16}/>
          {salary ? `${salary} mln` : "Suhbatda kelishiladi"}
        </span>

        <span className="meta-item">
          <Clock size={16}/>
          {formatDate(created_at)}
        </span>

        <span className="meta-item">
          <Eye size={16}/>
          {views_count || 0}
        </span>

        <span className="meta-item">
          <Mail size={16}/>
          {applications_count || 0}
        </span>

      </div>

      {/* DESCRIPTION */}
      {description && (
        <p className="job-description">
          {expanded ? description : shortText}

          {description.length > 160 && (
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

export default JobCard;