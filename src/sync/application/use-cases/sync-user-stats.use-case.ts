import { SyncRequestDto, SyncResponseDto } from '../dtos/sync.dto';
import { StaminaService } from '../../../sync/domain/services/stamina.service';
import { ConflictError, NotFoundError } from '../../../shared/errors/app-error';
import { UserStatsRepository } from '../../domain/repositories/user-stats.repository';

export class SyncUserStatsUseCase {
  constructor(private readonly userStatsRepository: UserStatsRepository) {}

  public async execute(request: SyncRequestDto): Promise<SyncResponseDto> {
    const now = new Date().getTime() / 1000;

    // const currentStats: UserStats = {
    //   userId: request.userId,
    //   status: 'ACTIVE',
    //   blockedAt: null,
    //   staminaMax: 10,
    //   staminaBase: 5,
    //   staminaLastUpdateTs: 1765123744,
    //   staminaRegenPerSec: 1 / 10,
    //   stateVersion: 1,
    // };
    const currentStats = await this.userStatsRepository.findById(request.userId);
    if (!currentStats) {
      throw new NotFoundError('The user stats were not found');
    }

    if (currentStats.status === 'BLOCKED') {
      // Blocked users do not change stats, but we still return current view
      const staminaCurrent = StaminaService.getCurrentStamina(currentStats, now);
      return {
        serverTime: now,
        userStats: {
          staminaCurrent,
          staminaMax: currentStats.staminaMax,
          status: currentStats.status,
          blockedAt: currentStats.blockedAt,
          stateVersion: currentStats.stateVersion,
        },
      };
    }

    // Reject if client has too old stateVersion
    if (request.lastStateVersion < currentStats.stateVersion) {
      throw new ConflictError('State version conflict');
    }

    let newStats = currentStats;

    for (const event of request.events) {
      switch (event.type) {
        case 'LEVEL_START': {
          // Simple demo: cost 1 stamina per level start
          const cost = 1;
          newStats = StaminaService.spendStamina(newStats, now, cost);
          break;
        }
        case 'LEVEL_FINISH': {
          // For now we do not change stats; later you can add logic based on payload
          // e.g. reward, difficulty, etc.
          break;
        }
        default: {
          // Unknown event types are ignored for stats
          break;
        }
      }
    }

    await this.userStatsRepository.save(newStats);

    const staminaCurrent = StaminaService.getCurrentStamina(newStats, now);

    return {
      serverTime: now,
      userStats: {
        staminaCurrent,
        staminaMax: newStats.staminaMax,
        status: newStats.status,
        blockedAt: newStats.blockedAt,
        stateVersion: newStats.stateVersion,
      },
    };
  }
}
