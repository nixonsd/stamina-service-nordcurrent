import express from 'express';
import { logger } from './shared/logger';
import { syncController } from './sync/infrastructure/sync.controller';
import { errorHandler } from './shared/middlewares/error-handler.middleware';
import { sendApi } from './shared/helpers/send-api.helper';

const app = express();

app.get('/health', (req, res) => {
  sendApi(res, 200, 'OK');
});

app.use('/sync', syncController);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`Server is listening on port ${PORT}`);
});
