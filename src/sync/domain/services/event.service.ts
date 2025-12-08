import { StaminaService } from './stamina.service';
import { User } from '../entities/user.entity';
import { Event } from '../entities/event.entity';

export class EventService {
  handle(user: User, events: Event[], nowMs: number): User {
    let updated = user;

    for (const event of events) {
      if (event.type === 'LEVEL_START') {
        updated = StaminaService.spendStamina(updated, nowMs, 1);
      }
      // LEVEL_FINISH and others are ignored for now
    }

    return updated;
  }
}
