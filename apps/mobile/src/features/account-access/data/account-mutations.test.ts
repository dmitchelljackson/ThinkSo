import { AccountFailure, type ThinkSoSession } from '../../../domain/account';
import { DefaultAccountMutations } from './account-mutations';

const session: ThinkSoSession = {
  accessToken: 'access',
  refreshToken: 'refresh',
  expiresIn: 86400,
  user: { id: 'user', retired: false },
  onboardingComplete: false,
};

describe('account access mutation boundary', () => {
  it('authenticates with Firebase then exchanges with ThinkSo', async () => {
    const firebase = { signIn: jest.fn(async () => 'firebase-token'), register: jest.fn() };
    const repository = { exchange: jest.fn(async () => session) };
    const mutation = new DefaultAccountMutations(firebase, repository).authenticate();
    await expect(
      mutation.mutationFn?.(
        { mode: 'login', email: 'a@b.com', password: 'password' } as never,
        {} as never,
      ),
    ).resolves.toEqual(session);
    expect(firebase.signIn).toHaveBeenCalledWith('a@b.com', 'password');
    expect(repository.exchange).toHaveBeenCalledWith('firebase-token');
  });

  it('registers with Firebase then exchanges exactly once', async () => {
    const firebase = { signIn: jest.fn(), register: jest.fn(async () => 'firebase-token') };
    const repository = { exchange: jest.fn(async () => session) };
    const mutation = new DefaultAccountMutations(firebase, repository).authenticate();
    await mutation.mutationFn?.(
      { mode: 'register', email: 'a@b.com', password: 'password' } as never,
      {} as never,
    );
    expect(firebase.register).toHaveBeenCalledTimes(1);
    expect(repository.exchange).toHaveBeenCalledTimes(1);
    expect(repository.exchange).toHaveBeenCalledWith('firebase-token');
  });

  it('retries a failed exchange without calling Firebase again', async () => {
    const firebase = { signIn: jest.fn(), register: jest.fn() };
    const repository = { exchange: jest.fn(async () => session) };
    const mutation = new DefaultAccountMutations(firebase, repository).authenticate();
    await mutation.mutationFn?.(
      {
        mode: 'login',
        email: 'a@b.com',
        password: 'password',
        exchangeToken: 'retained-token',
      } as never,
      {} as never,
    );
    expect(firebase.signIn).not.toHaveBeenCalled();
    expect(repository.exchange).toHaveBeenCalledWith('retained-token');
  });

  it('attaches the Firebase token only to recoverable exchange failures', async () => {
    const firebase = { signIn: jest.fn(async () => 'firebase-token'), register: jest.fn() };
    const repository = {
      exchange: jest.fn(async () => {
        throw new AccountFailure('recoverable', 'offline');
      }),
    };
    const mutation = new DefaultAccountMutations(firebase, repository).authenticate();
    await expect(
      mutation.mutationFn?.(
        { mode: 'login', email: 'a@b.com', password: 'password' } as never,
        {} as never,
      ),
    ).rejects.toMatchObject({ kind: 'recoverable', exchangeToken: 'firebase-token' });
  });
});
