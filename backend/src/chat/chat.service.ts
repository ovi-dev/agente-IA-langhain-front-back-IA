import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';

export interface ChatMessage {
  id: string;
  message: string;
  sessionId: string;
  timestamp: string;
}

@Injectable()
export class ChatService {
  private readonly history = new Map<string, ChatMessage[]>();

  async processMessage(
    message: string,
    sessionId: string,
  ): Promise<ChatMessage> {
    const response: ChatMessage = {
      id: randomUUID(),
      message: `Echo: ${message}`,
      sessionId,
      timestamp: new Date().toISOString(),
    };

    const existing = this.history.get(sessionId) ?? [];
    this.history.set(sessionId, [...existing, response]);

    return response;
  }

  getHistory(sessionId: string): ChatMessage[] {
    return this.history.get(sessionId) ?? [];
  }

  clearHistory(sessionId: string): void {
    this.history.delete(sessionId);
  }
}
