import { createContext, useContext, useMemo, useRef, useState, type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LoadingS } from './loading-s';
import { FilingErrorToast } from './primitives';
import { spacing } from './tokens';

export type FilingError = Readonly<{
  header: string;
  message: string;
  action?: 'TRY AGAIN' | 'DISMISS' | 'LOG OUT';
  onAction?: () => void;
  initialSeconds?: number;
}>;

export type FeedbackController = Readonly<{
  showError: (error: FilingError) => void;
  dismissError: () => void;
  showLoading: (label?: string) => void;
  hideLoading: () => void;
}>;

const FeedbackContext = createContext<FeedbackController | undefined>(undefined);

export function FeedbackProvider({ children }: { children: ReactNode }) {
  const insets = useSafeAreaInsets();
  const nextErrorKey = useRef(0);
  const [error, setError] = useState<(FilingError & { key: number }) | undefined>();
  const [loadingLabel, setLoadingLabel] = useState<string | undefined>();
  const controller = useMemo<FeedbackController>(
    () => ({
      showError: (nextError) => {
        nextErrorKey.current += 1;
        setError({ ...nextError, key: nextErrorKey.current });
      },
      dismissError: () => setError(undefined),
      showLoading: (label = 'Loading') => setLoadingLabel(label),
      hideLoading: () => setLoadingLabel(undefined),
    }),
    [],
  );

  return (
    <FeedbackContext.Provider value={controller}>
      <View style={styles.root}>
        {children}
        {loadingLabel && (
          <View pointerEvents="none" style={styles.loadingHost}>
            <LoadingS testID="global-loading" label={loadingLabel} />
          </View>
        )}
        {error && (
          <View
            pointerEvents="box-none"
            style={[styles.toastHost, { paddingTop: insets.top + spacing.sm }]}
          >
            <FilingErrorToast
              key={error.key}
              testID="global-error-toast"
              header={error.header}
              message={error.message}
              {...(error.initialSeconds === undefined
                ? {}
                : { initialSeconds: error.initialSeconds })}
              {...(error.action === undefined ? {} : { action: error.action })}
              onDismiss={() => setError(undefined)}
              onAction={() => {
                setError(undefined);
                error.onAction?.();
              }}
            />
          </View>
        )}
      </View>
    </FeedbackContext.Provider>
  );
}

export function useFeedback(): FeedbackController {
  const feedback = useContext(FeedbackContext);
  if (feedback === undefined) throw new Error('useFeedback must be used inside FeedbackProvider');
  return feedback;
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  loadingHost: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toastHost: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    paddingHorizontal: spacing.lg,
    justifyContent: 'flex-start',
  },
});
