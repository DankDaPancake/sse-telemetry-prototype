import { Injectable } from '@nestjs/common';
import { BehaviorSubject, map } from 'rxjs';

export interface GameState {
  players: Record<string, { name: string; score: number }>;
}

@Injectable()
export class AppService {
  // 1. Initial State
  private state: GameState = {
    players: {},
  };

  // 2. The "Radio Station" (phát lại tín hiệu cuối cùng cho người tham gia mới nhất)
  // Intialize default state
  private gameSubject = new BehaviorSubject<GameState>(this.state);

  // 3. Getter cho gamestream
  getGameStream() {
    return this.gameSubject.asObservable().pipe(
      // Định dạng message cho SSE ({ data: ... })
      map((data) => ({ data })),
    );
  }

  // 4. Join game
  joinGame(clientId: string, name: string) {
    if (!this.state.players[clientId]) {
      this.state.players[clientId] = { name, score: 0 };
      this.pushUpdate();
    }
  }

  // 5. Move (Tính điểm)
  movePlayer(clientId: string) {
    if (this.state.players[clientId]) {
      this.state.players[clientId].score += 5;

      // Cap at 100 for the win
      if (this.state.players[clientId].score > 100) {
        this.state.players[clientId].score = 100;
      }

      this.pushUpdate();
    }
  }

  // Đẩy update đến các listener
  private pushUpdate() {
    this.gameSubject.next(this.state);
  }
}
