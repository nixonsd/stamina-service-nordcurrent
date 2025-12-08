import { Router, Request, Response } from 'express';
import { sendApi } from '../../shared/helpers/send-api.helper';
import { SyncUserStatsUseCase } from '../application/use-cases/sync-user-stats.use-case';
import { PostgresUserRepository } from './repositories/postgres-user.repository';
import { SyncRequestDto, SyncResponseDto } from './dtos/sync.dto';
import { logger } from '../../shared/logger';
import { mapDtoToCommand, mapResultToDto } from './mappers/sync.mapper';
import { EventService } from '../domain/services/event.service';

export async function createSyncController() {
  const router = Router();

  // Dependency wiring done at runtime
  const postgresUserRepository = new PostgresUserRepository();
  const eventService = new EventService();
  const syncUserStatsUseCase = new SyncUserStatsUseCase(postgresUserRepository, eventService);

  router.post('/', async (req: Request<unknown, unknown, SyncRequestDto>, res: Response<SyncResponseDto>) => {
    try {
      const command = mapDtoToCommand(req.body);
      const result = await syncUserStatsUseCase.execute(command);
      return sendApi(res, 200, 'OK', mapResultToDto(result));
    } catch (err) {
      logger.error(err);
      return sendApi(res, 500, 'Internal Server Error');
    }
  });

  return router;
}
