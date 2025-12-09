export interface GameEvent {
  id: string;
  type: string; // "LEVEL_START" | "LEVEL_FINISH" | ...
  clientTs: number; // client time in seconds
  payload?: Record<string, unknown>;
}
