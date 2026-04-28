"use client";

import { Bell, Search, Moon } from "lucide-react";
import { Button } from "../ui/Button";
import { Avatar } from "../ui/Avatar";
import type { ActiveView } from "../../types";

interface AppHeaderProps {
  activeView: ActiveView;
}

const VIEW_LABELS: Record<ActiveView, { title: string; description: string }> =
  {
    chat: {
      title: "Asistente IA",
      description: "Pregunta sobre productos, precios y disponibilidad",
    },
  };

export function AppHeader({ activeView }: AppHeaderProps) {
  const { title, description } = VIEW_LABELS[activeView];

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-white/6 bg-slate-900/50 backdrop-blur-sm shrink-0">
      {/* Título de sección */}
      <div>
        <h1 className="text-base font-semibold text-white">{title}</h1>
        <p className="text-xs text-slate-400 mt-0.5">{description}</p>
      </div>

      {/* Acciones de cabecera */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" title="Buscar">
          <Search className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          title="Notificaciones"
          className="relative"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute top-2 right-2 h-1.5 w-1.5 bg-violet-400 rounded-full" />
        </Button>
        <Button variant="ghost" size="icon" title="Tema">
          <Moon className="h-4 w-4" />
        </Button>

        {/* Divisor */}
        <div className="w-px h-6 bg-white/10 mx-1" />

        {/* Avatar de usuario */}
        <button className="flex items-center gap-2.5 hover:bg-white/5 rounded-xl px-2 py-1.5 transition-colors cursor-pointer">
          <Avatar fallback="AJ" size="sm" />
          <div className="text-left hidden sm:block">
            <p className="text-xs font-medium text-white">Admin</p>
            <p className="text-[10px] text-slate-400">TechStore</p>
          </div>
        </button>
      </div>
    </header>
  );
}
