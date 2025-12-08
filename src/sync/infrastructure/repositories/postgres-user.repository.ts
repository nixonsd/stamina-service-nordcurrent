import { Repository } from 'typeorm';
import { PostgresDatabase } from '../../../postgres.db';
import { User } from '../../domain/entities/user.entity';
import { UserRepository } from '../../domain/repositories/user.repository';
import { UserEntity } from '../entities/user.entity';

export class PostgresUserRepository implements UserRepository {
  private readonly userRepository: Repository<UserEntity>;

  constructor() {
    this.userRepository = PostgresDatabase.instance.getRepository(UserEntity);
  }

  async findById(userId: string): Promise<User | null> {
    const entity = await this.userRepository.findOne({ where: { id: userId }, relations: ['stats'] });
    return entity ? (entity as unknown as User) : null;
  }

  async save(user: Partial<User>): Promise<User> {
    const entity = this.userRepository.create(user as unknown as UserEntity);
    await this.userRepository.save(entity);
    return entity as unknown as User;
  }
}
