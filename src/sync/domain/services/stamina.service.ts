import { UserStats } from '../entities/user-stats.entity';

export class StaminaService {
  /**
   * Computes current stamina based on a snapshot taken at staminaLastUpdateTs.
   * now and staminaLastUpdateTs are expected to be in milliseconds.
   */
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
    const clamped = Math.min(staminaMax, regenerated);

    // Stamina is usually an integer, so we round down
    return Math.floor(clamped);
  }

  static getCurrentStamina(userStats: UserStats, nowMs: number): number {
    return this.computeCurrent(
      userStats.staminaBase,
      userStats.staminaLastUpdateTs,
      userStats.staminaRegenPerSec,
      userStats.staminaMax,
      nowMs
    );
  }

  /**
   * Spends stamina and updates the snapshot to the current time.
   * Throws if there is not enough stamina.
   */
  static spendStamina(userStats: UserStats, nowMs: number, cost: number): UserStats {
    const current = this.getCurrentStamina(userStats, nowMs);
    if (current < cost) {
      throw new Error('NOT_ENOUGH_STAMINA');
    }

    const newBase = current - cost;

    return {
      ...userStats,
      staminaBase: newBase,
      staminaLastUpdateTs: nowMs,
      stateVersion: userStats.stateVersion + 1,
    };
  }

  /**
   * Freezes current stamina at nowMs without changing its value.
   * Useful when you want to bump stateVersion and persist a fresh snapshot.
   */
  static freezeAtNow(userStats: UserStats, nowMs: number): UserStats {
    const current = this.getCurrentStamina(userStats, nowMs);

    return {
      ...userStats,
      staminaBase: current,
      staminaLastUpdateTs: nowMs,
      stateVersion: userStats.stateVersion + 1,
    };
  }
}
