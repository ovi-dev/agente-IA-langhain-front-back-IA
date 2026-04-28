/**
 * chatService.ts
 * ──────────────
 * Todas las peticiones REST relacionadas con el chat de IA.
 * Se usa junto a TanStack Query (useMutation) en los hooks.
 */
import { apiClient } from "./api";
import type { ChatResponse, SendMessagePayload } from "../types";

/** Enviar un mensaje al agente IA y recibir respuesta */
export const sendMessage = async (
  payload: SendMessagePayload,
): Promise<ChatResponse> => {
  const { data } = await apiClient.post<ChatResponse>("/chat/message", payload);
  return data;
};

/** Obtener historial de mensajes de una sesión */
export const getChatHistory = async (
  sessionId: string,
): Promise<ChatResponse[]> => {
  const { data } = await apiClient.get<ChatResponse[]>(
    `/chat/history/${sessionId}`,
  );
  return data;
};

/** Borrar historial de una sesión */
export const clearChatHistory = async (sessionId: string): Promise<void> => {
  await apiClient.delete(`/chat/history/${sessionId}`);
};
