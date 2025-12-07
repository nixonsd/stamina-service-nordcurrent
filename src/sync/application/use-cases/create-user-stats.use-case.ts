import { UserStatsRepository } from '../../domain/repositories/user-stats.repository';
import { UserStats } from '../../domain/entities/user-stats.entity';

export class CreateUserStatsUseCase {
  constructor(private readonly userStatsRepo: UserStatsRepository) {}

  public async execute(userId: string): Promise<UserStats> {
    const newUserStats: UserStats = {
      userId,
      status: 'ACTIVE',
      blockedAt: null,
      staminaMax: 10,
      staminaBase: 10,
      staminaLastUpdateTs: Math.floor(Date.now() / 1000),
      staminaRegenPerSec: 1 / 10,
      stateVersion: 1,
    };

    await this.userStatsRepo.save(newUserStats);

    return newUserStats;
  }
}
