import { act, renderHook, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider, type UseMutationOptions } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { AccountFailure, type ThinkSoSession } from '../../../domain/account';
import type { AccountCommand, AccountMutations } from '../data/account-mutations';
import {
  useAccountAccessPresenterImpl,
  validate,
  type AccountAccessNavigation,
} from './account-access-presenter';

const session: ThinkSoSession = {
  accessToken: 'access',
  refreshToken: 'refresh',
  expiresIn: 86400,
  user: { id: 'user', retired: false },
  onboardingComplete: false,
};

function harness(mutationFn: (command: AccountCommand) => Promise<ThinkSoSession>) {
  const navigate = jest.fn();
  const accountMutations: AccountMutations = {
    authenticate: () =>
      ({ mutationFn, retry: false }) as UseMutationOptions<
        ThinkSoSession,
        AccountFailure,
        AccountCommand
      >,
  };
  const navigation: AccountAccessNavigation = { toThreadsGate: navigate };
  const client = new QueryClient({
    defaultOptions: { mutations: { retry: false, gcTime: Number.POSITIVE_INFINITY } },
  });
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
  return { accountMutations, accountAccessNavigation: navigation, navigate, wrapper };
}

describe('account access presenter', () => {
  it('validates without starting Firebase work', async () => {
    const authenticate = jest.fn(async () => session);
    const dependencies = harness(authenticate);
    const rendered = await renderHook(() => useAccountAccessPresenterImpl(dependencies), {
      wrapper: dependencies.wrapper,
    });
    await act(async () => rendered.result.current.onEvent({ type: 'submitPressed' }));
    expect(authenticate).not.toHaveBeenCalled();
    expect(rendered.result.current.emailError).toBe('Enter a valid email address.');
    expect(rendered.result.current.passwordError).toBe('Enter your password.');
  });

  it('allows exactly one active submission and routes after success', async () => {
    let resolve: ((value: ThinkSoSession) => void) | undefined;
    const authenticate = jest.fn(() => new Promise<ThinkSoSession>((done) => (resolve = done)));
    const dependencies = harness(authenticate);
    const rendered = await renderHook(() => useAccountAccessPresenterImpl(dependencies), {
      wrapper: dependencies.wrapper,
    });
    await act(async () => {
      rendered.result.current.onEvent({ type: 'emailChanged', value: 'user@example.com' });
      rendered.result.current.onEvent({ type: 'passwordChanged', value: 'password' });
    });
    await act(async () => {
      rendered.result.current.onEvent({ type: 'submitPressed' });
      rendered.result.current.onEvent({ type: 'submitPressed' });
    });
    expect(authenticate).toHaveBeenCalledTimes(1);
    await act(async () => resolve?.(session));
    await waitFor(() => expect(dependencies.navigate).toHaveBeenCalledWith(session));
  });

  it('shows generic invalid credentials without a filing toast', async () => {
    const dependencies = harness(async () => {
      throw new AccountFailure('invalidCredentials', 'provider detail');
    });
    const rendered = await renderHook(() => useAccountAccessPresenterImpl(dependencies), {
      wrapper: dependencies.wrapper,
    });
    await act(async () => {
      rendered.result.current.onEvent({ type: 'emailChanged', value: 'user@example.com' });
      rendered.result.current.onEvent({ type: 'passwordChanged', value: 'password' });
    });
    await act(async () => rendered.result.current.onEvent({ type: 'submitPressed' }));
    await waitFor(() =>
      expect(rendered.result.current.formError).toBe('Email or password is incorrect.'),
    );
    expect(rendered.result.current.toast).toBeUndefined();
  });

  it('retains only the failed exchange for a retry', async () => {
    const commands: AccountCommand[] = [];
    const dependencies = harness(async (command) => {
      commands.push(command);
      if (commands.length === 1) {
        throw new AccountFailure('recoverable', 'Backend unavailable.', 'firebase-id-token');
      }
      return session;
    });
    const rendered = await renderHook(() => useAccountAccessPresenterImpl(dependencies), {
      wrapper: dependencies.wrapper,
    });
    await act(async () => {
      rendered.result.current.onEvent({ type: 'emailChanged', value: 'user@example.com' });
      rendered.result.current.onEvent({ type: 'passwordChanged', value: 'password' });
    });
    await act(async () => rendered.result.current.onEvent({ type: 'submitPressed' }));
    await waitFor(() => expect(rendered.result.current.toast?.action).toBe('TRY AGAIN'));
    await act(async () => rendered.result.current.onEvent({ type: 'toastActionPressed' }));
    await waitFor(() => expect(dependencies.navigate).toHaveBeenCalled());
    expect(commands[1]?.exchangeToken).toBe('firebase-id-token');
  });

  it('shows a retired profile as a non-retryable dismissal', async () => {
    const authenticate = jest.fn(async () => {
      throw new AccountFailure('profileRetired', 'provider detail');
    });
    const dependencies = harness(authenticate);
    const rendered = await renderHook(() => useAccountAccessPresenterImpl(dependencies), {
      wrapper: dependencies.wrapper,
    });
    await act(async () => {
      rendered.result.current.onEvent({ type: 'emailChanged', value: 'user@example.com' });
      rendered.result.current.onEvent({ type: 'passwordChanged', value: 'password' });
    });
    await act(async () => rendered.result.current.onEvent({ type: 'submitPressed' }));
    await waitFor(() => expect(rendered.result.current.toast?.header).toContain('PROFILE RETIRED'));
    expect(rendered.result.current.toast?.action).toBe('DISMISS');
    await act(async () => rendered.result.current.onEvent({ type: 'toastActionPressed' }));
    expect(authenticate).toHaveBeenCalledTimes(1);
    expect(rendered.result.current.toast).toBeUndefined();
  });

  it('enforces the registration password minimum', () => {
    expect(validate('register', 'user@example.com', 'short').password).toBeDefined();
    expect(validate('register', 'user@example.com', 'long-enough').password).toBeUndefined();
  });

  it('switches to registration locally without starting account work', async () => {
    const authenticate = jest.fn(async () => session);
    const dependencies = harness(authenticate);
    const rendered = await renderHook(() => useAccountAccessPresenterImpl(dependencies), {
      wrapper: dependencies.wrapper,
    });
    await act(async () => rendered.result.current.onEvent({ type: 'switchModePressed' }));
    expect(rendered.result.current.mode).toBe('register');
    expect(authenticate).not.toHaveBeenCalled();
  });
});
