import { Repository } from 'typeorm';
import { PostgresDatabase } from '../../../postgres.db';
import { UserStats } from '../../domain/entities/user-stats.entity';
import { UserStatsRepository } from '../../../sync/domain/repositories/user-stats.repository';
import { UserStatsEntity } from '../entities/user-stats.entity';

export class PostgresUserStatsRepository implements UserStatsRepository {
  private readonly userStatsRepository: Repository<UserStatsEntity>;

  constructor() {
    this.userStatsRepository = PostgresDatabase.instance.getRepository(UserStatsEntity);
  }

  async findById(userId: string): Promise<UserStats | null> {
    const entity = await this.userStatsRepository.findOneBy({ userId });
    return entity ? (entity as unknown as UserStats) : null;
  }
  update(_user: UserStats): Promise<void> {
    throw new Error('Method not implemented.');
  }
  async save(user: UserStats): Promise<void> {
    const entity = this.userStatsRepository.create(user as unknown as UserStatsEntity);
    await this.userStatsRepository.save(entity);
  }
}
