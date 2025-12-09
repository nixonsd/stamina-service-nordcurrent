import { User } from '../../domain/entities/user.entity';
import { UserRepository } from '../../domain/repositories/user.repository';

export class CreateUserUseCase {
  constructor(private readonly userRepo: UserRepository) {}

  async execute(user: Partial<User>): Promise<User> {
    return this.userRepo.save(user);
  }
}
