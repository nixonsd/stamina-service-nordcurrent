import {
  Entity,
  PrimaryColumn,
  Column,
  VersionColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';

@Entity({ name: 'user_stats' })
export class UserStatsEntity {
  @PrimaryColumn({ type: 'text', name: 'user_id' })
  userId!: string;

  @OneToOne(() => UserEntity, (user) => user.stats, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user!: UserEntity;

  @Column({ name: 'stamina_max', type: 'integer', default: 10 })
  staminaMax!: number;

  @Column({
    name: 'stamina_base',
    type: 'integer',
    default: 10,
    transformer: {
      to: (value: number) => value,
      from: (value: string | null) => (value === null ? 0 : parseFloat(value)),
    },
  })
  staminaBase!: number;

  @Column({ name: 'stamina_last_update_ts', type: 'bigint' })
  staminaLastUpdateTs!: number; // seconds since epoch

  @Column({
    name: 'stamina_regen_per_sec',
    type: 'numeric',
    precision: 10,
    scale: 6,
    transformer: {
      to: (value: number) => value,
      from: (value: string | null) => (value === null ? 0 : parseFloat(value)),
    },
  })
  staminaRegenPerSec!: number;

  @VersionColumn({ name: 'state_version', type: 'integer', default: 0 })
  stateVersion!: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;
}
