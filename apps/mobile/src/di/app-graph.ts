import { createApiClient } from '@thinkso/api-client';
import { QueryClient } from '@tanstack/react-query';
import { graph, ObjectGraph, provides } from 'react-obsidian';
import { Platform } from 'react-native';

import { DefaultHealthQueries } from '../features/health/data/health-queries';
import type { HealthQueries } from '../features/health/data/health-queries';
import { ApiHealthRepository } from '../features/health/data/health-repository';

export function apiBaseUrl(platform: typeof Platform.OS = Platform.OS): string {
  return (
    process.env.EXPO_PUBLIC_API_URL ??
    (platform === 'android' ? 'http://10.0.2.2:8000' : 'http://localhost:8000')
  );
}

@graph()
export class AppGraph extends ObjectGraph {
  @provides({ name: 'queryClient' })
  public queryClient(): QueryClient {
    return new QueryClient({ defaultOptions: { queries: { refetchOnWindowFocus: false } } });
  }

  @provides({ name: 'healthQueries' })
  public healthQueries(): HealthQueries {
    const transport = createApiClient(apiBaseUrl());
    return new DefaultHealthQueries(new ApiHealthRepository(transport));
  }
}
