import { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle2, Info, AlertTriangle, X } from "lucide-react";

// Global toast-system – funkar för bekräftelser, info, varningar
const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const visa = useCallback((meddelande, typ = "success", varaktighet = 3000) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, meddelande, typ }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), varaktighet);
  }, []);

  return (
    <ToastContext.Provider value={visa}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => (
          <ToastBubble key={t.id} {...t} onClose={() => setToasts((arr) => arr.filter((x) => x.id !== t.id))} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const t = useContext(ToastContext);
  if (!t) throw new Error("useToast måste användas inom ToastProvider");
  return t;
}

function ToastBubble({ meddelande, typ, onClose }) {
  const config = {
    success: { Icon: CheckCircle2, style: "bg-emerald-600 text-white" },
    info: { Icon: Info, style: "bg-stone-900 text-white" },
    warn: { Icon: AlertTriangle, style: "bg-amber-600 text-white" },
    error: { Icon: AlertTriangle, style: "bg-red-600 text-white" },
  };
  const { Icon, style } = config[typ] || config.success;
  return (
    <div className={`pointer-events-auto flex items-center gap-2.5 ${style} px-4 py-3 rounded-xl shadow-2xl min-w-[260px] max-w-md animate-slide-in`}>
      <Icon size={18} className="shrink-0" />
      <span className="text-sm font-medium flex-1">{meddelande}</span>
      <button onClick={onClose} className="opacity-70 hover:opacity-100"><X size={14} /></button>
    </div>
  );
}
