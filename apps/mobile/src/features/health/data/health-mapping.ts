import type { components } from '@thinkso/api-client';
import type { Health } from '../../../domain/health';

export function mapHealthDto(dto: components['schemas']['HealthResponse']): Health {
  if (dto.status !== 'ok') {
    throw new Error(`Unexpected health status: ${dto.status}`);
  }
  return {
    status: 'ok',
    service: dto.service,
    version: dto.version,
    checkedAt: new Date(dto.checked_at),
  };
}
