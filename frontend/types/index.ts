// ─── Mensajes del Chat ───────────────────────────────────────────────────────

export type MessageRole = "user" | "assistant" | "system";

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Temporal.Instant;
  isStreaming?: boolean;
}

export interface SendMessagePayload {
  message: string;
  sessionId: string;
}

export interface ChatResponse {
  id: string;
  message: string;
  sessionId: string;
  timestamp: string;
}

// ─── WebSocket ───────────────────────────────────────────────────────────────

/**
 * Todos los tipos de eventos que puede enviar o recibir el WebSocket del chat.
 * Si en otro proyecto necesitas eventos distintos, cambia solo este tipo.
 */
export type TipoEventoWs =
  | "mensaje" // el servidor envía la respuesta final del agente
  | "escribiendo" // el servidor avisa que está procesando (typing indicator)
  | "parar_escribir" // el servidor avisa que terminó de procesar
  | "conectado" // confirmación de conexión establecida
  | "desconectado" // se perdió la conexión
  | "error" // ocurrió un error en el servidor
  | "fragmento" // chunk de streaming (respuesta parcial letra a letra)
  | "fin_stream"; // señal de que el streaming terminó

/**
 * Estructura del mensaje que viaja por el WebSocket (tanto enviado como recibido).
 * Todos los mensajes siguen este mismo formato JSON.
 */
export interface MensajeWs {
  /** Tipo de evento — define cómo interpretar `datos` */
  evento: TipoEventoWs;
  /** Contenido del mensaje, varía según el tipo de evento */
  datos: unknown;
  /** ID de sesión del usuario (opcional, para el backend) */
  idSesion?: string;
  /** Fecha y hora del mensaje en formato ISO 8601 */
  fechaHora?: string;
}

/**
 * Estructura de un fragmento de streaming.
 * El agente envía la respuesta trozo a trozo con este formato.
 */
export interface FragmentoStream {
  /** Texto parcial del fragmento */
  fragmento: string;
  /** ID del mensaje al que pertenece este fragmento */
  idMensaje: string;
  /** true cuando es el último fragmento y el stream terminó */
  terminado: boolean;
}

// ─── Estado UI ───────────────────────────────────────────────────────────────

export type ActiveView = "chat";

export interface AppState {
  activeView: ActiveView;
  sidebarOpen: boolean;
  sessionId: string;
}
