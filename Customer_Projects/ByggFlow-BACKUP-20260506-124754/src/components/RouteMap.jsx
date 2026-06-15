import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, CircleMarker, useMap } from "react-leaflet";
import L from "leaflet";
import { branschConfig } from "./BranchIcon";
import { optimizeRoute } from "../services/routing";

// Numrerad markör med branschemoji + statusfärg
function numberedIcon(n, status, bransch) {
  const palette = {
    pagar: { bg: "#d97706", border: "#fff", text: "#fff", glow: "0 0 18px rgba(217,119,6,0.7)" },
    klar: { bg: "#10b981", border: "#fff", text: "#fff", glow: "0 0 12px rgba(16,185,129,0.5)" },
    pa_vag: { bg: "#0284c7", border: "#fff", text: "#fff", glow: "0 0 14px rgba(2,132,199,0.55)" },
    brådskande: { bg: "#dc2626", border: "#fff", text: "#fff", glow: "0 0 14px rgba(220,38,38,0.55)" },
    kommande: { bg: "#fff", border: "#d97706", text: "#d97706", glow: "0 2px 6px rgba(0,0,0,0.15)" },
  };
  const c = palette[status] || palette.kommande;
  const emoji = branschConfig[bransch]?.emoji || "📍";
  return L.divIcon({
    className: "",
    html: `<div style="
      width:38px;height:38px;border-radius:50%;
      background:${c.bg};border:3px solid ${c.border};color:${c.text};
      display:flex;align-items:center;justify-content:center;
      font-weight:800;font-size:14px;font-family:Inter,sans-serif;
      box-shadow:${c.glow};position:relative;">
      ${n}
      <span style="position:absolute;bottom:-4px;right:-4px;
        background:#fff;border-radius:50%;width:18px;height:18px;
        display:flex;align-items:center;justify-content:center;
        font-size:11px;border:1.5px solid #e7e5e4;">${emoji}</span>
    </div>`,
    iconSize: [38, 38],
    iconAnchor: [19, 19],
  });
}

// Depot-markör (kontoret/start)
const depotIcon = L.divIcon({
  className: "",
  html: `<div style="
    width:34px;height:34px;border-radius:8px;
    background:#1c1917;border:2px solid #d97706;color:#d97706;
    display:flex;align-items:center;justify-content:center;
    box-shadow:0 0 12px rgba(217,119,6,0.4);font-size:16px;">🏢</div>`,
  iconSize: [34, 34],
  iconAnchor: [17, 17],
});

// Auto-zoom in alla punkter
function FitBounds({ points }) {
  const map = useMap();
  useEffect(() => {
    if (!points?.length) return;
    // invalidateSize krävs eftersom containern kan ha ändrats efter mount
    setTimeout(() => {
      map.invalidateSize();
      map.fitBounds(L.latLngBounds(points), { padding: [60, 60], maxZoom: 14 });
    }, 50);
  }, [map, points]);
  return null;
}

export default function RouteMap({
  stopp = [],
  depot,
  livePosition,
  height = 400,
  visaRutt = true,
  onSelect,
}) {
  const [ruttGeometri, setRuttGeometri] = useState(null);

  // Hämta optimerad rutt-geometri från Mapbox när stopp ändras
  useEffect(() => {
    if (!visaRutt || !depot || stopp.length === 0) return;
    let cancelled = false;
    const aktiva = stopp.filter((s) => s.status !== "klar");
    if (aktiva.length === 0) return;
    optimizeRoute(aktiva, depot).then((res) => {
      if (cancelled) return;
      if (res.geometry) setRuttGeometri(res.geometry);
    });
    return () => { cancelled = true; };
  }, [stopp, depot, visaRutt]);

  const allaPunkter = [
    ...(depot ? [[depot.lat, depot.lng]] : []),
    ...stopp.map((s) => [s.plats.lat, s.plats.lng]),
    ...(livePosition ? [[livePosition.lat, livePosition.lng]] : []),
  ];

  // Konvertera Mapbox GeoJSON till Leaflet polyline-format
  const ruttPositions = ruttGeometri?.coordinates?.map(([lng, lat]) => [lat, lng]);

  // Fallback: rät linje mellan kvarvarande stopp om Mapbox misslyckas
  const aktiva = stopp.filter((s) => s.status !== "klar");
  const fallbackLinje = depot
    ? [[depot.lat, depot.lng], ...aktiva.map((s) => [s.plats.lat, s.plats.lng])]
    : aktiva.map((s) => [s.plats.lat, s.plats.lng]);

  return (
    <div className="rounded-xl overflow-hidden border border-stone-200 shadow-card" style={{ height }}>
      <MapContainer
        center={depot ? [depot.lat, depot.lng] : [59.3293, 18.0686]}
        zoom={12}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
      >
        {/* Ljus, professionell karta från CARTO – samma stil som Google Maps standard */}
        <TileLayer
          attribution='&copy; <a href="https://carto.com/attributions">CARTO</a> &copy; OpenStreetMap'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          subdomains="abcd"
        />

        {/* Depot/kontor */}
        {depot && (
          <Marker position={[depot.lat, depot.lng]} icon={depotIcon}>
            <Popup>
              <div className="font-bold">{depot.namn || "Kontor"}</div>
              <div className="text-xs text-stone-500">Startposition</div>
            </Popup>
          </Marker>
        )}

        {/* Stopp i ordning */}
        {stopp.map((s, i) => {
          const status = s.status === "pagar" ? "pagar"
            : s.status === "klar" ? "klar"
            : s.prioritet === "brådskande" ? "brådskande"
            : "kommande";
          return (
            <Marker
              key={s.id}
              position={[s.plats.lat, s.plats.lng]}
              icon={numberedIcon(s.ordning || i + 1, status, s.bransch || "entreprenad")}
              eventHandlers={onSelect ? { click: () => onSelect(s.id) } : undefined}
            >
              <Popup>
                <div style={{ minWidth: 200 }}>
                  <div className="font-bold text-stone-900">{s.ordning || i + 1}. {s.kund}</div>
                  <div className="text-xs text-stone-700 mt-0.5">{s.uppdrag}</div>
                  <div className="text-xs text-stone-500 mt-1">📍 {s.adress}</div>
                  {s.uppskattadTid && (
                    <div className="text-xs text-primary mt-1 font-medium">⏱ {s.uppskattadTid} min</div>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* Live-position på pågående stopp – pulserande */}
        {livePosition && (
          <CircleMarker
            center={[livePosition.lat, livePosition.lng]}
            radius={8}
            pathOptions={{ color: "#dc2626", fillColor: "#fbbf24", fillOpacity: 0.9, weight: 3 }}
          >
            <Popup>
              <div className="font-bold">📍 Du är här</div>
              <div className="text-xs text-stone-500 mt-0.5">{livePosition.label || "Live GPS-position"}</div>
            </Popup>
          </CircleMarker>
        )}

        {/* Ruttlinje – Mapbox-geometri eller fallback */}
        {visaRutt && (ruttPositions || fallbackLinje.length > 1) && (
          <Polyline
            positions={ruttPositions || fallbackLinje}
            pathOptions={{
              color: "#d97706",
              weight: 4,
              opacity: 0.7,
              dashArray: ruttPositions ? null : "8 10",
            }}
          />
        )}

        <FitBounds points={allaPunkter} />
      </MapContainer>
    </div>
  );
}
