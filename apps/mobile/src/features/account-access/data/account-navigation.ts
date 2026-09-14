import { router } from 'expo-router';
import type { ThinkSoSession } from '../../../domain/account';
import type { AccountAccessNavigation } from '../presentation/account-access-presenter';

export class ExpoAccountAccessNavigation implements AccountAccessNavigation {
  public toThreadsGate(_session: ThinkSoSession): void {
    router.replace('/connect-threads');
  }
}
