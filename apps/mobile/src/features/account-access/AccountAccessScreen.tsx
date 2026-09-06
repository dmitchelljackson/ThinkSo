import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  AccountFormFields,
  AppDrawing,
  DocumentScreen,
  EditorialHeading,
  FilingErrorToast,
  FormHeader,
  Inline,
  LoadingS,
  Rule,
  Stack,
  ThinkSoText,
  hitSlop,
  spacing,
  useThinkSoTheme,
} from '../../design-system';
import { useAccountAccessPresenter } from './presentation/use-account-access-presenter';

export function AccountAccessScreen() {
  const state = useAccountAccessPresenter();
  const { colors } = useThinkSoTheme();
  const insets = useSafeAreaInsets();
  const registering = state.mode === 'register';
  return (
    <View style={styles.root}>
      <DocumentScreen testID="account-access-screen">
        <FormHeader
          eyebrow={registering ? 'THINKSO · NEW ACCOUNT' : 'THINKSO · ACCOUNT ACCESS'}
          reference={registering ? 'UNASSIGNED' : 'TS-000421'}
          formNumber={registering ? 'FORM 001-A' : 'FORM 001'}
        />

        {registering ? <RegisterIntroduction /> : <LoginIntroduction />}

        <View style={[styles.formCard, { borderColor: colors.rule }]}>
          {!registering && (
            <Inline gap="md">
              <View style={[styles.scales, { borderColor: colors.rule }]}>
                <AppDrawing name="legalScales" width={34} />
              </View>
              <ThinkSoText variant="label">Sign in to accept the terms</ThinkSoText>
            </Inline>
          )}
          <AccountFormFields
            mode={state.mode}
            email={state.email}
            password={state.password}
            {...(state.emailError ? { emailError: state.emailError } : {})}
            {...(state.passwordError ? { passwordError: state.passwordError } : {})}
            onEmailChange={(value) => state.onEvent({ type: 'emailChanged', value })}
            onPasswordChange={(value) => state.onEvent({ type: 'passwordChanged', value })}
            onSubmit={() => state.onEvent({ type: 'submitPressed' })}
            busy={state.busy}
            submitLabel={registering ? 'CREATE ACCOUNT' : 'LOG IN'}
            submitTestID="account-submit"
          />
          {state.formError && (
            <ThinkSoText testID="account-form-error" accessibilityRole="alert" tone="red">
              {state.formError}
            </ThinkSoText>
          )}
          {state.busy && <LoadingS testID="account-loading" label="Account access in progress" />}
          {!registering && (
            <TextAction
              label="FORGOT IT"
              disabled={state.busy}
              onPress={() => state.onEvent({ type: 'forgotPasswordPressed' })}
            />
          )}
          <Stack gap="sm" style={styles.centered}>
            <ThinkSoText variant="caption" tone="muted">
              {registering ? 'Already on file?' : 'No account on file?'}
            </ThinkSoText>
            <TextAction
              label={registering ? 'LOG IN' : 'CREATE ACCOUNT'}
              disabled={state.busy}
              onPress={() => state.onEvent({ type: 'switchModePressed' })}
            />
          </Stack>
        </View>

        <Rule />
        <ThinkSoText variant="caption" tone="muted">
          By {registering ? 'registering' : 'continuing'}, you agree to the ThinkSo
        </ThinkSoText>
        <Inline gap="lg">
          {['HOW IT WORKS', 'TERMS OF SERVICE', 'PRIVACY POLICY'].map((label) => (
            <TextAction
              key={label}
              label={label}
              disabled={state.busy}
              onPress={() => state.onEvent({ type: 'placeholderPressed' })}
            />
          ))}
        </Inline>
      </DocumentScreen>

      {state.toast && (
        <View
          pointerEvents="box-none"
          style={[styles.toast, { paddingTop: insets.top + spacing.sm }]}
        >
          <FilingErrorToast
            header={state.toast.header}
            message={state.toast.message}
            action={state.toast.action}
            onAction={() => state.onEvent({ type: 'toastActionPressed' })}
            onDismiss={() => state.onEvent({ type: 'toastDismissed' })}
          />
        </View>
      )}
    </View>
  );
}

function LoginIntroduction() {
  return (
    <Stack gap="xl">
      <Inline gap="sm" wrap={false} style={styles.wordmarkRow}>
        <AppDrawing name="marginLightning" width={34} />
        <EditorialHeading underline>ThinkSo</EditorialHeading>
        <AppDrawing name="punctuation" width={34} />
      </Inline>
      <Stack gap="xs" style={styles.centered}>
        <ThinkSoText>One of you is wrong.</ThinkSoText>
        <ThinkSoText>Write it down. We’ll call it. Keep the receipts.</ThinkSoText>
      </Stack>
      <Inline gap="lg" style={styles.partyRow}>
        <ThinkSoText variant="heading">YOU</ThinkSoText>
        <ThinkSoText variant="reference" tone="blue">
          VS
        </ThinkSoText>
        <ThinkSoText variant="heading">THEM</ThinkSoText>
      </Inline>
    </Stack>
  );
}

function RegisterIntroduction() {
  return (
    <Stack gap="lg">
      <Inline gap="md" wrap={false} style={styles.registrationHeading}>
        <View style={styles.registrationCopy}>
          <ThinkSoText variant="reference" tone="muted">
            APPLICATION FOR
          </ThinkSoText>
          <EditorialHeading underline>Standing</EditorialHeading>
        </View>
        <AppDrawing name="registrationHorn" width={118} />
      </Inline>
      <ThinkSoText tone="muted">
        Once you’re on the record, everything you agree to is on the record too.
      </ThinkSoText>
      <Inline gap="md" wrap={false}>
        <AppDrawing name="startledRegistrant" width={88} />
        <Stack gap="xs" style={styles.registrationCopy}>
          <ThinkSoText variant="annotation" tone="blue">
            you if you click this
          </ThinkSoText>
          <AppDrawing name="registrationArrow" width={120} />
        </Stack>
      </Inline>
    </Stack>
  );
}

function TextAction({
  label,
  disabled,
  onPress,
}: {
  label: string;
  disabled: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      hitSlop={hitSlop}
      onPress={onPress}
      style={({ pressed }) => [pressed && !disabled && styles.pressed, disabled && styles.disabled]}
    >
      <ThinkSoText variant="action" tone="blue">
        {label}
      </ThinkSoText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  wordmarkRow: { justifyContent: 'center' },
  partyRow: { justifyContent: 'space-around' },
  centered: { alignItems: 'center' },
  formCard: { borderWidth: 1, padding: spacing.lg, gap: spacing.lg },
  scales: { borderWidth: 1, padding: spacing.xs },
  registrationHeading: { justifyContent: 'space-between', alignItems: 'flex-start' },
  registrationCopy: { flex: 1 },
  pressed: { opacity: 0.7 },
  disabled: { opacity: 0.45 },
  toast: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    paddingHorizontal: spacing.lg,
  },
});
