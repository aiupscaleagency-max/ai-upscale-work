import { NavLink } from "react-router-dom";
import { LayoutDashboard, HardHat, Building2, FileText } from "lucide-react";

// Top-navbar med ByggFlow-branding och vy-växlare
const vyer = [
  { to: "/", label: "Admin", icon: LayoutDashboard },
  { to: "/falt", label: "Hantverkare", icon: HardHat },
  { to: "/kommun", label: "Kommunportal", icon: Building2 },
  { to: "/faktura", label: "Faktura & Offert", icon: FileText },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-stone-200">
      <div className="px-4 md:px-6 py-3 flex items-center gap-3 md:gap-6">
        {/* Logotyp */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-primary-dark text-white font-bold text-lg flex items-center justify-center shadow-glow-sm">
            B
          </div>
          <div className="leading-tight">
            <div className="font-bold text-stone-900 text-lg flex items-center gap-1.5">
              ByggFlow
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 live-dot inline-block" />
            </div>
            <div className="text-[10px] text-stone-500 font-medium tracking-wide -mt-0.5">by AI Upscale · Live</div>
          </div>
        </div>

        {/* Vy-växlare */}
        <nav className="flex-1 flex items-center gap-1 overflow-x-auto">
          {vyer.map((v) => {
            const Icon = v.icon;
            return (
              <NavLink
                key={v.to}
                to={v.to}
                end={v.to === "/"}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                    isActive
                      ? "bg-primary text-white shadow-sm"
                      : "text-stone-600 hover:bg-stone-100 hover:text-stone-900"
                  }`
                }
              >
                <Icon size={16} />
                <span className="hidden sm:inline">{v.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Användare */}
        <div className="hidden md:flex items-center gap-3 shrink-0">
          <div className="text-right leading-tight">
            <div className="text-sm font-semibold text-stone-900">Mike Luengo</div>
            <div className="text-xs text-stone-500">AI Upscale Agency</div>
          </div>
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-primary-dark text-white font-bold text-sm flex items-center justify-center">
            ML
          </div>
        </div>
      </div>
    </header>
  );
}
