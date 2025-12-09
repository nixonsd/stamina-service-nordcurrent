import { UserStatus } from '../types/user-status.type';
import { UserStats } from './user-stats.entity';

export interface User {
  id: string;
  status: UserStatus;
  blockedAt: number | null; // Unix time in milliseconds, null if not blocked

  createdAt: Date;
  updatedAt: Date;

  stats: UserStats;
}
