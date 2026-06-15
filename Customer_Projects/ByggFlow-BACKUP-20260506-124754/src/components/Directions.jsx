import { useEffect, useState } from "react";
import {
  ArrowRight, ArrowUpRight, ArrowUp, ArrowUpLeft, ArrowLeft,
  ArrowDownLeft, ArrowDown, ArrowDownRight, Navigation, Clock, Route, Flag, MapPin,
} from "lucide-react";
import { getDirections, formatDuration, formatDistance, formatETA, openNavigation } from "../services/routing";

// Pil-ikon från Mapbox-manöver
function ManöverIkon({ modifier, type }) {
  if (type === "arrive") return <Flag size={18} />;
  const map = {
    "sharp left": ArrowDownLeft,
    "left": ArrowLeft,
    "slight left": ArrowUpLeft,
    "straight": ArrowUp,
    "slight right": ArrowUpRight,
    "right": ArrowRight,
    "sharp right": ArrowDownRight,
    "uturn": ArrowDown,
  };
  const Icon = map[modifier] || ArrowUp;
  return <Icon size={18} />;
}

// Översätt Mapbox-instruktion till svenska
const översätt = (text) => {
  if (!text) return text;
  return text
    .replace(/^Turn left/i, "Sväng vänster")
    .replace(/^Turn right/i, "Sväng höger")
    .replace(/^Turn slight left/i, "Sväng svagt vänster")
    .replace(/^Turn slight right/i, "Sväng svagt höger")
    .replace(/^Turn sharp left/i, "Skarp vänster")
    .replace(/^Turn sharp right/i, "Skarp höger")
    .replace(/^Continue straight/i, "Fortsätt rakt fram")
    .replace(/^Continue/i, "Fortsätt")
    .replace(/^Head/i, "Kör")
    .replace(/^Drive/i, "Kör")
    .replace(/^Make a U-turn/i, "Vänd 180°")
    .replace(/^You have arrived/i, "Du har kommit fram")
    .replace(/^Arrive/i, "Framme")
    .replace(/\bonto\b/gi, "in på")
    .replace(/\bin\s+(\d+)\s*meters?\b/gi, "om $1 m")
    .replace(/\bin\s+(\d+(?:\.\d+)?)\s*km\b/gi, "om $1 km");
};

export default function Directions({ from, to, label, kompakt = false }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  useEffect(() => {
    if (!from || !to) return;
    let cancelled = false;
    setLoading(true);
    setErr(null);
    getDirections(from, to)
      .then((res) => {
        if (cancelled) return;
        if (!res) { setErr("Ingen rutt hittades"); return; }
        setData(res);
      })
      .catch((e) => !cancelled && setErr(e.message))
      .finally(() => !cancelled && setLoading(false));
    return () => { cancelled = true; };
  }, [from?.lat, from?.lng, to?.lat, to?.lng]);

  if (!from || !to) return null;

  return (
    <div className="bg-card rounded-xl border border-stone-200 shadow-card overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 bg-gradient-to-r from-primary/5 to-transparent border-b border-stone-200 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-primary/15 text-primary flex items-center justify-center">
            <Navigation size={16} />
          </div>
          <div>
            <div className="text-sm font-bold text-stone-900">Vägbeskrivning</div>
            <div className="text-xs text-stone-500 truncate max-w-[200px]">→ {label || "Nästa stopp"}</div>
          </div>
        </div>
        {data && (
          <div className="flex items-center gap-3 text-right">
            <div>
              <div className="text-[10px] uppercase tracking-wider text-stone-400 font-semibold">ETA</div>
              <div className="font-bold text-primary text-sm flex items-center gap-1">
                <Clock size={12} /> {formatETA(data.etaTime)}
              </div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider text-stone-400 font-semibold">Sträcka</div>
              <div className="font-bold text-stone-900 text-sm flex items-center gap-1">
                <Route size={12} /> {formatDistance(data.distance)}
              </div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider text-stone-400 font-semibold">Tid</div>
              <div className="font-bold text-stone-900 text-sm">{formatDuration(data.duration)}</div>
            </div>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-4">
        {loading && (
          <div className="py-6 text-center text-sm text-stone-500 flex items-center justify-center gap-2">
            <span className="w-3.5 h-3.5 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
            Hämtar vägbeskrivning…
          </div>
        )}

        {err && (
          <div className="py-3 px-4 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800">
            Vägbeskrivning ej tillgänglig: {err}. Klicka <strong>Navigera</strong> för att öppna i din karta-app.
          </div>
        )}

        {data?.steps?.length > 0 && (
          <ol className={`space-y-1.5 ${kompakt ? "max-h-48" : "max-h-80"} overflow-y-auto pr-1`}>
            {data.steps.map((step, i) => {
              const förstA = i === 0;
              const sista = i === data.steps.length - 1;
              return (
                <li
                  key={i}
                  className={`flex items-start gap-3 p-2.5 rounded-lg transition ${
                    förstA
                      ? "bg-primary/10 border border-primary/30"
                      : sista
                      ? "bg-emerald-50 border border-emerald-200"
                      : "bg-stone-50 hover:bg-stone-100"
                  }`}
                >
                  <div
                    className={`shrink-0 w-9 h-9 rounded-lg flex items-center justify-center ${
                      förstA
                        ? "bg-primary text-white shadow-sm"
                        : sista
                        ? "bg-emerald-500 text-white"
                        : "bg-white text-primary border border-stone-200"
                    }`}
                  >
                    <ManöverIkon modifier={step.maneuver?.modifier} type={step.maneuver?.type} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`text-sm font-semibold leading-tight ${förstA ? "text-stone-900" : "text-stone-700"}`}>
                      {översätt(step.maneuver?.instruction)}
                    </div>
                    {step.name && (
                      <div className="text-[11px] text-stone-500 mt-0.5 truncate flex items-center gap-1">
                        <MapPin size={10} /> {step.name}
                      </div>
                    )}
                  </div>
                  {step.distance > 0 && (
                    <div className="shrink-0 text-right">
                      <div className={`text-xs font-mono font-bold ${förstA ? "text-primary" : "text-stone-600"}`}>
                        {formatDistance(step.distance)}
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ol>
        )}

        {/* Navigera-knapp – öppnar Google/Apple Maps */}
        {to && (
          <button
            onClick={() => openNavigation(to.lat, to.lng, label)}
            className="w-full mt-3 bg-stone-900 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-stone-800 transition-colors"
          >
            <Navigation size={16} /> Öppna i Google Maps
          </button>
        )}
      </div>
    </div>
  );
}
