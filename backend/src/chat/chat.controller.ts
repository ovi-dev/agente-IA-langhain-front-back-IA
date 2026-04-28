import { Controller, Post, Get, Delete, Body, Param } from '@nestjs/common';
import { ChatService } from './chat.service';

interface SendMessageDto {
  message: string;
  sessionId: string;
}

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('message')
  async sendMessage(@Body() body: SendMessageDto) {
    return this.chatService.processMessage(body.message, body.sessionId);
  }

  @Get('history/:sessionId')
  getHistory(@Param('sessionId') sessionId: string) {
    return this.chatService.getHistory(sessionId);
  }

  @Delete('history/:sessionId')
  clearHistory(@Param('sessionId') sessionId: string) {
    this.chatService.clearHistory(sessionId);
  }
}
