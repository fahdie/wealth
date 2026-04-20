import { IsString, IsInt, IsPositive, IsIn } from 'class-validator';

export class IntegrationStatusDTO {
  @IsInt()
  @IsPositive()
  integrationId: number;

  @IsString()
  provider: string;

  @IsString()
  @IsIn(['pending', 'connected', 'failed', 'disconnected'])
  status: 'pending' | 'connected' | 'failed' | 'disconnected';

  @IsString()
  lastSyncedAt?: string;
}