export interface SyncEventDto {
  id: string;
  type: string; // "LEVEL_START" | "LEVEL_FINISH" | ...
  clientTs: number; // client time in seconds
  payload?: Record<string, unknown>;
}

export interface SyncRequestDto {
  userId: string;
  lastStateVersion: number;
  events: SyncEventDto[];
}

export interface SyncResponseDto {
  serverTime: number;
  userStats: {
    staminaCurrent: number;
    staminaMax: number;
    status: 'ACTIVE' | 'BLOCKED';
    blockedAt: number | null;
    stateVersion: number;
  };
}
