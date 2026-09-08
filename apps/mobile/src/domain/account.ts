export type AccountMode = 'login' | 'register';

export type ThinkSoUser = Readonly<{
  id: string;
  displayName?: string;
  retired: boolean;
}>;

export type ThinkSoSession = Readonly<{
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: ThinkSoUser;
  onboardingComplete: boolean;
}>;

export type AccountFailureKind =
  | 'invalidCredentials'
  | 'profileRetired'
  | 'identityConflict'
  | 'recoverable';

export class AccountFailure extends Error {
  public constructor(
    public readonly kind: AccountFailureKind,
    message: string,
    public readonly exchangeToken?: string,
  ) {
    super(message);
  }
}
