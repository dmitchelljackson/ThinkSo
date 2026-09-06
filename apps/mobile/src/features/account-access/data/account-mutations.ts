import type { UseMutationOptions } from '@tanstack/react-query';
import { AccountFailure, type AccountMode, type ThinkSoSession } from '../../../domain/account';
import type { AccountRepository } from './account-repository';
import type { FirebaseAuthGateway } from './firebase-auth-gateway';

export type AccountCommand = Readonly<{
  mode: AccountMode;
  email: string;
  password: string;
  exchangeToken?: string;
}>;

export interface AccountMutations {
  authenticate(): UseMutationOptions<ThinkSoSession, AccountFailure, AccountCommand>;
}

export class DefaultAccountMutations implements AccountMutations {
  public constructor(
    private readonly firebase: FirebaseAuthGateway,
    private readonly repository: AccountRepository,
  ) {}

  public authenticate(): UseMutationOptions<ThinkSoSession, AccountFailure, AccountCommand> {
    return {
      mutationKey: ['account-access'],
      mutationFn: async (command) => {
        const firebaseIdToken =
          command.exchangeToken ??
          (command.mode === 'login'
            ? await this.firebase.signIn(command.email, command.password)
            : await this.firebase.register(command.email, command.password));
        try {
          return await this.repository.exchange(firebaseIdToken);
        } catch (error) {
          if (error instanceof AccountFailure && error.kind === 'recoverable') {
            throw new AccountFailure(error.kind, error.message, firebaseIdToken);
          }
          throw error;
        }
      },
      retry: false,
      gcTime: 0,
    };
  }
}
