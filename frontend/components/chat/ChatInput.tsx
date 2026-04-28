"use client";

import { useState, KeyboardEvent } from "react";
import { Send, Mic, Paperclip } from "lucide-react";
import { Button } from "../ui/Button";
import { cn } from "../../lib/utils";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

const QUICK_SUGGESTIONS = [
  "¿Cuál es el precio del iPhone 15?",
  "¿Qué laptops tienen en stock?",
  "¿Tienen auriculares bluetooth?",
  "¿Cuáles son las mejores ofertas?",
];

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [value, setValue] = useState("");

  const handleSend = () => {
    if (!value.trim() || disabled) return;
    onSend(value.trim());
    setValue("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="p-4 border-t border-white/8 bg-slate-900/60 backdrop-blur-sm">
      {/* Sugerencias rápidas */}
      <div className="flex gap-2 mb-3 overflow-x-auto pb-1 scrollbar-hide">
        {QUICK_SUGGESTIONS.map((s) => (
          <button
            key={s}
            onClick={() => onSend(s)}
            disabled={disabled}
            className="shrink-0 text-xs bg-white/5 hover:bg-violet-500/20 border border-white/38 hover:border-violet-500/40 text-slate-400 hover:text-violet-300 px-3 py-1.5 rounded-full transition-all duration-200 cursor-pointer disabled:opacity-40"
          >
            {s}
          </button>
        ))}
      </div>

      {/* Input principal */}
      <div
        className={cn(
          "flex items-end gap-2 bg-slate-800/60 border rounded-2xl px-4 py-3 transition-all duration-200",
          disabled
            ? "border-white/5 opacity-60"
            : "border-white/10 focus-within:border-violet-500/50 focus-within:bg-slate-800/80",
        )}
      >
        <button
          className="text-slate-500 hover:text-slate-300 transition-colors mb-0.5 cursor-pointer"
          title="Adjuntar archivo (próximamente)"
        >
          <Paperclip className="h-4 w-4" />
        </button>

        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder="Pregúntame sobre productos, precios, stock..."
          rows={1}
          className="flex-1 bg-transparent text-sm text-white placeholder:text-slate-500 resize-none focus:outline-none leading-6 max-h-32 overflow-y-auto"
          style={{ height: "auto" }}
          onInput={(e) => {
            const target = e.target as HTMLTextAreaElement;
            target.style.height = "auto";
            target.style.height = `${Math.min(target.scrollHeight, 128)}px`;
          }}
        />

        <button
          className="text-slate-500 hover:text-slate-300 transition-colors mb-0.5 cursor-pointer"
          title="Voz (próximamente)"
        >
          <Mic className="h-4 w-4" />
        </button>

        <Button
          size="icon"
          onClick={handleSend}
          disabled={!value.trim() || disabled}
          className="h-8 w-8 rounded-xl shrink-0"
        >
          <Send className="h-3.5 w-3.5" />
        </Button>
      </div>

      <p className="text-center text-[10px] text-slate-600 mt-2">
        Pulsa{" "}
        <kbd className="bg-white/5 px-1 rounded text-slate-500">Enter</kbd> para
        enviar ·{" "}
        <kbd className="bg-white/5 px-1 rounded text-slate-500">
          Shift+Enter
        </kbd>{" "}
        para nueva línea
      </p>
    </div>
  );
}
