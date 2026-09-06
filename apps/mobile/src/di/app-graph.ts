import { createApiClient } from '@thinkso/api-client';
import { QueryClient } from '@tanstack/react-query';
import { graph, ObjectGraph, provides } from 'react-obsidian';
import { Platform } from 'react-native';

import { ApiAccountRepository } from '../features/account-access/data/account-repository';
import {
  DefaultAccountMutations,
  type AccountMutations,
} from '../features/account-access/data/account-mutations';
import { FirebaseWebAuthGateway } from '../features/account-access/data/firebase-auth-gateway';
import { ExpoAccountAccessNavigation } from '../features/account-access/data/account-navigation';
import { SecureSessionStore } from '../features/account-access/data/session-store';
import type { AccountAccessNavigation } from '../features/account-access/presentation/account-access-presenter';
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

  @provides({ name: 'accountMutations' })
  public accountMutations(): AccountMutations {
    const transport = createApiClient(apiBaseUrl());
    return new DefaultAccountMutations(
      new FirebaseWebAuthGateway(),
      new ApiAccountRepository(transport, new SecureSessionStore()),
    );
  }

  @provides({ name: 'accountAccessNavigation' })
  public accountAccessNavigation(): AccountAccessNavigation {
    return new ExpoAccountAccessNavigation();
  }
}
