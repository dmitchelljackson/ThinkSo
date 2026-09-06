import Constants from 'expo-constants';
import { FirebaseError, initializeApp, getApp, getApps, type FirebaseOptions } from 'firebase/app';
import {
  connectAuthEmulator,
  createUserWithEmailAndPassword,
  getAuth,
  inMemoryPersistence,
  initializeAuth,
  signInWithEmailAndPassword,
  type Auth,
} from 'firebase/auth';
import { AccountFailure } from '../../../domain/account';

export interface FirebaseAuthGateway {
  signIn(email: string, password: string): Promise<string>;
  register(email: string, password: string): Promise<string>;
}

type Extra = {
  firebase?: FirebaseOptions;
  firebaseAuthEmulatorHost?: string;
};

const emulatorConnected = new WeakSet<Auth>();

export class FirebaseWebAuthGateway implements FirebaseAuthGateway {
  private readonly auth: Auth;

  public constructor(extra: Extra = (Constants.expoConfig?.extra ?? {}) as Extra) {
    if (!extra.firebase) throw new Error('Firebase client configuration is unavailable');
    const appAlreadyExists = getApps().length > 0;
    const app = appAlreadyExists ? getApp() : initializeApp(extra.firebase);
    this.auth = appAlreadyExists
      ? getAuth(app)
      : initializeAuth(app, { persistence: inMemoryPersistence });
    if (extra.firebaseAuthEmulatorHost && !emulatorConnected.has(this.auth)) {
      connectAuthEmulator(this.auth, `http://${extra.firebaseAuthEmulatorHost}`, {
        disableWarnings: true,
      });
      emulatorConnected.add(this.auth);
    }
  }

  public async signIn(email: string, password: string): Promise<string> {
    try {
      const credential = await signInWithEmailAndPassword(this.auth, email, password);
      return credential.user.getIdToken(true);
    } catch (error) {
      throw mapFirebaseError(error, true);
    }
  }

  public async register(email: string, password: string): Promise<string> {
    try {
      const credential = await createUserWithEmailAndPassword(this.auth, email, password);
      return credential.user.getIdToken(true);
    } catch (error) {
      throw mapFirebaseError(error, false);
    }
  }
}

function mapFirebaseError(error: unknown, signingIn: boolean): AccountFailure {
  if (error instanceof FirebaseError) {
    if (
      signingIn &&
      ['auth/invalid-credential', 'auth/user-not-found', 'auth/wrong-password'].includes(error.code)
    ) {
      return new AccountFailure('invalidCredentials', 'Email or password is incorrect.');
    }
    if (error.code === 'auth/too-many-requests') {
      return new AccountFailure('recoverable', 'Too many attempts. Try again in a little while.');
    }
  }
  return new AccountFailure('recoverable', 'Account access could not be completed.');
}
