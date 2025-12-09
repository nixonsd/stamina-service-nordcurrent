import { logger } from '../shared/logger';
import { PostgresDatabase } from '../postgres.db';

async function migrate() {
  await PostgresDatabase.init();
  await PostgresDatabase.instance.runMigrations();
  logger.info('Migrations completed');
  process.exit(0);
}

migrate().catch((err) => {
  logger.error(err);
  process.exit(1);
});
