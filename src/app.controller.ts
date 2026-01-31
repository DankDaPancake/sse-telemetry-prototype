import { Controller, Sse, MessageEvent, Body, Post } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AppService } from './app.service';

@Controller('api')
export class AppController {
  constructor(private readonly appService: AppService) {}

  // 1. The Stream (Listening)
  @Sse('events')
  events(): Observable<MessageEvent> {
    return this.appService.getGameStream();
  }

  // 2. Join
  @Post('join')
  join(@Body() body: { id: string; name: string }) {
    this.appService.joinGame(body.id, body.name);
    return { status: 'joined' };
  }

  // 3. Run
  @Post('move')
  move(@Body() body: { id: string }) {
    this.appService.movePlayer(body.id);
    return { status: 'moved' };
  }
}
