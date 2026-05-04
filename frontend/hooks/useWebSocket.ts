/**
 * useWebSocket.ts
 * ───────────────
 * Hook que gestiona el ciclo de vida de la conexión WebSocket:
 *  - Abre la conexión al montar el componente
 *  - Cierra la conexión al desmontar (cleanup)
 *  - Expone el estado de conexión y streaming
 *
 * Uso:
 *   const { estaConectado, textoStreaming, enviarMensajeWs } = useWebSocket(idSesion);
 */
"use client";

import { useState, useEffect, useCallback } from "react";
import { servicioWs } from "../services/wsService";
import type { FragmentoStream } from "../services/wsService";

export const useWebSocket = (idSesion: string) => {
  const [estaConectado, setEstaConectado] = useState(false);
  const [textoStreaming, setTextoStreaming] = useState("");
  const [enStreaming, setEnStreaming] = useState(false);

  useEffect(() => {
    // 1️⃣ Abrir conexión al montar
    servicioWs.conectar(idSesion);

    // 2️⃣ Escuchar eventos
    servicioWs.escuchar("conectado", () => setEstaConectado(true));
    servicioWs.escuchar("desconectado", () => setEstaConectado(false));

    // 3️⃣ Manejar streaming de respuesta IA fragmento a fragmento
    servicioWs.escuchar("fragmento", (datos) => {
      const frag = datos as FragmentoStream;
      setEnStreaming(true);
      setTextoStreaming((prev) => prev + frag.fragmento);

      if (frag.terminado) {
        setEnStreaming(false);
        setTextoStreaming(""); // Resetea para el próximo mensaje
      }
    });

    // 4️⃣ Cleanup: cerrar al desmontar el componente
    return () => {
      servicioWs.dejarEscuchar("conectado");
      servicioWs.dejarEscuchar("desconectado");
      servicioWs.dejarEscuchar("fragmento");
      servicioWs.desconectar();
    };
  }, [idSesion]);

  const enviarMensajeWs = useCallback((mensaje: string) => {
    servicioWs.enviarMensaje(mensaje);
  }, []);

  return { estaConectado, textoStreaming, enStreaming, enviarMensajeWs };
};
