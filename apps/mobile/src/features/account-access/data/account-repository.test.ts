import type { ApiClient } from '@thinkso/api-client';
import { ApiAccountRepository } from './account-repository';

const response = {
  access_token: 'access',
  refresh_token: 'refresh',
  expires_in: 86400,
  user: {
    id: '00000000-0000-0000-0000-000000000001',
    display_name: null,
    is_retired: false,
    social_identity: null,
  },
  onboarding_complete: false,
};

describe('account repository', () => {
  it('maps the wire response and persists both ThinkSo credentials', async () => {
    const POST = jest.fn(async () => ({ data: response }));
    const save = jest.fn(async () => undefined);
    const repository = new ApiAccountRepository({ POST } as unknown as ApiClient, { save });
    const session = await repository.exchange('firebase-token');
    expect(POST).toHaveBeenCalledWith('/v1/auth/login', {
      body: { firebase_id_token: 'firebase-token' },
    });
    expect(session.accessToken).toBe('access');
    expect(session.refreshToken).toBe('refresh');
    expect(save).toHaveBeenCalledWith(session);
  });

  it.each([
    ['profile_retired', 'profileRetired'],
    ['identity_conflict', 'identityConflict'],
  ] as const)('maps %s to a non-retryable domain failure', async (code, kind) => {
    const client = {
      POST: jest.fn(async () => ({
        error: { error: { code, message: 'safe message', details: {} } },
      })),
    } as unknown as ApiClient;
    const repository = new ApiAccountRepository(client, { save: jest.fn() });
    await expect(repository.exchange('firebase-token')).rejects.toMatchObject({
      kind,
      exchangeToken: undefined,
    });
  });
});
