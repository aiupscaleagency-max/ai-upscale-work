import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, CircleMarker, useMap } from "react-leaflet";
import L from "leaflet";
import { branschConfig } from "./BranchIcon";
import { openNavigation } from "../services/routing";

// Stor ikon med branschemoji + ring
function projektIkon(bransch, status) {
  const cfg = branschConfig[bransch] || branschConfig.entreprenad;
  const ringFarg = status === "klart" ? "#10b981" : status === "besiktning" ? "#a855f7" : "#d97706";
  return L.divIcon({
    className: "",
    html: `<div style="
      width:40px;height:40px;border-radius:50%;
      background:white;border:3px solid ${ringFarg};
      display:flex;align-items:center;justify-content:center;
      font-size:20px;box-shadow:0 3px 8px rgba(0,0,0,0.18);">
      ${cfg.emoji}
    </div>`,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  });
}

function FitBounds({ points }) {
  const map = useMap();
  useEffect(() => {
    if (!points?.length) return;
    setTimeout(() => {
      map.invalidateSize();
      map.fitBounds(L.latLngBounds(points), { padding: [50, 50], maxZoom: 14 });
    }, 50);
  }, [map, points]);
  return null;
}

// Karta för Kommunportalen – visar projekt + live-positioner med ljus Carto Voyager-stil
export default function KommunMap({ projekt = [], livePositioner = [], height = 420 }) {
  const allaPunkter = [
    ...projekt.map((p) => [p.plats.lat, p.plats.lng]),
    ...livePositioner.map((l) => [l.plats.lat, l.plats.lng]),
  ];

  return (
    <div style={{ height, width: "100%" }}>
      <MapContainer
        center={[59.3293, 18.0686]}
        zoom={11}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/attributions">CARTO</a> &copy; OpenStreetMap'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          subdomains="abcd"
        />

        {/* Projektmarkörer */}
        {projekt.map((p) => (
          <Marker key={`p-${p.id}`} position={[p.plats.lat, p.plats.lng]} icon={projektIkon(p.bransch, p.status)}>
            <Popup>
              <div style={{ minWidth: 220 }}>
                <div className="font-bold text-stone-900">{p.namn}</div>
                <div className="text-xs text-stone-600 mt-0.5">{p.firma}</div>
                <div className="text-xs text-stone-500 mt-1">📍 {p.plats.adress}</div>
                <div className="text-xs pt-2 mt-2 border-t border-stone-200 grid grid-cols-2 gap-1">
                  <div><span className="text-stone-500">Status:</span> <strong>{p.status}</strong></div>
                  <div><span className="text-stone-500">Budget:</span> <strong>{(p.budget / 1000).toLocaleString("sv-SE")} tkr</strong></div>
                </div>
                <button
                  onClick={() => openNavigation(p.plats.lat, p.plats.lng, p.namn)}
                  className="w-full mt-2 bg-stone-900 text-white text-xs font-semibold py-1.5 rounded-lg hover:bg-stone-800"
                >
                  Öppna i Google Maps
                </button>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Live-positioner – pulserande för aktiva fältarbetare */}
        {livePositioner.map((h) => (
          <CircleMarker
            key={`l-${h.hantverkareId}`}
            center={[h.plats.lat, h.plats.lng]}
            radius={11}
            pathOptions={{
              color: "#dc2626",
              fillColor: "#fbbf24",
              fillOpacity: 0.9,
              weight: 3,
            }}
          >
            <Popup>
              <div style={{ minWidth: 220 }}>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center">
                    {h.avatar}
                  </div>
                  <div>
                    <div className="font-bold text-stone-900 text-sm">{h.namn}</div>
                    <div className="text-[11px] text-stone-500">{h.firma}</div>
                  </div>
                </div>
                <div className="text-xs pt-2 mt-1.5 border-t border-stone-200">
                  <div className="font-medium text-stone-700">{h.aktuelltProjekt}</div>
                  <div className="text-stone-500 mt-0.5">📍 {h.aktuellAktivitet}</div>
                  <div className="text-stone-400 mt-1 text-[11px]">
                    Status: {h.status} · sedan {h.sedan} · {h.senasteUppdatering}
                  </div>
                </div>
              </div>
            </Popup>
          </CircleMarker>
        ))}

        <FitBounds points={allaPunkter} />
      </MapContainer>
    </div>
  );
}
