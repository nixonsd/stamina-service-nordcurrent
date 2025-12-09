import { StaminaService } from './stamina.service';
import { User } from '../entities/user.entity';
import { GameEvent } from '../entities/game-event.entity';

export class EventService {
  handle(user: User, events: GameEvent[], nowMs: number): User {
    let updated = user;

    for (const event of events) {
      if (event.type === 'LEVEL_START') {
        updated = StaminaService.spendStamina(updated, nowMs, 1);
      }
      if (event.type === 'LEVEL_FINISH') {
        updated = StaminaService.addStamina(updated, nowMs, 1);
      }
      // ... handle other event types as needed
    }

    return updated;
  }
}
