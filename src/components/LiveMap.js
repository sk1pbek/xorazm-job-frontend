import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Tooltip,
  useMap,
  ZoomControl
} from "react-leaflet";
import L from "leaflet";

/* ===== CUSTOM MARKER ICON ===== */
import markerIcon from "../assets/logo1.png";
import homeIconImg from "../assets/home-button.png";
import "./LiveMap.css";

const homeIcon = new L.Icon({
  iconUrl: homeIconImg,
  iconSize: [25, 25],
  iconAnchor: [17, 35],
  popupAnchor: [0, -35]
});

const customIcon = new L.Icon({
  iconUrl: markerIcon,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40]
});

/* ===== DISTRICT COORDINATES ===== */
const districts = {
  Urganch: [41.55, 60.63, 12],
  Xiva: [41.38, 60.36, 13],
  "Bog'ot": [41.35495, 60.82170, 13],
  Gurlan: [41.84, 60.39, 12],
  Hazorasp: [41.32, 61.07, 12],
  Xonqa: [41.47, 60.78, 12],
  "Qo'shko'pir": [41.53, 60.34, 12],
  Shovot: [41.65, 60.30, 12],
  Yangiariq: [41.31, 60.61, 12],
  Yangibozor: [41.68, 60.70, 12],
  "Tuproqqal'a": [41.30268, 61.08842, 12],
};

/* ===== MAP CONTROLLER ===== */
function MapController({ jobs, workers, selectedDistrict }) {
  const map = useMap();

  useEffect(() => {

    // 1️⃣ Tuman tanlangan bo'lsa
    if (selectedDistrict && selectedDistrict !== "Hammasi") {
      const district = districts[selectedDistrict];
      if (district) {
        map.flyTo([district[0], district[1]], district[2], {
          duration: 1.5
        });
      }
      return;
    }

    // 2️⃣ Agar user kirib kelgan bo'lsa va hech narsa qidirilmagan bo'lsa
    // Eng yaqin ishga yaqinlashish
    const user = JSON.parse(localStorage.getItem("user"));
    const allItems = [...(jobs || []), ...(workers || [])];
    
    const coordinates = allItems
      .filter(item => item.lat && item.lng)
      .map(item => [Number(item.lat), Number(item.lng)]);

    if (coordinates.length === 0) return;

    // ✅ Agar user koordinatalari bor bo'lsa, eng yaqin ishni topamiz
    if (user?.lat && user?.lng) {
      const userLat = Number(user.lat);
      const userLng = Number(user.lng);

      // Masofani hisoblash
      const distance = (lat1, lng1, lat2, lng2) => {
        const R = 6371; // km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLng = (lng2 - lng1) * Math.PI / 180;
        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(lat1 * Math.PI / 180) *
          Math.cos(lat2 * Math.PI / 180) *
          Math.sin(dLng / 2) * Math.sin(dLng / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
      };

      // Eng yaqin ishni topish
      let nearestJob = null;
      let minDistance = Infinity;

      allItems.forEach(item => {
        if (item.lat && item.lng) {
          const d = distance(userLat, userLng, item.lat, item.lng);
          if (d < minDistance) {
            minDistance = d;
            nearestJob = item;
          }
        }
      });

      // ✅ Eng yaqin ishga yaqinlashish
      if (nearestJob) {
        map.flyTo([Number(nearestJob.lat), Number(nearestJob.lng)], 16, {
          duration: 6
        });
        return;
      }
    }

    // 3️⃣ Agar user koordinatalari yo'q bo'lsa yoki filter bo'yicha
    // Barcha natijalarni ko'rsatish
    if (coordinates.length === 1) {
      map.flyTo(coordinates[0], 14, { duration: 1.5 });
    } else if (coordinates.length > 1) {
      const bounds = L.latLngBounds(coordinates);
      map.fitBounds(bounds, {
        padding: [50, 50],
        duration: 1.5,
        maxZoom: 13
      });
    }

  }, [selectedDistrict, jobs, workers, map]);

  return null;
}

/* ===== ZOOM WATCHER ===== */
function ZoomWatcher({ setZoom }) {
  const map = useMap();

  useEffect(() => {
    const updateZoom = () => {
      setZoom(map.getZoom());
    };
    map.on("zoomend", updateZoom);
    updateZoom();
    return () => {
      map.off("zoomend", updateZoom);
    };
  }, [map, setZoom]);

  return null;
}

function LiveMap({ jobs, workers, selectedDistrict }) {
  const navigate = useNavigate();
  const [zoom, setZoom] = useState(11);
  const user = JSON.parse(localStorage.getItem("user"));

  const defaultCenter =
    user?.lat && user?.lng
      ? [Number(user.lat), Number(user.lng)]
      : [41.55, 60.63];

  return (
    <MapContainer
      center={defaultCenter}
      zoom={14}
      zoomControl={false}
      style={{
        height: "100%",
        width: "100%",
        borderRadius: "18px"
      }}
    >
      <ZoomControl position="bottomright" />

      <TileLayer
        attribution="&copy; OpenStreetMap"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <ZoomWatcher setZoom={setZoom} />

      {user?.lat && user?.lng && (
        <Marker
          position={[Number(user.lat), Number(user.lng)]}
          icon={homeIcon}
        >
          <Popup>🏠 Mening uyim</Popup>
        </Marker>
      )}

      <MapController
        jobs={jobs}
        workers={workers}
        selectedDistrict={selectedDistrict}
      />

      {jobs.map(job =>
        job.lat && job.lng ? (
          <Marker
            key={job.id}
            position={[Number(job.lat), Number(job.lng)]}
            icon={customIcon}
            eventHandlers={{
              click: () => navigate(`/job/${job.id}`)
            }}
          >
            {zoom >= 13 && (
              <Tooltip
                permanent
                direction="top"
                offset={[0, -35]}
                className="job-label"
              >
                {job.title}
              </Tooltip>
            )}
            <Tooltip
              direction="right"
              offset={[15, 0]}
              opacity={1}
              className="salary-badge"
            >
              {job.title} — {job.salary} mln so'm
            </Tooltip>

            <Popup>
              <div style={{ minWidth: 180 }}>
                <h4 style={{ margin: "0 0 6px", fontSize: 16 }}>
                  {job.title}
                </h4>
                <p style={{
                  margin: "0 0 6px",
                  color: "#64748b",
                  fontSize: 13
                }}>
                  {job.company}
                </p>
                <p style={{
                  margin: 0,
                  color: "#2563eb",
                  fontWeight: 700
                }}>
                  {job.salary} mln so'm
                </p>
              </div>
            </Popup>
          </Marker>
        ) : null
      )}

      {workers && workers.map(worker =>
        worker.lat && worker.lng ? (
          <Marker
            key={"worker-" + worker.id}
            position={[Number(worker.lat), Number(worker.lng)]}
            icon={customIcon}
            eventHandlers={{
              click: () => navigate(`/worker/${worker.id}`)
            }}
          >
            {zoom >= 13 && (
              <Tooltip
                permanent
                direction="top"
                offset={[0, -35]}
                className="job-label"
              >
                {worker.name} {worker.surname}
              </Tooltip>
            )}

            <Tooltip
              direction="right"
              offset={[15, 0]}
              opacity={1}
              className="salary-badge"
            >
              {worker.field}
            </Tooltip>

            <Popup>
              <div style={{ minWidth: 180 }}>
                <h4 style={{ margin: "0 0 6px", fontSize: 16 }}>
                  {worker.name} {worker.surname}
                </h4>
                <p style={{
                  margin: "0 0 6px",
                  color: "#64748b",
                  fontSize: 13
                }}>
                  {worker.field}
                </p>
                <p style={{
                  margin: 0,
                  color: "#2563eb",
                  fontWeight: 700
                }}>
                  {worker.salary
                    ? worker.salary + " mln"
                    : "Kelishiladi"}
                </p>
              </div>
            </Popup>
          </Marker>
        ) : null
      )}
    </MapContainer>
  );
}

export default LiveMap;