import { ConflictError, NotFoundError } from '../../../shared/errors/app-error';
import { UserRepository } from '../../domain/repositories/user.repository';
import { SyncCommand, SyncResult } from '../types/sync.type';
import { User } from '../../domain/entities/user.entity';
import { EventService } from '../../domain/services/event.service';
import { StaminaService } from '../../domain/services/stamina.service';

export class SyncUserStatsUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly eventService: EventService
  ) {}

  public async execute(command: SyncCommand): Promise<SyncResult> {
    const nowMs = Date.now();

    const user = await this.userRepository.findById(command.userId);
    if (!user) {
      throw new NotFoundError('The user stats were not found', { userId: command.userId });
    }

    if (user.status === 'BLOCKED') {
      return this.buildResult(user, nowMs);
    }

    const stats = user.stats;

    if (command.lastStateVersion !== stats.stateVersion) {
      const serverView = this.buildResult(user, nowMs);
      throw new ConflictError('State version conflict', { ...serverView });
    }

    const updatedUser: User = this.eventService.handle(user, command.events, nowMs);

    await this.userRepository.save(updatedUser);

    return this.buildResult(updatedUser, nowMs);
  }

  private buildResult(user: User, nowMs: number): SyncResult {
    const staminaCurrent = StaminaService.getCurrentStamina(user, nowMs);
    const stats = user.stats;

    return {
      serverTime: nowMs,
      userStats: {
        staminaCurrent,
        staminaMax: stats.staminaMax,
        status: user.status,
        blockedAt: user.blockedAt,
        stateVersion: stats.stateVersion,
      },
    };
  }
}
