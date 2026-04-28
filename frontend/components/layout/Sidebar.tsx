"use client";

import { MessageSquare, Zap, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../../lib/utils";
import type { ActiveView } from "../../types";

interface SidebarProps {
  activeView: ActiveView;
  onViewChange: (view: ActiveView) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const NAV_ITEMS = [
  {
    id: "chat" as ActiveView,
    label: "Asistente IA",
    icon: MessageSquare,
    badge: null,
  },
];

export function Sidebar({
  activeView,
  onViewChange,
  isOpen,
  onToggle,
}: SidebarProps) {
  return (
    <aside
      className={cn(
        "relative flex flex-col bg-slate-900/80 border-r border-white/6 backdrop-blur-xl transition-all duration-300 ease-in-out shrink-0",
        isOpen ? "w-60" : "w-46",
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-white/6">
        <div className="h-9 w-9 shrink-0 rounded-xl bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-violet-500/30">
          <Zap className="h-5 w-5 text-white" />
        </div>
        {isOpen && (
          <div className="overflow-hidden">
            <p className="text-sm font-bold text-white whitespace-nowrap">
              TechStore
            </p>
            <p className="text-[10px] text-violet-400 whitespace-nowrap">
              Asistente IA
            </p>
          </div>
        )}
      </div>

      {/* Navegación principal */}
      <nav className="flex-1 px-2 py-4 space-y-1">
        {isOpen && (
          <p className="text-[10px] text-slate-500 uppercase tracking-widest px-2 mb-2">
            Menú
          </p>
        )}
        {NAV_ITEMS.map(({ id, label, icon: Icon, badge }) => (
          <button
            key={id}
            onClick={() => onViewChange(id)}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer relative",
              activeView === id
                ? "bg-violet-600/20 text-violet-300 border border-violet-500/20 shadow-lg shadow-violet-500/5"
                : "text-slate-400 hover:text-white hover:bg-white/5",
            )}
          >
            <Icon className="h-4.5 w-4.5 shrink-0 h-[18px] w-[18px]" />
            {isOpen && <span className="truncate">{label}</span>}
            {badge && isOpen && (
              <span className="ml-auto text-[10px] bg-violet-600/30 text-violet-300 border border-violet-500/20 px-1.5 py-0.5 rounded-full">
                {badge}
              </span>
            )}
            {activeView === id && (
              <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-violet-400 rounded-r-full" />
            )}
          </button>
        ))}
      </nav>

      {/* Toggle button */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-20 h-6 w-6 rounded-full bg-slate-700 border border-white/10 flex items-center justify-center hover:bg-slate-600 transition-colors cursor-pointer z-10"
      >
        {isOpen ? (
          <ChevronLeft className="h-3 w-3 text-slate-300" />
        ) : (
          <ChevronRight className="h-3 w-3 text-slate-300" />
        )}
      </button>
    </aside>
  );
}
