import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from "react-leaflet";
import L from "leaflet";
import { branschConfig } from "./BranchIcon";

// Skapa custom DivIcon med branschemoji + färgad rund bakgrund
function makeIcon(bransch, isLive = false) {
  const cfg = branschConfig[bransch] || branschConfig.entreprenad;
  const ringClass = isLive ? "live-dot" : "";
  return L.divIcon({
    html: `
      <div class="${ringClass}" style="
        width: 36px; height: 36px; border-radius: 50%;
        background: white; border: 2px solid #d97706;
        display: flex; align-items: center; justify-content: center;
        font-size: 18px; box-shadow: 0 2px 6px rgba(0,0,0,0.15);
      ">${cfg.emoji}</div>
    `,
    className: "byggflow-marker",
    iconSize: [36, 36],
    iconAnchor: [18, 18],
  });
}

export default function ProjectMap({ projekt = [], livePositioner = [], height = 400 }) {
  return (
    <div className="rounded-xl overflow-hidden border border-stone-200 shadow-card" style={{ height }}>
      <MapContainer
        center={[59.3293, 18.0686]}
        zoom={11}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Projektmarkörer */}
        {projekt.map((p) => (
          <Marker key={`p-${p.id}`} position={[p.plats.lat, p.plats.lng]} icon={makeIcon(p.bransch)}>
            <Popup>
              <div className="space-y-1.5 min-w-[180px]">
                <div className="font-bold text-stone-900">{p.namn}</div>
                <div className="text-xs text-stone-600">{p.firma}</div>
                <div className="text-xs text-stone-500">{p.plats.adress}</div>
                <div className="text-xs pt-1 border-t border-stone-200">
                  <span className="font-medium">Status:</span> {p.status}
                </div>
                <div className="text-xs">
                  <span className="font-medium">Budget:</span> {p.budget.toLocaleString("sv-SE")} kr
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Live-positioner – pulserande markör för aktiva fältarbetare */}
        {livePositioner.map((h) => (
          <CircleMarker
            key={`l-${h.hantverkareId}`}
            center={[h.plats.lat, h.plats.lng]}
            radius={10}
            pathOptions={{
              color: "#d97706",
              fillColor: "#fbbf24",
              fillOpacity: 0.85,
              weight: 3,
            }}
          >
            <Popup>
              <div className="space-y-1.5 min-w-[200px]">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center">
                    {h.avatar}
                  </div>
                  <div>
                    <div className="font-bold text-stone-900 text-sm">{h.namn}</div>
                    <div className="text-[11px] text-stone-500">{h.firma}</div>
                  </div>
                </div>
                <div className="text-xs pt-1.5 border-t border-stone-200">
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
      </MapContainer>
    </div>
  );
}
