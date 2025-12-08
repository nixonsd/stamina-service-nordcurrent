import { SyncEventDto, SyncRequestDto, SyncResponseDto } from '../dtos/sync.dto';
import { SyncCommand, SyncEvent, SyncResult } from '../../application/types/sync.type';

export function mapDtoToCommand(dto: SyncRequestDto): SyncCommand {
  return {
    userId: dto.userId,
    lastStateVersion: dto.lastStateVersion,
    events: dto.events.map(mapEventDtoToEvent),
  };
}

export function mapEventDtoToEvent(dto: SyncEventDto): SyncEvent {
  return {
    id: dto.id,
    type: dto.type,
    clientTs: dto.clientTs,
    payload: dto.payload,
  };
}

export function mapResultToDto(result: SyncResult): SyncResponseDto {
  return {
    serverTime: result.serverTime,
    userStats: {
      staminaCurrent: result.userStats.staminaCurrent,
      staminaMax: result.userStats.staminaMax,
      status: result.userStats.status,
      blockedAt: result.userStats.blockedAt,
      stateVersion: result.userStats.stateVersion,
    },
  };
}
