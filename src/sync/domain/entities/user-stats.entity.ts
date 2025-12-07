export type UserStatus = 'ACTIVE' | 'BLOCKED';

export interface UserStats {
  userId: string;

  status: UserStatus;
  blockedAt: number | null; // Unix time in seconds, null if not blocked

  staminaMax: number;
  staminaBase: number; // value at staminaLastUpdateTs
  staminaLastUpdateTs: number; // server time (sec since epoch)
  staminaRegenPerSec: number;

  stateVersion: number;
}

export interface UserStatsView {
  staminaCurrent: number;
  staminaMax: number;
  status: UserStatus;
  blockedAt: number | null;
  stateVersion: number;
}
