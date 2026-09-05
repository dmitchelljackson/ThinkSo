import type { ApiClient } from '@thinkso/api-client';
import type { Health } from '../../../domain/health';
import { mapHealthDto } from './health-mapping';

export interface HealthRepository {
  getHealth(): Promise<Health>;
}

export type HealthTransport = Pick<ApiClient, 'GET'>;

export class ApiHealthRepository implements HealthRepository {
  public constructor(private readonly transport: HealthTransport) {}

  public async getHealth(): Promise<Health> {
    const { data, error } = await this.transport.GET('/v1/health');
    if (error !== undefined || data === undefined) {
      throw new Error('Health request failed');
    }
    return mapHealthDto(data);
  }
}
