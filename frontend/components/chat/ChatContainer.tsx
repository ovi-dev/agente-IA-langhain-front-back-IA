"use client";

import { useEffect, useRef } from "react";
import { ChatHeader } from "./ChatHeader";
import { ChatMessageItem } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { TypingIndicator } from "./TypingIndicator";
import { useChat } from "../../hooks/useChat";

interface ChatContainerProps {
  sessionId: string;
  isWsConnected?: boolean;
}

export function ChatContainer({
  sessionId,
  isWsConnected,
}: ChatContainerProps) {
  const {
    messages: mensajes,
    isTyping: escribiendo,
    sendUserMessage: inputEnvioDeMensaje,
    clearMessages: limpiarMensajes,
    isSending: esperandoRespuesta,
  } = useChat(sessionId);

  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll al último mensaje
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensajes, escribiendo]);

  return (
    <div className="flex flex-col h-full bg-slate-950/40 rounded-2xl border border-white/6 overflow-hidden shadow-2xl">
      {/* Cabecera */}
      <ChatHeader onClear={limpiarMensajes} isConnected={isWsConnected} />

      {/* Mensajes */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
        {mensajes.map((msg) => (
          <ChatMessageItem key={msg.id} message={msg} />
        ))}

        {/* Indicador de escritura */}
        {(escribiendo || esperandoRespuesta) && <TypingIndicator />}

        {/* Ref para auto-scroll */}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <ChatInput onSend={inputEnvioDeMensaje} disabled={esperandoRespuesta} />
    </div>
  );
}
