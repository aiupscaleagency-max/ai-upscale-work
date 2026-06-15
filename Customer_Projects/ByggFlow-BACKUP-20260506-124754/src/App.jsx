import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import { ToastProvider } from "./components/Toast";
import Chatbot from "./components/Chatbot";
import AdminPanel from "./views/AdminPanel";
import HantverkarVy from "./views/HantverkarVy";
import KommunPortal from "./views/KommunPortal";
import FakturaVy from "./views/FakturaVy";

// Huvudlayout – navbar + route-baserad vy-växling + global toast + AI-chatbot
export default function App() {
  return (
    <ToastProvider>
      <div className="min-h-screen bg-bg flex flex-col">
        <Navbar />
        <Routes>
          <Route path="/" element={<AdminPanel />} />
          <Route path="/falt" element={<HantverkarVy />} />
          <Route path="/kommun" element={<KommunPortal />} />
          <Route path="/faktura" element={<FakturaVy />} />
        </Routes>
        <Chatbot />
      </div>
    </ToastProvider>
  );
}
