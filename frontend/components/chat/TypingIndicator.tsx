"use client";

import { Avatar } from "../ui/Avatar";

export function TypingIndicator() {
  return (
    <div className="flex gap-3 px-1">
      <div className="shrink-0 mt-1">
        <Avatar fallback="AI" isAI size="sm" />
      </div>
      <div className="bg-slate-800/70 border border-white/6 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1">
        <span
          className="h-2 w-2 bg-violet-400 rounded-full animate-bounce"
          style={{ animationDelay: "0ms" }}
        />
        <span
          className="h-2 w-2 bg-violet-400 rounded-full animate-bounce"
          style={{ animationDelay: "150ms" }}
        />
        <span
          className="h-2 w-2 bg-violet-400 rounded-full animate-bounce"
          style={{ animationDelay: "300ms" }}
        />
      </div>
    </div>
  );
}
