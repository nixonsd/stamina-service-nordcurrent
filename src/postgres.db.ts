import { DataSource } from 'typeorm';
import { config } from './config';
import { logger } from './shared/logger';
import { syncEntities } from './sync/infrastructure/entities/sync.entities';

export class PostgresDatabase {
  private static _instance: DataSource | null = null;

  public static get instance(): DataSource {
    if (!this._instance || !this._instance.isInitialized) {
      throw new Error('PostgresDatabase is not initialized. Call init() first.');
    }
    return this._instance;
  }

  public static async init(): Promise<void> {
    if (this._instance && this._instance.isInitialized) {
      logger.info('[PostgresDatabase] Already initialized');
      return;
    }

    const entities = [
      ...syncEntities,
      // ...otherEntities,
    ];

    const dataSource = new DataSource({
      type: 'postgres',
      host: config.db.host,
      port: config.db.port,
      username: config.db.username,
      password: config.db.password,
      database: config.db.database,
      entities,
      migrations: [__dirname + '/migrations/*.{ts,js}'],
      synchronize: false,
      logging: false,
    });

    try {
      await dataSource.initialize();
      this._instance = dataSource;
      logger.info('[PostgresDatabase] Connected to PostgreSQL');
    } catch (error) {
      logger.error(`[PostgresDatabase] Failed to connect to PostgreSQL: ${String(error)}`);
      throw error;
    }
  }
}
