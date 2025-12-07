import { Router } from 'express';
import { CreateUserUseCase } from '../application/use-cases/create-user.use-case';
import { PostgresUserRepository } from './repositories/postgres-user.repository';
import { randomUUID } from 'crypto';
import { User } from '../domain/entities/user.entity';
import { CreateUserStatsUseCase } from '../application/use-cases/create-user-stats.use-case';
import { PostgresUserStatsRepository } from './repositories/postgres-user-stats.repository';

export async function createUserController() {
  const router = Router();

  const userRepo = new PostgresUserRepository();
  const userStatsRepo = new PostgresUserStatsRepository();
  const createUserUseCase = new CreateUserUseCase(userRepo);
  const createUserStatsUseCase = new CreateUserStatsUseCase(userStatsRepo);

  router.post('/create', async (req, res) => {
    const requestBody = req.body;
    const now = new Date();
    const userId = randomUUID();

    const user: User = {
      id: userId,
      status: 'ACTIVE',
      createdAt: now,
      updatedAt: now,
      ...requestBody,
    };

    const newUser = await createUserUseCase.execute(user);

    await createUserStatsUseCase.execute(userId);

    res.status(201).json(newUser);
  });

  return router;
}
