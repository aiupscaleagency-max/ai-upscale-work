// Routing-service – Mapbox Directions + Optimization API + deep-link till Google/Apple Maps
// Samma mönster som ze-parts. Demo-token funkar för pilot-volym.

const DEMO_TOKEN =
  "pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA";

export function getMapboxToken() {
  try {
    const lagrad = localStorage.getItem("byggflow_mapbox_token");
    return lagrad || DEMO_TOKEN;
  } catch {
    return DEMO_TOKEN;
  }
}

// Optimera ruttordning via Mapbox Optimization API (TSP, max 12 stopp)
export async function optimizeRoute(stopp, depot) {
  if (!stopp?.length) return { ordered: [], distance: 0, duration: 0, geometry: null };

  // Mapbox vill ha [lng, lat] i strängen
  const coords = [
    [depot.lng, depot.lat],
    ...stopp.map((s) => [s.plats.lng, s.plats.lat]),
  ];
  const coordStr = coords.map((c) => c.join(",")).join(";");

  const url =
    `https://api.mapbox.com/optimized-trips/v1/mapbox/driving/${coordStr}` +
    `?source=first&destination=last&roundtrip=false&overview=full&geometries=geojson` +
    `&access_token=${getMapboxToken()}`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Mapbox ${res.status}`);
    const data = await res.json();
    const trip = data.trips?.[0];
    if (!trip) return fallback(stopp);
    const wp = data.waypoints
      .map((w, i) => ({ idx: i - 1, order: w.waypoint_index }))
      .filter((w) => w.idx >= 0)
      .sort((a, b) => a.order - b.order);
    return {
      ordered: wp.map((w) => stopp[w.idx]),
      distance: trip.distance,
      duration: trip.duration,
      geometry: trip.geometry,
    };
  } catch (err) {
    console.warn("Mapbox optimize misslyckades, använder fallback:", err.message);
    return fallback(stopp);
  }
}

function fallback(stopp) {
  return { ordered: stopp, distance: 0, duration: 0, geometry: null };
}

// Hämta full vägbeskrivning + geometri från A till B (live trafik)
export async function getDirections(from, to) {
  const url =
    `https://api.mapbox.com/directions/v5/mapbox/driving-traffic/` +
    `${from.lng},${from.lat};${to.lng},${to.lat}` +
    `?access_token=${getMapboxToken()}` +
    `&overview=full&geometries=geojson&steps=true&language=sv`;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Mapbox ${res.status}`);
    const data = await res.json();
    const route = data.routes?.[0];
    if (!route) return null;
    return {
      duration: route.duration,
      distance: route.distance,
      geometry: route.geometry,
      steps: route.legs?.[0]?.steps || [],
      etaTime: new Date(Date.now() + route.duration * 1000),
    };
  } catch (err) {
    console.warn("Mapbox directions failed:", err.message);
    return null;
  }
}

// Öppna chaufförens favorit-navigeringsapp via deep-link
// iOS → Apple Maps · Android → Google Maps Navigation · Desktop → Google Maps web
export function openNavigation(lat, lng, label = "") {
  const ua = navigator.userAgent;
  let url;
  if (/iPhone|iPad|iPod/.test(ua)) {
    url = `maps://?daddr=${lat},${lng}&dirflg=d`;
  } else if (/Android/.test(ua)) {
    url = `google.navigation:q=${lat},${lng}&mode=d`;
  } else {
    url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=driving&dir_action=navigate`;
  }
  window.open(url, "_blank", "noopener,noreferrer");
}

// Formattera tid och distans till svensk text
export const formatDuration = (sek) => {
  if (!sek) return "—";
  const h = Math.floor(sek / 3600);
  const m = Math.round((sek % 3600) / 60);
  return h > 0 ? `${h}h ${m}min` : `${m} min`;
};

export const formatDistance = (m) => {
  if (!m) return "—";
  return m >= 1000 ? `${(m / 1000).toFixed(1)} km` : `${Math.round(m)} m`;
};

export const formatETA = (date) => {
  if (!date) return "—";
  return date.toLocaleTimeString("sv-SE", { hour: "2-digit", minute: "2-digit" });
};
