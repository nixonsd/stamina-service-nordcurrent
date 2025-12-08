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

  static spendStamina(user: User, nowMs: number, cost: number): User {
    const current = this.getCurrentStamina(user, nowMs);
    if (current < cost) throw new Error('NOT_ENOUGH_STAMINA');

    return {
      ...user,
      stats: {
        ...user.stats,
        staminaBase: current - cost,
        staminaLastUpdateTs: nowMs,
        stateVersion: user.stats.stateVersion + 1,
      },
    };
  }
}
