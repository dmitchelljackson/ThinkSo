import type { components } from '@thinkso/api-client';
import type { Health } from '../../../domain/health';

type HealthResponse = components['schemas']['HealthResponse'];

function isHealthResponse(value: unknown): value is HealthResponse {
  if (typeof value !== 'object' || value === null) return false;

  const candidate = value as Record<string, unknown>;
  return (
    candidate.status === 'ok' &&
    typeof candidate.service === 'string' &&
    typeof candidate.version === 'string' &&
    typeof candidate.checked_at === 'string'
  );
}

export function mapHealthDto(dto: unknown): Health {
  if (!isHealthResponse(dto)) {
    throw new Error('Invalid health response');
  }

  const checkedAt = new Date(dto.checked_at);
  if (Number.isNaN(checkedAt.getTime())) throw new Error('Invalid health response timestamp');

  return {
    status: 'ok',
    service: dto.service,
    version: dto.version,
    checkedAt,
  };
}
