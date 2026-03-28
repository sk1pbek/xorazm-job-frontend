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
import "./LiveMap.css";
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
  "Bog‘ot": [41.35495, 60.82170, 13],
  Gurlan: [41.84, 60.39, 12],
  Hazorasp: [41.32, 61.07, 12],
  Xonqa: [41.47, 60.78, 12],
  "Qo‘shko‘pir": [41.53, 60.34, 12],
  Shovot: [41.65, 60.30, 12],
  Yangiariq: [41.31, 60.61, 12],
  Yangibozor: [41.68, 60.70, 12],
 "Tuproqqal'a": [41.30268, 61.08842, 12],
};

/* ===== MAP CONTROLLER ===== */
function MapController({ jobs, selectedDistrict }) {
  const map = useMap();

  useEffect(() => {

    if (selectedDistrict && selectedDistrict !== "Hammasi") {

      const district = districts[selectedDistrict];

      if (district) {
        map.flyTo([district[0], district[1]], district[2], {
          duration: 1.5
        });
      }

      return;
    }

    

}, [selectedDistrict]);

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

  return (
    <MapContainer
     
      center={[41.55, 60.63]}
      zoom={11}
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

    <MapController
  jobs={jobs}
  selectedDistrict={selectedDistrict}
/>

      {jobs.map(job =>
        job.lat && job.lng ? (
          <Marker
            key={job.id}
            position={[Number(job.lat), Number(job.lng)]}

            /* 🔹 BU YERDA LOGO MARKER */
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
  {job.salary} mln so‘m
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
                  {job.salary} mln so‘m
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