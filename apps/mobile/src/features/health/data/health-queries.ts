import type { QueryClient, UseQueryOptions } from '@tanstack/react-query';
import type { Health } from '../../../domain/health';
import type { HealthRepository } from './health-repository';

export interface HealthQueries {
  health(): UseQueryOptions<Health, Error, Health, readonly ['health']>;
}

export class DefaultHealthQueries implements HealthQueries {
  public constructor(private readonly repository: HealthRepository) {}

  public health(): UseQueryOptions<Health, Error, Health, readonly ['health']> {
    return {
      queryKey: ['health'] as const,
      queryFn: () => this.repository.getHealth(),
      staleTime: 30_000,
      retry: 1,
    };
  }
}

export function invalidateHealth(queryClient: QueryClient): Promise<void> {
  return queryClient.invalidateQueries({ queryKey: ['health'] });
}
