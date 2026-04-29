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

export type WsEventType =
  | "message"
  | "typing"
  | "stop_typing"
  | "connected"
  | "disconnected"
  | "error"
  | "stream_chunk"
  | "stream_end";

export interface WsMessage {
  event: WsEventType;
  data: unknown;
  sessionId?: string;
  timestamp?: string;
}

export interface WsStreamChunk {
  chunk: string;
  messageId: string;
  done: boolean;
}

// ─── Estado UI ───────────────────────────────────────────────────────────────

export type ActiveView = "chat";

export interface AppState {
  activeView: ActiveView;
  sidebarOpen: boolean;
  sessionId: string;
}
