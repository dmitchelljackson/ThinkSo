import { Pressable, StyleSheet, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  AccountFormFields,
  ActionButton,
  AppDrawing,
  DocumentScreen,
  EditorialHeading,
  FilingErrorToast,
  FormHeader,
  LoadingS,
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
  const { height } = useWindowDimensions();
  const registering = state.mode === 'register';
  const allowScroll = accountAccessAllowsScroll(height);

  return (
    <View style={styles.root}>
      <DocumentScreen
        testID="account-access-screen"
        scroll={allowScroll}
        contentContainerStyle={[
          styles.document,
          { paddingBottom: Math.max(spacing.sm, insets.bottom + spacing.xs) },
        ]}
      >
        <FormHeader
          eyebrow={registering ? 'THINKSO · NEW ACCOUNT' : 'THINKSO · ACCOUNT ACCESS'}
          reference={registering ? 'UNASSIGNED' : 'TS-000421'}
          formNumber={registering ? 'FORM 001-A' : 'FORM 001'}
        />

        {registering ? (
          <RegisterContent state={state} />
        ) : (
          <LoginContent state={state} colors={colors} />
        )}

        <AccountFooter
          registering={registering}
          busy={state.busy}
          onPlaceholder={() => state.onEvent({ type: 'placeholderPressed' })}
        />
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

export function accountAccessAllowsScroll(height: number) {
  return height < 760;
}

type PresenterState = ReturnType<typeof useAccountAccessPresenter>;

function LoginContent({
  state,
  colors,
}: {
  state: PresenterState;
  colors: ReturnType<typeof useThinkSoTheme>['colors'];
}) {
  return (
    <>
      <View style={styles.loginHero}>
        <View style={styles.lightning}>
          <AppDrawing name="marginLightning" width={38} />
        </View>
        <View style={styles.accessStar}>
          <AppDrawing name="accessStar" width={48} />
        </View>
        <View style={styles.wordmark}>
          <View style={styles.wordmarkLabel}>
            <ThinkSoText style={styles.wordmarkText}>ThinkSo</ThinkSoText>
            <View style={styles.wordmarkUnderline}>
              <AppDrawing name="doubleUnderline" width={190} />
            </View>
          </View>
          <View style={styles.punctuation}>
            <AppDrawing name="punctuation" width={34} />
          </View>
        </View>
      </View>

      <View style={[styles.parties, { borderTopColor: colors.rule }]}>
        <Party label="YOU" caption="FIRST PARTY" colors={colors} />
        <ThinkSoText variant="reference" tone="blue" style={styles.vs}>
          VS
        </ThinkSoText>
        <Party label="THEM" caption="SECOND PARTY" colors={colors} />
      </View>

      <View style={styles.loginStatement}>
        <View style={styles.skull}>
          <AppDrawing name="skullAndCrossbones" width={48} />
        </View>
        <View style={styles.angryFace}>
          <AppDrawing name="angryFace" width={42} />
        </View>
        <ThinkSoText>One of you is wrong.</ThinkSoText>
        <ThinkSoText style={styles.statementCopy}>Write it down. We’ll call it.</ThinkSoText>
        <View style={styles.receiptsPhrase}>
          <ThinkSoText>Keep the receipts.</ThinkSoText>
          <View style={styles.receiptsUnderline}>
            <AppDrawing name="doubleUnderline" width={128} />
          </View>
        </View>
      </View>

      <View style={styles.noBackingOut}>
        <View style={styles.noBackingLabel}>
          <ThinkSoText variant="annotation" tone="blue" style={styles.noBackingText}>
            no backing out
          </ThinkSoText>
          <AppDrawing name="doubleUnderline" width={110} />
        </View>
        <AppDrawing name="noBackingOutArrow" width={43} />
        <AppDrawing name="flame" width={28} />
      </View>

      <View style={[styles.loginFormCard, { borderColor: colors.rule }]}>
        {state.busy && (
          <View style={styles.loginLoading}>
            <LoadingS testID="account-loading" label="Account access in progress" size={20} />
          </View>
        )}
        <View style={styles.formLead}>
          <View style={[styles.scales, { borderColor: colors.rule }]}>
            <AppDrawing name="legalScales" width={32} />
          </View>
          <ThinkSoText variant="label">Sign in to accept the terms</ThinkSoText>
        </View>
        <AccountFormFields
          mode={state.mode}
          email={state.email}
          password={state.password}
          {...(state.emailError ? { emailError: state.emailError } : {})}
          {...(state.passwordError ? { passwordError: state.passwordError } : {})}
          onEmailChange={(value) => state.onEvent({ type: 'emailChanged', value })}
          onPasswordChange={(value) => state.onEvent({ type: 'passwordChanged', value })}
          onForgotPassword={() => state.onEvent({ type: 'forgotPasswordPressed' })}
          onSubmit={() => state.onEvent({ type: 'submitPressed' })}
          busy={state.busy}
          submitLabel="LOG IN"
          submitTestID="account-submit"
        />
        {state.formError && (
          <ThinkSoText testID="account-form-error" accessibilityRole="alert" tone="red">
            {state.formError}
          </ThinkSoText>
        )}
        <View style={styles.modeSwitch}>
          <ThinkSoText variant="caption" tone="muted">
            No account on file?
          </ThinkSoText>
          <TextAction
            label="CREATE ACCOUNT"
            disabled={state.busy}
            tone="muted"
            onPress={() => state.onEvent({ type: 'switchModePressed' })}
          />
        </View>
      </View>
    </>
  );
}

function RegisterContent({ state }: { state: PresenterState }) {
  const { colors } = useThinkSoTheme();
  return (
    <>
      <View style={styles.registrationIntro}>
        <ThinkSoText variant="reference" tone="muted">
          APPLICATION FOR
        </ThinkSoText>
        <EditorialHeading underline>Standing</EditorialHeading>
        <ThinkSoText tone="muted" style={styles.registrationCopy}>
          Once you’re on the record, everything you agree to is on the record too.
        </ThinkSoText>
        <View style={styles.registrationHorn}>
          <AppDrawing name="registrationHorn" width={120} />
        </View>
      </View>

      <View style={[styles.registrationFields, { borderColor: colors.rule }]}>
        <AccountFormFields
          mode={state.mode}
          displayName={state.displayName}
          email={state.email}
          password={state.password}
          {...(state.displayNameError ? { displayNameError: state.displayNameError } : {})}
          {...(state.emailError ? { emailError: state.emailError } : {})}
          {...(state.passwordError ? { passwordError: state.passwordError } : {})}
          onDisplayNameChange={(value) => state.onEvent({ type: 'displayNameChanged', value })}
          onEmailChange={(value) => state.onEvent({ type: 'emailChanged', value })}
          onPasswordChange={(value) => state.onEvent({ type: 'passwordChanged', value })}
          onSubmit={() => state.onEvent({ type: 'submitPressed' })}
          busy={state.busy}
          showSubmit={false}
          submitLabel="CREATE ACCOUNT"
        />
        {state.formError && (
          <ThinkSoText testID="account-form-error" accessibilityRole="alert" tone="red">
            {state.formError}
          </ThinkSoText>
        )}
      </View>

      <View style={styles.registrationIllustration}>
        <AppDrawing name="startledRegistrant" width={112} />
        <View style={styles.registrationAnnotation}>
          <ThinkSoText variant="annotation" tone="blue" style={styles.youIfClick}>
            you if you{`\n`}click this
          </ThinkSoText>
          <AppDrawing name="registrationArrow" width={142} />
        </View>
      </View>

      <View style={styles.registrationAction}>
        {state.busy && (
          <View style={styles.registrationLoading}>
            <LoadingS testID="account-loading" label="Account access in progress" size={20} />
          </View>
        )}
        <ActionButton
          testID="account-submit"
          disabled={state.busy}
          onPress={() => state.onEvent({ type: 'submitPressed' })}
        >
          CREATE ACCOUNT
        </ActionButton>
        <View style={styles.modeSwitch}>
          <ThinkSoText variant="caption" tone="muted">
            Already on file?
          </ThinkSoText>
          <TextAction
            label="LOG IN"
            disabled={state.busy}
            tone="muted"
            onPress={() => state.onEvent({ type: 'switchModePressed' })}
          />
        </View>
      </View>
    </>
  );
}

function Party({
  label,
  caption,
  colors,
}: {
  label: string;
  caption: string;
  colors: ReturnType<typeof useThinkSoTheme>['colors'];
}) {
  return (
    <View style={styles.party}>
      <ThinkSoText variant="heading" style={styles.partyName}>
        {label}
      </ThinkSoText>
      <View style={[styles.partyRule, { borderColor: colors.mutedInk }]} />
      <ThinkSoText variant="reference" tone="muted" style={styles.partyCaption}>
        {caption}
      </ThinkSoText>
    </View>
  );
}

function AccountFooter({
  registering,
  busy,
  onPlaceholder,
}: {
  registering: boolean;
  busy: boolean;
  onPlaceholder: () => void;
}) {
  const { colors } = useThinkSoTheme();
  return (
    <View style={[styles.footer, { borderTopColor: colors.rule }]}>
      {!registering && (
        <View style={styles.footerPen}>
          <AppDrawing name="penAndBurst" width={34} />
        </View>
      )}
      <ThinkSoText variant="caption" tone="muted" style={styles.footerCaption}>
        By {registering ? 'registering' : 'continuing'}, you agree to the ThinkSo
      </ThinkSoText>
      <View style={styles.footerLinks}>
        {['TERMS OF SERVICE', 'PRIVACY POLICY'].map((label) => (
          <TextAction key={label} label={label} disabled={busy} compact onPress={onPlaceholder} />
        ))}
      </View>
    </View>
  );
}

function TextAction({
  label,
  disabled,
  compact = false,
  tone = 'blue',
  onPress,
}: {
  label: string;
  disabled: boolean;
  compact?: boolean;
  tone?: 'blue' | 'muted';
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
      <ThinkSoText
        variant="action"
        tone={tone === 'blue' ? 'blue' : 'muted'}
        style={compact ? styles.compactAction : undefined}
      >
        {label}
      </ThinkSoText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  document: { flexGrow: 1, gap: 0 },
  loginHero: {
    minHeight: 102,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  wordmark: { position: 'relative', flexDirection: 'row', alignItems: 'flex-start' },
  wordmarkLabel: { position: 'relative', alignItems: 'center' },
  wordmarkText: {
    fontFamily: 'Spectral_400Regular',
    fontSize: 56,
    lineHeight: 70,
    letterSpacing: -0.8,
    paddingTop: 2,
    includeFontPadding: true,
  },
  wordmarkUnderline: { position: 'absolute', bottom: -8 },
  lightning: { position: 'absolute', left: 0, bottom: 4, transform: [{ rotate: '-6deg' }] },
  punctuation: { marginTop: -2, marginLeft: 3 },
  accessStar: { position: 'absolute', right: -6, top: 7 },
  parties: {
    minHeight: 76,
    borderTopWidth: 1,
    paddingTop: 14,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  party: { flex: 1, alignItems: 'center', gap: 4 },
  partyName: { fontFamily: 'CourierPrime_700Bold', fontSize: 21, lineHeight: 26 },
  partyRule: { width: '100%', height: 1, borderBottomWidth: 1, borderStyle: 'dashed' },
  partyCaption: { fontSize: 8, lineHeight: 12, letterSpacing: 1.1 },
  vs: { paddingTop: 14 },
  loginStatement: {
    minHeight: 96,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  statementCopy: { textAlign: 'center' },
  skull: { position: 'absolute', left: -9, top: 10, transform: [{ rotate: '-8deg' }] },
  angryFace: { position: 'absolute', right: -5, top: 9, transform: [{ rotate: '5deg' }] },
  receiptsPhrase: { position: 'relative', alignItems: 'center' },
  receiptsUnderline: { position: 'absolute', bottom: -8 },
  noBackingOut: {
    flexGrow: 1,
    minHeight: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    transform: [{ rotate: '-3deg' }],
  },
  noBackingLabel: { alignItems: 'center' },
  noBackingText: { fontSize: 13, lineHeight: 18 },
  loginFormCard: {
    position: 'relative',
    borderWidth: 1,
    padding: 14,
    gap: 10,
  },
  formLead: { minHeight: 34, flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  scales: { borderWidth: 1, padding: 3 },
  loginLoading: { position: 'absolute', right: 2, top: -40 },
  modeSwitch: { alignItems: 'center', gap: 6 },
  registrationIntro: {
    minHeight: 140,
    position: 'relative',
    justifyContent: 'center',
    gap: 6,
  },
  registrationCopy: { maxWidth: '78%', marginTop: spacing.sm },
  registrationHorn: { position: 'absolute', right: -4, top: 5, transform: [{ rotate: '-4deg' }] },
  registrationFields: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    paddingVertical: 14,
  },
  registrationIllustration: {
    flexGrow: 1,
    minHeight: 126,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  registrationAnnotation: { flex: 1, alignItems: 'center' },
  youIfClick: { alignSelf: 'flex-start', transform: [{ rotate: '-2deg' }] },
  registrationAction: { position: 'relative', gap: 10 },
  registrationLoading: { position: 'absolute', right: 2, top: -43 },
  footer: {
    minHeight: 44,
    position: 'relative',
    borderTopWidth: 1,
    marginTop: spacing.sm,
    paddingTop: 6,
    gap: 2,
  },
  footerCaption: { fontSize: 9, lineHeight: 12 },
  footerLinks: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, flexWrap: 'wrap' },
  footerPen: { position: 'absolute', right: 2, bottom: 0, transform: [{ rotate: '4deg' }] },
  compactAction: { fontSize: 9, lineHeight: 12, letterSpacing: 1.2 },
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
