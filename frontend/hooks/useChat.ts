/**
 * useChat.ts
 * ──────────
 * Hook que gestiona el estado del chat combinando:
 *  - Estado local de mensajes (mientras el backend no está listo, usa mocks)
 *  - useMutation de TanStack Query para enviar mensajes via Axios
 *  - Lógica de streaming via WebSocket
 */
"use client";

import { useState, useCallback, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { sendMessage } from "../services/chatService";
import type { ChatMessage, SendMessagePayload } from "../types";
import { v4 as uuidv4 } from "uuid";

/** Genera un ID único para cada mensaje */
const generateId = () => uuidv4();

const WELCOME_MESSAGE: ChatMessage = {
  id: "welcome-msg",
  role: "assistant",
  content:
    "¡Hola! Soy tu asistente de TechStore. Puedo ayudarte con información sobre nuestros productos, precios, disponibilidad y mucho más. ¿En qué puedo ayudarte hoy? 😊",
  // timestamp: new Date(0),
  timestamp: Temporal.Now.instant()

};

export const useChat = (sessionId: string) => {
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [isTyping, setIsTyping] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  // ── TanStack Mutation ────────────────────────────────────────────────────
  const mutation = useMutation({
    mutationFn: (payload: SendMessagePayload) => sendMessage(payload),

    onMutate: () => {
      // Mostrar indicador de escritura mientras espera respuesta
      setIsTyping(true);
    },

    onSuccess: (response) => {
      setIsTyping(false);
      const assistantMsg: ChatMessage = {
        id: response.id,
        role: "assistant",
        content: response.message,
        timestamp: Temporal.Instant.from(response.timestamp),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    },

    onError: () => {
      setIsTyping(false);
      const errorMsg: ChatMessage = {
        id: generateId(),
        role: "assistant",
        content:
          "Lo siento, ha ocurrido un error al procesar tu mensaje. Por favor, inténtalo de nuevo.",
        timestamp: Temporal.Now.instant(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    },
  });

  // ── Enviar mensaje ───────────────────────────────────────────────────────
  const sendUserMessage = useCallback(
    (content: string) => {
      if (!content.trim()) return;

      const userMsg: ChatMessage = {
        id: generateId(),
        role: "user",
        content: content.trim(),
        timestamp: Temporal.Now.instant(),
      };

      setMessages((prev) => [...prev, userMsg]);

      mutation.mutate({ message: content.trim(), sessionId });
    },
    [mutation, sessionId],
  );

  /** Limpiar historial local */
  const clearMessages = useCallback(() => {
    setMessages([]);
    abortRef.current?.abort();
  }, []);

  return {
    messages,
    isTyping,
    sendUserMessage,
    clearMessages,
    isSending: mutation.isPending,
    error: mutation.error,
  };
};
