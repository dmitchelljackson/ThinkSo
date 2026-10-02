import * as SecureStore from 'expo-secure-store';
import type { ThinkSoSession } from '../../../domain/account';

export interface SessionStore {
  save(session: ThinkSoSession): Promise<void>;
}

const SESSION_KEY = 'thinkso.session.v1';

export class SecureSessionStore implements SessionStore {
  public async save(session: ThinkSoSession): Promise<void> {
    await SecureStore.setItemAsync(SESSION_KEY, JSON.stringify(session), {
      keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
    });
  }
}
