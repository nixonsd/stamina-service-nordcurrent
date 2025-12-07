import { UserStats } from '../entities/user-stats.entity';

export abstract class UserStatsRepository {
  abstract findById(userId: string): Promise<UserStats | null>;
  abstract update(user: UserStats): Promise<void>;
  abstract save(user: UserStats): Promise<void>;
}
