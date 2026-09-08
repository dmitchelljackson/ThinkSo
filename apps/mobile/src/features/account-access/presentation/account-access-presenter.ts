import { useMutation } from '@tanstack/react-query';
import { useCallback, useRef, useState } from 'react';
import { AccountFailure, type AccountMode, type ThinkSoSession } from '../../../domain/account';
import type { AccountMutations } from '../data/account-mutations';

export type AccountAccessEvent =
  | { type: 'emailChanged'; value: string }
  | { type: 'passwordChanged'; value: string }
  | { type: 'displayNameChanged'; value: string }
  | { type: 'submitPressed' }
  | { type: 'switchModePressed' }
  | { type: 'forgotPasswordPressed' }
  | { type: 'placeholderPressed' }
  | { type: 'toastActionPressed' }
  | { type: 'toastDismissed' };

export type AccountToast = Readonly<{
  header: string;
  message: string;
  action: 'TRY AGAIN' | 'DISMISS';
  retryable: boolean;
}>;

export type AccountAccessUiState = Readonly<{
  mode: AccountMode;
  email: string;
  password: string;
  displayName: string;
  emailError?: string;
  passwordError?: string;
  displayNameError?: string;
  formError?: string;
  busy: boolean;
  toast?: AccountToast;
  onEvent: (event: AccountAccessEvent) => void;
}>;

export interface AccountAccessNavigation {
  toThreadsGate(session: ThinkSoSession): void;
}

export type AccountAccessPresenterDependencies = {
  accountMutations: AccountMutations;
  accountAccessNavigation: AccountAccessNavigation;
};

export function useAccountAccessPresenterImpl({
  accountMutations,
  accountAccessNavigation,
}: AccountAccessPresenterDependencies): AccountAccessUiState {
  const [mode, setMode] = useState<AccountMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [emailError, setEmailError] = useState<string>();
  const [passwordError, setPasswordError] = useState<string>();
  const [displayNameError, setDisplayNameError] = useState<string>();
  const [formError, setFormError] = useState<string>();
  const [toast, setToast] = useState<AccountToast>();
  const retryExchangeToken = useRef<string | undefined>(undefined);
  const inFlight = useRef(false);
  const mutation = useMutation(accountMutations.authenticate());

  const submit = useCallback(
    async (exchangeToken?: string) => {
      if (inFlight.current) return;
      const errors = validate(mode, email, password, displayName);
      setEmailError(errors.email);
      setPasswordError(errors.password);
      setDisplayNameError(errors.displayName);
      setFormError(undefined);
      setToast(undefined);
      if (errors.email || errors.password || errors.displayName) return;
      inFlight.current = true;
      try {
        const session = await mutation.mutateAsync({
          mode,
          email: email.trim(),
          password,
          ...(mode === 'register' ? { displayName: normalizeDisplayName(displayName) } : {}),
          ...(exchangeToken ? { exchangeToken } : {}),
        });
        retryExchangeToken.current = undefined;
        accountAccessNavigation.toThreadsGate(session);
      } catch (error) {
        const failure =
          error instanceof AccountFailure
            ? error
            : new AccountFailure('recoverable', 'Account access could not be completed.');
        if (failure.kind === 'invalidCredentials') {
          setFormError('Email or password is incorrect.');
          return;
        }
        retryExchangeToken.current = failure.exchangeToken;
        setToast(toastForFailure(failure));
      } finally {
        inFlight.current = false;
      }
    },
    [accountAccessNavigation, displayName, email, mode, mutation, password],
  );

  const onEvent = useCallback(
    (event: AccountAccessEvent) => {
      if (event.type === 'emailChanged') {
        setEmail(event.value);
        setEmailError(undefined);
        setFormError(undefined);
      } else if (event.type === 'passwordChanged') {
        setPassword(event.value);
        setPasswordError(undefined);
        setFormError(undefined);
      } else if (event.type === 'displayNameChanged') {
        setDisplayName(event.value);
        setDisplayNameError(undefined);
        setFormError(undefined);
      } else if (event.type === 'submitPressed') {
        void submit();
      } else if (event.type === 'switchModePressed') {
        if (mutation.isPending) return;
        setMode((value) => (value === 'login' ? 'register' : 'login'));
        setEmailError(undefined);
        setPasswordError(undefined);
        setDisplayNameError(undefined);
        setFormError(undefined);
        setToast(undefined);
        retryExchangeToken.current = undefined;
      } else if (event.type === 'forgotPasswordPressed' || event.type === 'placeholderPressed') {
        setToast({
          header: 'NOT YET IMPLEMENTED · JUST NOW',
          message: 'This feature is not yet implemented.',
          action: 'DISMISS',
          retryable: false,
        });
      } else if (event.type === 'toastActionPressed') {
        const token = retryExchangeToken.current;
        setToast(undefined);
        if (toast?.retryable) void submit(token);
      } else if (event.type === 'toastDismissed') {
        setToast(undefined);
      }
    },
    [mutation.isPending, submit, toast?.retryable],
  );

  return {
    mode,
    email,
    password,
    displayName,
    ...(emailError ? { emailError } : {}),
    ...(passwordError ? { passwordError } : {}),
    ...(displayNameError ? { displayNameError } : {}),
    ...(formError ? { formError } : {}),
    busy: mutation.isPending,
    ...(toast ? { toast } : {}),
    onEvent,
  };
}

export function validate(mode: AccountMode, email: string, password: string, displayName = '') {
  const normalized = email.trim();
  const emailError = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)
    ? undefined
    : 'Enter a valid email address.';
  const passwordError =
    password.length === 0
      ? 'Enter your password.'
      : mode === 'register' && password.length < 8
        ? 'Use at least eight characters.'
        : undefined;
  const normalizedDisplayName = normalizeDisplayName(displayName);
  const displayNameError =
    mode !== 'register'
      ? undefined
      : normalizedDisplayName.length === 0
        ? 'Enter your name for the record.'
        : normalizedDisplayName.length > 80
          ? 'Use 80 characters or fewer.'
          : undefined;
  return { email: emailError, password: passwordError, displayName: displayNameError };
}

function normalizeDisplayName(displayName: string) {
  return displayName.trim().replace(/\s+/g, ' ');
}

function toastForFailure(failure: AccountFailure): AccountToast {
  if (failure.kind === 'profileRetired') {
    return {
      header: 'PROFILE RETIRED · JUST NOW',
      message: 'This profile was permanently retired and cannot be used again.',
      action: 'DISMISS',
      retryable: false,
    };
  }
  if (failure.kind === 'identityConflict') {
    return {
      header: 'ACCOUNT ERROR · JUST NOW',
      message: 'This identity cannot be linked automatically.',
      action: 'DISMISS',
      retryable: false,
    };
  }
  return {
    header: 'ACCOUNT ERROR · JUST NOW',
    message: failure.message,
    action: 'TRY AGAIN',
    retryable: true,
  };
}
