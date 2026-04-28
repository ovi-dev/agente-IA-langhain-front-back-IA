import type { WsMessage, WsStreamChunk, WsEventType } from "../types";

type WsEventHandler = (data: unknown) => void;

class WebSocketService {
  private socket: WebSocket | null = null;
  private listeners: Map<WsEventType, WsEventHandler[]> = new Map();
  private reconnectAttempts = 0;
  private readonly maxReconnects = 5;
  private sessionId: string | null = null;

  /**
   * Abre la conexión WebSocket al servidor.
   * @param sessionId - ID único de la sesión del usuario
   */
  connect(sessionId: string): void {
    if (this.socket?.readyState === WebSocket.OPEN) return;

    const wsUrl = process.env.NEXT_PUBLIC_WS_URL ?? "ws://localhost:3001";
    this.sessionId = sessionId;

    // Pasamos el sessionId como query param para identificar la sesión en el backend
    this.socket = new WebSocket(`${wsUrl}/chat?sessionId=${sessionId}`);

    this.socket.onopen = () => {
      this.reconnectAttempts = 0;
      this.emit("connected", { sessionId });
      console.info("[WS] Conexión establecida");
    };

    this.socket.onmessage = (event: MessageEvent) => {
      try {
        const message: WsMessage = JSON.parse(event.data as string);
        this.emit(message.event, message.data);
      } catch {
        console.error("[WS] Error al parsear mensaje:", event.data);
      }
    };

    this.socket.onclose = () => {
      this.emit("disconnected", {});
      console.info("[WS] Conexión cerrada");
      this.handleReconnect();
    };

    this.socket.onerror = (error) => {
      this.emit("error", error);
      console.error("[WS] Error en WebSocket:", error);
    };
  }

  /**
   * Envía un mensaje al servidor a través del WebSocket.
   * @param message - Texto del mensaje del usuario
   */
  sendMessage(message: string): void {
    if (this.socket?.readyState !== WebSocket.OPEN) {
      console.warn("[WS] No hay conexión activa. Intenta reconectar.");
      return;
    }

    const payload: WsMessage = {
      event: "message",
      data: { content: message },
      sessionId: this.sessionId ?? undefined,
      timestamp: new Date().toISOString(),
    };

    this.socket.send(JSON.stringify(payload));
  }

  /**
   * Suscribirse a un evento específico del WebSocket.
   * @example
   * wsService.on("stream_chunk", (data) => {
   *   const chunk = data as WsStreamChunk;
   *   setResponse(prev => prev + chunk.chunk);
   * });
   */
  on(event: WsEventType, handler: WsEventHandler): void {
    const current = this.listeners.get(event) ?? [];
    this.listeners.set(event, [...current, handler]);
  }

  /** Eliminar todos los listeners de un evento */
  off(event: WsEventType): void {
    this.listeners.delete(event);
  }

  /** Cerrar la conexión WebSocket limpiamente */
  disconnect(): void {
    this.socket?.close();
    this.socket = null;
    this.listeners.clear();
  }

  private emit(event: WsEventType, data: unknown): void {
    const handlers = this.listeners.get(event) ?? [];
    handlers.forEach((handler) => handler(data));
  }

  private handleReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnects) return;
    this.reconnectAttempts++;
    const delay = Math.min(1000 * 2 ** this.reconnectAttempts, 30_000);
    console.info(
      `[WS] Reconectando en ${delay}ms (intento ${this.reconnectAttempts})`,
    );
    setTimeout(() => {
      if (this.sessionId) this.connect(this.sessionId);
    }, delay);
  }

  get isConnected(): boolean {
    return this.socket?.readyState === WebSocket.OPEN;
  }
}

// Singleton: una sola instancia para toda la app
export const wsService = new WebSocketService();
export type { WsStreamChunk };
