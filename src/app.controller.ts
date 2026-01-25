import { Controller, Sse, MessageEvent } from '@nestjs/common';
import { interval, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Controller('api') // 1. Global prefix for this controller
export class AppController {
  @Sse('events') // 2. Intialize the route: GET /api/events
  sse(): Observable<MessageEvent> {
    // 3. Emit a new number every 1 second
    return interval(1000).pipe(
      map((num) => ({
        data: {
          id: num,
          timestamp: new Date().toISOString(),
          message: `Server tick #${num}`,
        }
      })),
    );
  }
}