import { Router, Request, Response } from 'express';
import { randomUUID } from 'crypto';
import { CreateUserUseCase } from '../application/use-cases/create-user.use-case';
import { PostgresUserRepository } from './repositories/postgres-user.repository';
import { User } from '../domain/entities/user.entity';
import { logger } from '../../shared/logger';

export function createUserController() {
  const router = Router();

  const userRepository = new PostgresUserRepository();
  const createUserUseCase = new CreateUserUseCase(userRepository);

  router.post('/create', async (req: Request, res: Response) => {
    try {
      const nowMs = Date.now();
      const userId = randomUUID();

      // Default initial stamina configuration
      const INITIAL_STAMINA_MAX = 10;
      const INITIAL_REGEN_PER_SEC = 1 / 30; // fully recover in ~5 mins

      const user: User = {
        id: userId,
        status: 'ACTIVE',
        blockedAt: null,
        createdAt: new Date(nowMs),
        updatedAt: new Date(nowMs),
        stats: {
          userId,
          staminaMax: INITIAL_STAMINA_MAX,
          staminaBase: INITIAL_STAMINA_MAX, // user starts full stamina
          staminaLastUpdateTs: nowMs,
          staminaRegenPerSec: INITIAL_REGEN_PER_SEC,
          stateVersion: 1,
        },
        ...req.body, // allow client to override non-stamina fields if needed
      };

      const createdUser = await createUserUseCase.execute(user);

      return res.status(201).json(createdUser);
    } catch (error) {
      logger.error(`Create user failed: ${error}`);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  return router;
}
