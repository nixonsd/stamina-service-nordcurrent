import { UserStats } from '../entities/user-stats.entity';

export abstract class UserStatsRepository {
  abstract findById(userId: string): Promise<UserStats | null>;
  abstract save(userStats: Partial<UserStats>): Promise<UserStats>;
}
