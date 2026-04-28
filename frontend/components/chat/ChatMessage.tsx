"use client";

import { Avatar } from "../ui/Avatar";
import { cn } from "../../lib/utils";
import type { ChatMessage } from "../../types";

interface ChatMessageProps {
  message: ChatMessage;
}

function formatTime(date: Date): string {
  return new Intl.DateTimeFormat("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function ChatMessageItem({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <div
      className={cn(
        "flex gap-3 group px-1",
        isUser ? "flex-row-reverse" : "flex-row",
      )}
    >
      {/* Avatar */}
      <div className="shrink-0 mt-1">
        {isUser ? (
          <Avatar fallback="Tú" size="sm" />
        ) : (
          <Avatar fallback="AI" isAI size="sm" />
        )}
      </div>

      {/* Burbuja del mensaje */}
      <div
        className={cn(
          "flex flex-col gap-1 max-w-[78%]",
          isUser ? "items-end" : "items-start",
        )}
      >
        <div
          className={cn(
            "px-4 py-3 rounded-2xl text-sm leading-relaxed break-words",
            isUser
              ? "bg-gradient-to-br from-violet-600 to-indigo-600 text-white rounded-tr-sm shadow-lg shadow-violet-500/20"
              : "bg-slate-800/70 border border-white/6 text-slate-100 rounded-tl-sm",
          )}
        >
          {message.content}
        </div>
        <span className="text-[10px] text-slate-500 px-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {formatTime(message.timestamp)}
        </span>
      </div>
    </div>
  );
}
