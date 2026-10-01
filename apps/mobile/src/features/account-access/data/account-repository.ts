import type { ApiClient } from '@thinkso/api-client';
import { AccountFailure, type ThinkSoSession } from '../../../domain/account';
import type { SessionStore } from './session-store';

export interface AccountRepository {
  exchange(firebaseIdToken: string): Promise<ThinkSoSession>;
}

export class ApiAccountRepository implements AccountRepository {
  public constructor(
    private readonly client: ApiClient,
    private readonly store: SessionStore,
  ) {}

  public async exchange(firebaseIdToken: string): Promise<ThinkSoSession> {
    const result = await this.client.POST('/v1/auth/login', {
      body: { firebase_id_token: firebaseIdToken },
    });
    if (result.error) {
      const problem = readProblem(result.error);
      const code = problem?.code;
      if (code === 'profile_retired') {
        throw new AccountFailure('profileRetired', problem?.message ?? 'This profile is retired.');
      }
      if (code === 'identity_conflict') {
        throw new AccountFailure(
          'identityConflict',
          problem?.message ?? 'This identity cannot be linked automatically.',
        );
      }
      throw new AccountFailure(
        'recoverable',
        problem?.message ?? 'ThinkSo could not complete account access.',
        firebaseIdToken,
      );
    }
    const response = result.data;
    const session: ThinkSoSession = {
      accessToken: response.access_token,
      refreshToken: response.refresh_token,
      expiresIn: response.expires_in,
      user: {
        id: response.user.id,
        ...(response.user.display_name === null ? {} : { displayName: response.user.display_name }),
        retired: response.user.is_retired,
      },
      onboardingComplete: response.onboarding_complete,
    };
    await this.store.save(session);
    return session;
  }
}

function readProblem(value: unknown): { code: string; message: string } | undefined {
  if (typeof value !== 'object' || value === null || !('error' in value)) return undefined;
  const error = value.error;
  if (typeof error !== 'object' || error === null) return undefined;
  if (!('code' in error) || !('message' in error)) return undefined;
  return typeof error.code === 'string' && typeof error.message === 'string'
    ? { code: error.code, message: error.message }
    : undefined;
}
