import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne } from 'typeorm';
import { UserStatsEntity } from './user-stats.entity';

export type UserStatus = 'ACTIVE' | 'BLOCKED';

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryColumn()
  id!: string;

  @Column({
    type: 'enum',
    enum: ['ACTIVE', 'BLOCKED'],
    default: 'ACTIVE',
  })
  status!: UserStatus;

  @Column({ name: 'blocked_at', type: 'timestamptz', nullable: true })
  blockedAt: Date | null = null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;

  @OneToOne(() => UserStatsEntity, (stats) => stats.user, { cascade: true })
  stats?: UserStatsEntity;
}
