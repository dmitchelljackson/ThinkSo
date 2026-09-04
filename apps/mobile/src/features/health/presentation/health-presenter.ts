import { useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { HealthQueries } from '../data/health-queries';

export type HealthEvent = { type: 'refreshPressed' };

export type HealthUiState =
  | Readonly<{ type: 'loading'; onEvent: (event: HealthEvent) => void }>
  | Readonly<{
      type: 'ready';
      label: string;
      checkedAt: string;
      onEvent: (event: HealthEvent) => void;
    }>
  | Readonly<{ type: 'error'; message: string; onEvent: (event: HealthEvent) => void }>;

export type HealthPresenterDependencies = { healthQueries: HealthQueries };

export function useHealthPresenterImpl({
  healthQueries,
}: HealthPresenterDependencies): HealthUiState {
  const query = useQuery(healthQueries.health());
  const onEvent = useCallback(
    (event: HealthEvent) => {
      if (event.type === 'refreshPressed') void query.refetch();
    },
    [query],
  );

  if (query.isPending) return { type: 'loading', onEvent };
  if (query.isError || query.data === undefined) {
    return { type: 'error', message: 'Health is unavailable', onEvent };
  }
  return {
    type: 'ready',
    label: `${query.data.service} is ${query.data.status}`,
    checkedAt: query.data.checkedAt.toISOString(),
    onEvent,
  };
}
