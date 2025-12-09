import { GameEvent } from '../../domain/entities/game-event.entity';

export interface SyncCommand {
  userId: string;
  lastStateVersion: number;
  events: GameEvent[];
}

export interface SyncResult {
  serverTime: number;
  userStats: {
    staminaCurrent: number;
    staminaMax: number;
    status: 'ACTIVE' | 'BLOCKED';
    blockedAt: number | null;
    stateVersion: number;
  };
}
