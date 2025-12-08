export interface UserStats {
  userId: string;

  staminaMax: number;
  staminaBase: number; // value at staminaLastUpdateTs
  staminaLastUpdateTs: number; // server time (sec since epoch)
  staminaRegenPerSec: number;

  stateVersion: number;
}
