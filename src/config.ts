export interface Config {
  db: {
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
  };
  api: {
    port: number;
  };
}

export const config: Config = {
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    username: process.env.DB_USER || 'test_user',
    password: process.env.DB_PASSWORD || 'test_password',
    database: process.env.DB_NAME || 'nord_current_game_state',
  },
  api: {
    port: Number(process.env.PORT) || 3000,
  },
};

export default config;
