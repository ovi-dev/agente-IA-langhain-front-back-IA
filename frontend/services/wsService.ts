import type { MensajeWs, FragmentoStream, TipoEventoWs } from "../types";

// ─── Tipos internos ───────────────────────────────────────────────────────────

/** Firma de cualquier función que escucha un evento del WebSocket */
type ManejadorEvento = (datos: unknown) => void;

// ─── Clase principal ──────────────────────────────────────────────────────────

/**
 * ServicioWebSocket
 * ─────────────────
 * Encapsula toda la lógica de WebSocket en un solo lugar:
 *  - Abrir y cerrar la conexión
 *  - Enviar mensajes al servidor
 *  - Escuchar eventos que llegan del servidor
 *  - Reconectarse automáticamente si se cae la conexión
 *
 * Para usar en otro proyecto:
 *  1. Cambia TipoEventoWs en types/index.ts con tus propios eventos
 *  2. Cambia la URL en conectar() para apuntar a tu servidor
 *  3. El resto no necesita cambios
 */
class ServicioWebSocket {
  /** El socket nativo del navegador — null cuando no hay conexión activa */
  private socket: WebSocket | null = null;

  /**
   * Mapa de escuchadores por tipo de evento.
   * Clave: nombre del evento (ej. "mensaje")
   * Valor: array de funciones a ejecutar cuando llega ese evento
   */
  private escuchadores: Map<TipoEventoWs, ManejadorEvento[]> = new Map();

  /** Contador de intentos de reconexión fallidos */
  private intentosReconexion = 0;

  /** Número máximo de intentos antes de rendirse */
  private readonly maxIntentos = 5;

  /** ID de sesión guardado para poder reconectarse automáticamente */
  private idSesion: string | null = null;

  // ── Métodos públicos ────────────────────────────────────────────────────────

  /**
   * Abre la conexión WebSocket con el servidor.
   * Si ya hay una conexión abierta, no hace nada.
   *
   * @param idSesion - UUID único que identifica al usuario en el backend
   */
  conectar(idSesion: string): void {
    // Evita abrir una segunda conexión si ya hay una activa
    if (this.socket?.readyState === WebSocket.OPEN) return;

    const urlServidor = process.env.NEXT_PUBLIC_WS_URL ?? "ws://localhost:3001";
    this.idSesion = idSesion;

    // Abre el canal WebSocket — el idSesion va en la URL para que el backend
    // sepa a qué historial de conversación pertenece esta conexión
    this.socket = new WebSocket(`${urlServidor}/chat?sessionId=${idSesion}`);

    // Se ejecuta cuando la conexión se establece correctamente
    this.socket.onopen = () => {
      this.intentosReconexion = 0; // resetea el contador al conectar bien
      this.disparar("conectado", { idSesion });
      console.info("[WS] Conexión establecida");
    };

    // Se ejecuta cada vez que llega un mensaje del servidor
    this.socket.onmessage = (evento: MessageEvent) => {
      try {
        // Todos los mensajes vienen como JSON con forma { evento, datos }
        const mensaje: MensajeWs = JSON.parse(evento.data as string);
        // Dispara los escuchadores registrados para ese tipo de evento
        this.disparar(mensaje.evento, mensaje.datos);
      } catch {
        console.error("[WS] Mensaje con formato inválido:", evento.data);
      }
    };

    // Se ejecuta cuando la conexión se cierra (por error o intencionalmente)
    this.socket.onclose = () => {
      this.disparar("desconectado", {});
      console.info("[WS] Conexión cerrada");
      this.intentarReconexion(); // intenta volver a conectar automáticamente
    };

    // Se ejecuta cuando ocurre un error en el socket
    this.socket.onerror = (error) => {
      this.disparar("error", error);
      console.error("[WS] Error en la conexión:", error);
    };
  }

  /**
   * Envía un mensaje de texto al servidor.
   * El servidor lo recibe, lo pasa al agente de IA y devuelve la respuesta.
   *
   * @param contenido - Texto que escribió el usuario
   */
  enviarMensaje(contenido: string): void {
    if (this.socket?.readyState !== WebSocket.OPEN) {
      console.warn("[WS] Sin conexión activa — no se puede enviar el mensaje.");
      return;
    }

    // Estructura del mensaje que entiende el backend
    const carga: MensajeWs = {
      evento: "mensaje",
      datos: { contenido },
      idSesion: this.idSesion ?? undefined,
      fechaHora: Temporal.Now.instant().toString(), // ISO 8601
    };

    // WebSocket solo transmite strings — por eso serializamos a JSON
    this.socket.send(JSON.stringify(carga));
  }

  /**
   * Registra una función que se ejecutará cada vez que llegue un evento concreto.
   *
   * @param evento - Nombre del evento a escuchar (ej. "mensaje", "fragmento")
   * @param manejador - Función que recibe los datos del evento
   *
   * @example
   * servicioWs.escuchar("fragmento", (datos) => {
   *   const frag = datos as FragmentoStream;
   *   setRespuesta(prev => prev + frag.fragmento);
   * });
   */
  escuchar(evento: TipoEventoWs, manejador: ManejadorEvento): void {
    const actuales = this.escuchadores.get(evento) ?? [];
    this.escuchadores.set(evento, [...actuales, manejador]);
  }

  /**
   * Elimina todos los escuchadores de un evento.
   * Importante llamarlo en el cleanup del useEffect para no acumular listeners.
   *
   * @param evento - Nombre del evento a limpiar
   */
  dejarEscuchar(evento: TipoEventoWs): void {
    this.escuchadores.delete(evento);
  }

  /**
   * Cierra la conexión WebSocket y limpia todos los escuchadores.
   * Se llama al desmontar el componente (return del useEffect).
   */
  desconectar(): void {
    this.socket?.close();
    this.socket = null;
    this.escuchadores.clear();
  }

  /** true si hay una conexión WebSocket activa en este momento */
  get estaConectado(): boolean {
    return this.socket?.readyState === WebSocket.OPEN;
  }

  // ── Métodos privados ────────────────────────────────────────────────────────

  /**
   * Llama a todos los escuchadores registrados para un evento.
   * Es el "despachador" interno — nadie fuera de la clase lo usa.
   */
  private disparar(evento: TipoEventoWs, datos: unknown): void {
    const manejadores = this.escuchadores.get(evento) ?? [];
    manejadores.forEach((fn) => fn(datos));
  }

  /**
   * Intenta reconectarse automáticamente tras una desconexión.
   * Usa backoff exponencial: espera 2s, luego 4s, 8s, 16s... hasta 30s máximo.
   * Así evita bombardear el servidor si está caído.
   */
  private intentarReconexion(): void {
    if (this.intentosReconexion >= this.maxIntentos) {
      console.warn("[WS] Se alcanzó el máximo de intentos de reconexión.");
      return;
    }

    this.intentosReconexion++;

    // 2^intento * 1000ms → 2s, 4s, 8s, 16s... con tope en 30s
    const espera = Math.min(1000 * 2 ** this.intentosReconexion, 30_000);

    console.info(
      `[WS] Reconectando en ${espera}ms (intento ${this.intentosReconexion}/${this.maxIntentos})`,
    );

    setTimeout(() => {
      if (this.idSesion) this.conectar(this.idSesion);
    }, espera);
  }
}

// ─── Singleton ────────────────────────────────────────────────────────────────
// Se crea UNA sola instancia y se exporta.
// Todos los componentes importan este mismo objeto — nunca crean uno nuevo.
// Si hubiera dos instancias, habría dos conexiones WebSocket abiertas (mal).
export const servicioWs = new ServicioWebSocket();

// Re-exportamos el tipo para usarlo en el hook
export type { FragmentoStream };
