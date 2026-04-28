import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, WebSocket } from 'ws';
import { IncomingMessage } from 'http';
import { ChatService } from './chat.service';

interface ExtendedWebSocket extends WebSocket {
  sessionId?: string;
}

interface WsIncomingData {
  content: string;
}

@WebSocketGateway({ path: '/chat' })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  constructor(private readonly chatService: ChatService) {}

  handleConnection(client: ExtendedWebSocket, request: IncomingMessage): void {
    const url = new URL(request.url ?? '/', `http://${request.headers.host}`);
    client.sessionId = url.searchParams.get('sessionId') ?? undefined;

    this.send(client, {
      event: 'connected',
      data: { sessionId: client.sessionId },
    });
  }

  handleDisconnect(client: ExtendedWebSocket): void {
    console.log(`[WS] Desconectado: ${client.sessionId}`);
  }

  @SubscribeMessage('message')
  async handleMessage(
    @ConnectedSocket() client: ExtendedWebSocket,
    @MessageBody() data: WsIncomingData,
  ): Promise<void> {
    const sessionId = client.sessionId ?? 'unknown';
    const content = data?.content ?? '';

    this.send(client, { event: 'typing', data: {} });

    const response = await this.chatService.processMessage(content, sessionId);

    this.send(client, { event: 'stop_typing', data: {} });
    this.send(client, { event: 'message', data: response });
  }

  private send(client: ExtendedWebSocket, payload: unknown): void {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(payload));
    }
  }
}
