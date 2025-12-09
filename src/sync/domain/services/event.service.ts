import { StaminaService } from './stamina.service';
import { User } from '../entities/user.entity';
import { GameEvent } from '../entities/game-event.entity';

// Stamina cost/reward constants for event types
const LEVEL_START_STAMINA_COST = 1;
const LEVEL_FINISH_STAMINA_REWARD = 1;

export class EventService {
  handle(user: User, events: GameEvent[], nowMs: number): User {
    let updated = user;

    for (const event of events) {
      if (event.type === 'LEVEL_START') {
        updated = StaminaService.spendStamina(updated, nowMs, LEVEL_START_STAMINA_COST);
      }
      if (event.type === 'LEVEL_FINISH') {
        updated = StaminaService.addStamina(updated, nowMs, LEVEL_FINISH_STAMINA_REWARD);
      }
      // ... handle other event types as needed
    }

    return updated;
  }
}
