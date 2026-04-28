/**
 * useWebSocket.ts
 * ───────────────
 * Hook que gestiona el ciclo de vida de la conexión WebSocket:
 *  - Abre la conexión al montar el componente
 *  - Cierra la conexión al desmontar (cleanup)
 *  - Expone el estado de conexión y streaming
 *
 * Uso:
 *   const { isConnected, streamingText, sendWsMessage } = useWebSocket(sessionId);
 */
"use client";

import { useState, useEffect, useCallback } from "react";
import { wsService } from "../services/wsService";
import type { WsStreamChunk } from "../services/wsService";

export const useWebSocket = (sessionId: string) => {
  const [isConnected, setIsConnected] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);

  useEffect(() => {
    // 1️⃣ Abrir conexión al montar
    wsService.connect(sessionId);

    // 2️⃣ Escuchar eventos
    wsService.on("connected", () => setIsConnected(true));
    wsService.on("disconnected", () => setIsConnected(false));

    // 3️⃣ Manejar streaming de respuesta IA chunk a chunk
    wsService.on("stream_chunk", (data) => {
      const chunk = data as WsStreamChunk;
      setIsStreaming(true);
      setStreamingText((prev) => prev + chunk.chunk);

      if (chunk.done) {
        setIsStreaming(false);
        setStreamingText(""); // Resetea para el próximo mensaje
      }
    });

    // 4️⃣ Cleanup: cerrar al desmontar el componente
    return () => {
      wsService.off("connected");
      wsService.off("disconnected");
      wsService.off("stream_chunk");
      wsService.disconnect();
    };
  }, [sessionId]);

  const sendWsMessage = useCallback((message: string) => {
    wsService.sendMessage(message);
  }, []);

  return { isConnected, streamingText, isStreaming, sendWsMessage };
};
