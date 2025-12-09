import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitUsersAndUserStats1765238400000 implements MigrationInterface {
  name = 'InitUsersAndUserStats1765238400000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE "users_status_enum" AS ENUM ('ACTIVE', 'BLOCKED');
    `);

    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" text PRIMARY KEY,
        "status" "users_status_enum" NOT NULL DEFAULT 'ACTIVE',
        "blocked_at" TIMESTAMPTZ NULL,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now()
      );
    `);

    await queryRunner.query(`
      CREATE TABLE "user_stats" (
        "user_id" text PRIMARY KEY,
        "stamina_max" integer NOT NULL DEFAULT 10,
        "stamina_base" integer NOT NULL DEFAULT 10,
        "stamina_last_update_ts" bigint NOT NULL,
        "stamina_regen_per_sec" numeric(10, 6) NOT NULL,
        "state_version" integer NOT NULL DEFAULT 0,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT "FK_user_stats_user"
          FOREIGN KEY ("user_id") REFERENCES "users"("id")
          ON DELETE CASCADE ON UPDATE NO ACTION
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_stats" DROP CONSTRAINT "FK_user_stats_user";`);
    await queryRunner.query(`DROP TABLE "user_stats";`);
    await queryRunner.query(`DROP TABLE "users";`);
    await queryRunner.query(`DROP TYPE "users_status_enum";`);
  }
}
