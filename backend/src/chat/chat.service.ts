import { Injectable, Logger } from '@nestjs/common';
import { randomUUID } from 'crypto';

export interface ChatMessage {
  id: string;
  message: string;
  sessionId: string;
  timestamp: string;
}

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);
  private readonly agentUrl =
    process.env.AGENT_SERVICE_URL ?? 'http://localhost:8000';

  async processMessage(
    message: string,
    sessionId: string,
  ): Promise<ChatMessage> {
    try {
      const res = await fetch(`${this.agentUrl}/chat/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, session_id: sessionId }),
        signal: AbortSignal.timeout(30_000),
      });

      if (!res.ok) {
        throw new Error(`Agent responded with status ${res.status}`);
      }

      const data = (await res.json()) as ChatMessage;
      return data;
    } catch (err) {
      this.logger.error('Error calling agent service', err);
      // Fallback graceful si el servicio Python no está disponible
      return {
        id: randomUUID(),
        message:
          'El servicio de IA no está disponible en este momento. Asegúrate de que el agente Python esté corriendo.',
        sessionId,
        timestamp: new Date().toISOString(),
      };
    }
  }

  async getHistory(sessionId: string): Promise<unknown[]> {
    try {
      const res = await fetch(`${this.agentUrl}/chat/history/${sessionId}`, {
        signal: AbortSignal.timeout(5_000),
      });
      if (!res.ok) return [];
      return res.json() as Promise<unknown[]>;
    } catch {
      return [];
    }
  }

  async clearHistory(sessionId: string): Promise<void> {
    try {
      await fetch(`${this.agentUrl}/chat/history/${sessionId}`, {
        method: 'DELETE',
        signal: AbortSignal.timeout(5_000),
      });
    } catch (err) {
      this.logger.warn('Could not clear history on agent service', err);
    }
  }
}
