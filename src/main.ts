import express from 'express';
import { PostgresDatabase } from './postgres.db';
import { logger } from './shared/logger';
import { createSyncController } from './sync/infrastructure/sync.controller';
import { errorHandler } from './shared/middlewares/error-handler.middleware';
import { sendApi } from './shared/helpers/send-api.helper';
import { config } from './config';

async function bootstrap() {
  try {
    // Initialize the database connection
    await PostgresDatabase.init();
  } catch (error) {
    logger.error(`Failed to initialize database: ${error}`);
    process.exit(1);
  }

  const app = express();

  // Middleware to parse JSON requests
  app.use(express.json());

  app.get('/health', (req, res) => {
    sendApi(res, 200, 'OK');
  });

  const syncRouter = await createSyncController();
  app.use('/sync', syncRouter);

  // Global error handler
  app.use(errorHandler);

  const PORT = config.api.port;
  app.listen(PORT, () => {
    logger.info(`Server is listening on port ${PORT}`);
  });
}

// Start the application
bootstrap().catch(logger.error);
