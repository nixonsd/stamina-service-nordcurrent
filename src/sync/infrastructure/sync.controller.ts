import { Router, Request, Response } from 'express';
import { sendApi } from '../../shared/helpers/send-api.helper';
import { SyncUserStatsUseCase } from '../application/use-cases/sync-user-stats.use-case';
import { PostgresUserStatsRepository } from './repositories/postgres-user-stats.repository';
import { logger } from '../../shared/logger';

export async function createSyncController() {
  const router = Router();

  try {
    // Dependency wiring done at runtime
    const postgresUserStatsRepository = new PostgresUserStatsRepository();
    const syncUserStatsUseCase = new SyncUserStatsUseCase(postgresUserStatsRepository);

    router.post('/', async (req: Request, res: Response) => {
      const result = await syncUserStatsUseCase.execute(req.body);
      sendApi(res, 200, 'OK', result);
    });
  } catch (error) {
    logger.error(`[SyncController] Failed to create controller: ${error}`);
    throw error;
  }

  return router;
}
