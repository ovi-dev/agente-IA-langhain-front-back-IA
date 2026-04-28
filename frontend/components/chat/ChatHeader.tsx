"use client";

import { Bot, Wifi, WifiOff, Trash2 } from "lucide-react";
import { Avatar } from "../ui/Avatar";
import { Button } from "../ui/Button";
import { cn } from "../../lib/utils";

interface ChatHeaderProps {
  onClear: () => void;
  isConnected?: boolean;
}

export function ChatHeader({ onClear, isConnected = false }: ChatHeaderProps) {
  return (
    <div className="flex items-center justify-between px-5 py-4 border-b border-white/8 bg-slate-900/60 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <Avatar fallback="AI" isAI size="md">
          <Bot className="h-4 w-4" />
        </Avatar>
        <div>
          <h2 className="text-sm font-semibold text-white leading-tight">
            Asistente TechStore
          </h2>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span
              className={cn(
                "h-1.5 w-1.5 rounded-full",
                isConnected ? "bg-emerald-400 animate-pulse" : "bg-slate-500",
              )}
            />
            <span className="text-xs text-slate-400">
              {isConnected ? "Conectado en tiempo real" : "Modo API REST"}
            </span>
            {isConnected ? (
              <Wifi className="h-3 w-3 text-emerald-400" />
            ) : (
              <WifiOff className="h-3 w-3 text-slate-500" />
            )}
          </div>
        </div>
      </div>

      <Button
        variant="ghost"
        size="icon"
        onClick={onClear}
        title="Limpiar conversación"
        className="text-slate-400 hover:text-red-400"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
