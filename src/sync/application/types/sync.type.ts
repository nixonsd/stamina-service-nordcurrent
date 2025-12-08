export interface SyncEvent {
  id: string;
  type: string;
  clientTs: number;
  payload?: Record<string, unknown>;
}

export interface SyncCommand {
  userId: string;
  lastStateVersion: number;
  events: SyncEvent[];
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
