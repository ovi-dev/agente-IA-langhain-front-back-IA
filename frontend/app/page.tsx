"use client";

import { useState, useMemo } from "react";
import { Sidebar } from "../components/layout/Sidebar";
import { AppHeader } from "../components/layout/AppHeader";
import { ChatContainer } from "../components/chat/ChatContainer";
import { useWebSocket } from "../hooks/useWebSocket";
import type { ActiveView } from "../types";

/** Genera un sessionId único por sesión de pestaña */
function getSessionId(): string {
  if (typeof window === "undefined") return "ssr-session";
  const key = "techstore_session_id";
  let id = sessionStorage.getItem(key);
  if (!id) {
    id = `sess_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    sessionStorage.setItem(key, id);
  }
  return id;
}

export default function Home() {
  const [activeView, setActiveView] = useState<ActiveView>("chat");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const sessionId = useMemo(() => getSessionId(), []);

  // WebSocket conectado en background — listo para streaming cuando el backend lo soporte
  const { isConnected } = useWebSocket(sessionId);

  return (
    <div className="flex h-full bg-slate-950 overflow-hidden">
      {/* ── Sidebar ──────────────────────────────────────────────────── */}
      <Sidebar
        activeView={activeView}
        onViewChange={setActiveView}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen((v) => !v)}
      />

      {/* ── Contenido principal ──────────────────────────────────────── */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <AppHeader activeView={activeView} />

        <main className="flex-1 overflow-hidden p-4 lg:p-6">
          <ChatContainer sessionId={sessionId} isWsConnected={isConnected} />
        </main>
      </div>
    </div>
  );
}
