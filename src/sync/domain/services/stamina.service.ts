import { BadRequestError } from '../../../shared/errors/app-error';
import { User } from '../entities/user.entity';

export class StaminaService {
  static computeCurrent(
    staminaBase: number,
    staminaLastUpdateTsMs: number,
    staminaRegenPerSec: number,
    staminaMax: number,
    nowMs: number
  ): number {
    const elapsedMs = Math.max(0, nowMs - staminaLastUpdateTsMs);
    const elapsedSeconds = Math.floor(elapsedMs / 1000);
    const regenerated = staminaBase + elapsedSeconds * staminaRegenPerSec;
    return Math.floor(Math.min(staminaMax, regenerated));
  }

  static getCurrentStamina(user: User, nowMs: number): number {
    const s = user.stats;
    return this.computeCurrent(s.staminaBase, s.staminaLastUpdateTs, s.staminaRegenPerSec, s.staminaMax, nowMs);
  }

  static applyStaminaDelta(user: User, nowMs: number, delta: number): User {
    const current = this.getCurrentStamina(user, nowMs);
    const newBase = current + delta;

    if (newBase < 0) {
      throw new BadRequestError('NOT_ENOUGH_STAMINA');
    }

    const clamped = Math.min(user.stats.staminaMax, newBase);

    return {
      ...user,
      stats: {
        ...user.stats,
        staminaBase: clamped,
        staminaLastUpdateTs: nowMs,
        stateVersion: user.stats.stateVersion + 1,
      },
    };
  }

  static spendStamina(user: User, nowMs: number, cost: number): User {
    return this.applyStaminaDelta(user, nowMs, -cost);
  }

  static addStamina(user: User, nowMs: number, amount: number): User {
    return this.applyStaminaDelta(user, nowMs, amount);
  }
}
