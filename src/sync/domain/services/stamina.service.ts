import { UserStats } from '../entities/user-stats.entity';

export class StaminaService {
  static computeCurrent(
    staminaBase: number,
    staminaLastUpdateTs: number,
    staminaRegenPerSec: number,
    staminaMax: number,
    now: number
  ): number {
    const elapsed = Math.max(0, now - staminaLastUpdateTs);
    const regenerated = staminaBase + elapsed * staminaRegenPerSec;
    return Math.ceil(Math.min(staminaMax, regenerated));
  }

  static getCurrentStamina(userStats: UserStats, now: number): number {
    return this.computeCurrent(
      userStats.staminaBase,
      userStats.staminaLastUpdateTs,
      userStats.staminaRegenPerSec,
      userStats.staminaMax,
      now
    );
  }

  static spendStamina(userStats: UserStats, now: number, cost: number): UserStats {
    const current = this.getCurrentStamina(userStats, now);
    if (current < cost) {
      throw new Error('NOT_ENOUGH_STAMINA');
    }

    const newBase = current - cost;

    return {
      ...userStats,
      staminaBase: newBase,
      staminaLastUpdateTs: now,
      stateVersion: userStats.stateVersion + 1,
    };
  }

  static freezeAtNow(userStats: UserStats, now: number): UserStats {
    const current = this.getCurrentStamina(userStats, now);

    return {
      ...userStats,
      staminaBase: current,
      staminaLastUpdateTs: now,
      stateVersion: userStats.stateVersion + 1,
    };
  }
}
