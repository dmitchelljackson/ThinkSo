import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  PanResponder,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  type GestureResponderEvent,
  type StyleProp,
  type TextProps,
  type TextInputProps,
  type TextStyle,
  type ViewProps,
  type ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { LoadingS } from './loading-s';
import { lightTheme, useThinkSoTheme, type ThemeColors } from './theme';
import {
  hitSlop,
  radii,
  sizes,
  spacing,
  textStyles,
  type SpacingToken,
  type TextRole,
} from './tokens';

type TextTone = 'default' | 'muted' | 'blue' | 'red' | 'green' | 'inverse';

export function ThinkSoText({
  variant = 'body',
  tone = 'default',
  style,
  ...props
}: TextProps & { variant?: TextRole; tone?: TextTone }) {
  const { colors } = useThinkSoTheme();
  return (
    <Text {...props} style={[textStyles[variant], { color: textToneColor(colors, tone) }, style]} />
  );
}

export function Stack({
  children,
  gap = 'lg',
  style,
  ...props
}: ViewProps & {
  gap?: SpacingToken;
}) {
  return (
    <View {...props} style={[{ gap: spacing[gap] }, style]}>
      {children}
    </View>
  );
}

export function Inline({
  children,
  gap = 'sm',
  wrap = true,
  style,
  ...props
}: ViewProps & {
  gap?: SpacingToken;
  wrap?: boolean;
}) {
  return (
    <View
      {...props}
      style={[
        { flexDirection: 'row', alignItems: 'center', gap: spacing[gap] },
        wrap && { flexWrap: 'wrap' },
        style,
      ]}
    >
      {children}
    </View>
  );
}

export function Spacer({ size = 'lg', style, ...props }: ViewProps & { size?: SpacingToken }) {
  return (
    <View {...props} aria-hidden style={[{ width: spacing[size], height: spacing[size] }, style]} />
  );
}

export function DocumentScreen({
  children,
  scroll = true,
  marginRule = true,
  testID,
  contentContainerStyle,
}: {
  children: ReactNode;
  scroll?: boolean;
  marginRule?: boolean;
  testID?: string;
  contentContainerStyle?: StyleProp<ViewStyle>;
}) {
  const insets = useSafeAreaInsets();
  const styles = usePrimitiveStyles();
  const content = (
    <View
      style={[
        styles.documentContent,
        marginRule && styles.marginRule,
        {
          paddingTop: Math.max(spacing.xl, insets.top + spacing.md),
          paddingBottom: Math.max(spacing.xl, insets.bottom + spacing.lg),
        },
        contentContainerStyle,
      ]}
    >
      {children}
    </View>
  );
  return (
    <View style={styles.canvas} testID={testID}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.centerColumn}
      >
        {scroll ? (
          <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
            {content}
          </ScrollView>
        ) : (
          content
        )}
      </KeyboardAvoidingView>
    </View>
  );
}

export function FormHeader({
  eyebrow,
  reference,
  formNumber,
}: {
  eyebrow: string;
  reference: string;
  formNumber: string;
}) {
  const styles = usePrimitiveStyles();
  return (
    <View style={styles.header} accessibilityRole="header">
      <View style={styles.headerLine}>
        <Text style={styles.eyebrow}>{eyebrow}</Text>
        <Text style={styles.reference}>{reference}</Text>
      </View>
      <View style={styles.rule} />
      <Text style={styles.formNumber}>{formNumber}</Text>
    </View>
  );
}

export function EditorialHeading({
  children,
  underline = false,
  style,
}: {
  children: ReactNode;
  underline?: boolean;
  style?: StyleProp<TextStyle>;
}) {
  const styles = usePrimitiveStyles();
  return (
    <View style={styles.headingWrap}>
      <Text style={[styles.editorialHeading, style]}>{children}</Text>
      {underline && <View style={styles.blueUnderline} />}
    </View>
  );
}

export function ClauseHeading({ label, children }: { label: string; children: ReactNode }) {
  const styles = usePrimitiveStyles();
  return (
    <View style={styles.clauseHeading}>
      <Text style={styles.eyebrow}>{label}</Text>
      <Text style={styles.clauseTitle}>{children}</Text>
    </View>
  );
}

export function Rule({
  dashed = false,
  style,
}: {
  dashed?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  const styles = usePrimitiveStyles();
  return <View testID="rule" style={[styles.rule, dashed && styles.dashedRule, style]} />;
}

export function StatusLabel({
  children,
  tone = 'neutral',
}: {
  children: ReactNode;
  tone?: 'neutral' | 'blue' | 'red' | 'green';
}) {
  const { colors } = useThinkSoTheme();
  const styles = usePrimitiveStyles();
  return (
    <Text style={[styles.statusLabel, { color: statusToneColor(colors, tone) }]}>{children}</Text>
  );
}

export function Stamp({
  children,
  tone = 'red',
  angle = -4,
}: {
  children: ReactNode;
  tone?: 'red' | 'blue' | 'green';
  angle?: number;
}) {
  const { colors } = useThinkSoTheme();
  const styles = usePrimitiveStyles();
  return (
    <Text
      style={[
        styles.stamp,
        {
          color: statusToneColor(colors, tone),
          borderColor: statusToneColor(colors, tone),
          transform: [{ rotate: `${angle}deg` }],
        },
      ]}
    >
      {children}
    </Text>
  );
}

export function HandwrittenAnnotation({
  children,
  color = 'blue',
  style,
}: {
  children: ReactNode;
  color?: 'blue' | 'red';
  style?: StyleProp<TextStyle>;
}) {
  const { colors } = useThinkSoTheme();
  const styles = usePrimitiveStyles();
  return (
    <Text
      style={[
        styles.annotation,
        { color: color === 'red' ? colors.redInk : colors.blueInk },
        style,
      ]}
    >
      {children}
    </Text>
  );
}

type ActionButtonProps = {
  children: ReactNode;
  onPress?: (event: GestureResponderEvent) => void;
  variant?: 'primary' | 'secondary' | 'destructive';
  disabled?: boolean;
  loading?: boolean;
  testID?: string;
  accessibilityLabel?: string;
};

export function actionButtonVisualStyle(
  variant: NonNullable<ActionButtonProps['variant']>,
  pressed: boolean,
  unavailable: boolean,
  colors: ThemeColors = lightTheme.colors,
) {
  const styles = primitiveStyles(colors);
  return [
    styles.actionButton,
    actionVariant(colors, variant),
    unavailable && styles.actionDisabled,
    pressed && !unavailable && actionPressedVariant(colors, variant),
  ];
}

export function ActionButton({
  children,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  testID,
  accessibilityLabel,
}: ActionButtonProps) {
  const { colors } = useThinkSoTheme();
  const styles = usePrimitiveStyles();
  const unavailable = disabled || loading;
  const actionLabel = accessibilityLabel ?? (typeof children === 'string' ? children : undefined);
  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={actionLabel}
      accessibilityState={{ disabled: unavailable, busy: loading }}
      disabled={unavailable}
      onPress={onPress}
      style={({ pressed }) => actionButtonVisualStyle(variant, pressed, unavailable, colors)}
    >
      {loading ? (
        <LoadingS
          {...(testID ? { testID: `${testID}-indicator` } : {})}
          label={actionLabel ? `${actionLabel} loading` : 'Loading'}
          size={18}
          strokeWidth={4}
          ink={variant === 'secondary' ? colors.blueInk : colors.inverseInk}
        />
      ) : (
        <Text style={[styles.actionText, variant === 'secondary' && styles.secondaryText]}>
          {children}
        </Text>
      )}
    </Pressable>
  );
}

export function ThreadsConnectButton({
  onPress,
  disabled = false,
  loading = false,
  testID,
}: {
  onPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
  testID?: string;
}) {
  const { colors } = useThinkSoTheme();
  const styles = usePrimitiveStyles();
  const unavailable = disabled || loading;
  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel="Connect Threads"
      accessibilityState={{ disabled: unavailable, busy: loading }}
      disabled={unavailable}
      onPress={onPress}
      style={({ pressed }) => [
        styles.threadsButton,
        unavailable && styles.threadsButtonDisabled,
        pressed && !unavailable && styles.threadsButtonPressed,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          {...(testID ? { testID: `${testID}-indicator` } : {})}
          accessibilityLabel="Connecting Threads"
          color={colors.providerDisabledInk}
          size="small"
        />
      ) : (
        <ThreadsGlyph disabled={disabled} colors={colors} />
      )}
      <Text style={[styles.threadsButtonText, unavailable && styles.threadsButtonTextDisabled]}>
        Connect Threads
      </Text>
    </Pressable>
  );
}

function ThreadsGlyph({ disabled, colors }: { disabled: boolean; colors: ThemeColors }) {
  return (
    <Svg width={22} height={22} viewBox="0 0 192 192" accessibilityElementsHidden>
      <Path
        fill={disabled ? colors.ink : colors.providerInk}
        d="M141.537 88.988c-.827-.396-1.667-.778-2.518-1.143-1.482-27.307-16.403-42.94-41.457-43.1h-.34c-14.986 0-27.449 6.397-35.12 18.036l13.779 9.452c5.73-8.694 14.724-10.548 21.347-10.548h.229c8.25.053 14.475 2.451 18.504 7.129 2.932 3.405 4.893 8.111 5.864 14.05-7.314-1.243-15.224-1.626-23.68-1.141-23.82 1.372-39.134 15.265-38.105 34.569.522 9.792 5.4 18.216 13.735 23.719 7.048 4.652 16.124 6.927 25.558 6.412 12.458-.683 22.231-5.436 29.049-14.127 5.178-6.6 8.453-15.153 9.899-25.93 5.937 3.583 10.337 8.298 12.767 13.966 4.132 9.635 4.373 25.468-8.546 38.376-11.319 11.308-24.925 16.2-45.488 16.351-22.809-.169-40.06-7.484-51.275-21.742-10.503-13.351-15.93-32.635-16.133-57.317.203-24.682 5.63-43.966 16.133-57.317 11.215-14.258 28.465-21.573 51.275-21.742 22.975.171 40.526 7.521 52.171 21.848 5.71 7.025 10.015 15.861 12.853 26.162l16.147-4.308c-3.44-12.68-8.853-23.607-16.219-32.668C147.036 9.607 125.202.195 97.07 0h-.113C68.882.194 47.292 9.642 32.788 28.079 19.882 44.486 13.224 67.316 13.001 95.933L13 96l.001.067c.223 28.617 6.881 51.447 19.787 67.854C47.292 182.358 68.882 191.806 96.957 192h.113c24.958-.173 42.53-6.708 57.011-21.189 18.942-18.923 18.402-42.613 12.158-57.172-4.478-10.434-13.01-18.91-24.702-24.651ZM98.44 129.507c-10.44.588-21.286-4.098-21.82-14.135-.397-7.442 5.296-15.746 22.461-16.735 1.966-.113 3.895-.169 5.79-.169 6.235 0 12.068.606 17.371 1.765-1.978 24.702-13.58 28.713-23.802 29.274Z"
      />
    </Svg>
  );
}

export function IconButton({
  icon,
  label,
  onPress,
  disabled = false,
  testID,
}: {
  icon: 'back' | 'close' | 'profile' | 'attach' | 'send';
  label: string;
  onPress?: () => void;
  disabled?: boolean;
  testID?: string;
}) {
  const styles = usePrimitiveStyles();
  const icons = { back: '‹', close: '×', profile: '○', attach: '＋', send: '↑' } as const;
  return (
    <Pressable
      testID={testID}
      hitSlop={hitSlop}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [styles.iconButton, pressed && !disabled && styles.iconPressed]}
    >
      <Text style={styles.iconText}>{icons[icon]}</Text>
    </Pressable>
  );
}

export function AcknowledgmentControl({
  checked,
  disabled = false,
  label,
  onChange,
  testID,
}: {
  checked: boolean;
  disabled?: boolean;
  label: string;
  onChange: (checked: boolean) => void;
  testID?: string;
}) {
  const styles = usePrimitiveStyles();
  return (
    <Pressable
      testID={testID}
      accessibilityRole="checkbox"
      accessibilityState={{ checked, disabled }}
      disabled={disabled}
      onPress={() => onChange(!checked)}
      style={({ pressed }) => [
        styles.acknowledgment,
        pressed && !disabled && styles.ackPressed,
        disabled && styles.actionDisabled,
      ]}
    >
      <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
        {checked && <Text style={styles.checkmark}>✓</Text>}
      </View>
      <Text style={styles.bodyText}>{label}</Text>
    </Pressable>
  );
}

export function shouldDismissToastSwipe(deltaY: number): boolean {
  return deltaY < -24;
}

export function FilingErrorToast({
  header,
  message,
  action,
  onAction,
  onDismiss,
  initialSeconds = 6,
  testID,
}: {
  header: string;
  message: string;
  action?: 'TRY AGAIN' | 'DISMISS' | 'LOG OUT';
  onAction?: () => void;
  onDismiss: () => void;
  initialSeconds?: number;
  testID?: string;
}) {
  const styles = usePrimitiveStyles();
  const [remaining, setRemaining] = useState(initialSeconds);
  const dismissedAfterExpiry = useRef(false);
  const dismissRef = useRef(onDismiss);

  useEffect(() => {
    dismissRef.current = onDismiss;
  }, [onDismiss]);

  useEffect(() => {
    if (remaining <= 0) {
      if (!dismissedAfterExpiry.current) {
        dismissedAfterExpiry.current = true;
        dismissRef.current();
      }
      return;
    }
    const timer = setTimeout(() => setRemaining((value) => Math.max(0, value - 1)), 1000);
    return () => clearTimeout(timer);
  }, [remaining]);

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_event, gesture) =>
          gesture.dy < -8 && Math.abs(gesture.dy) > Math.abs(gesture.dx),
        onPanResponderRelease: (_event, gesture) => {
          if (shouldDismissToastSwipe(gesture.dy)) onDismiss();
        },
      }),
    [onDismiss],
  );

  return (
    <View
      testID={testID}
      accessibilityRole="alert"
      style={styles.toast}
      {...panResponder.panHandlers}
    >
      <View style={styles.toastHeader}>
        <Text style={styles.toastHeading}>{header}</Text>
        <IconButton icon="close" label="Dismiss error" onPress={onDismiss} testID="toast-close" />
      </View>
      <Text style={styles.bodyText}>{message}</Text>
      <View style={styles.toastActions}>
        {action && (
          <ActionButton
            testID="toast-action"
            variant="secondary"
            disabled={remaining === 0}
            {...(onAction ? { onPress: onAction } : {})}
          >
            {action} · {remaining}
          </ActionButton>
        )}
        <Text style={styles.toastHint}>Expires without taking action.</Text>
      </View>
    </View>
  );
}

export function NoticeDialog({
  visible,
  title,
  children,
  confirmLabel,
  cancelLabel = 'CANCEL',
  onConfirm,
  onCancel,
}: {
  visible: boolean;
  title: string;
  children: ReactNode;
  confirmLabel: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const styles = usePrimitiveStyles();
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={styles.dialogBackdrop}>
        <View style={styles.dialog}>
          <Text style={styles.eyebrow}>THINKSO · NOTICE</Text>
          <EditorialHeading>{title}</EditorialHeading>
          <Text style={styles.bodyText}>{children}</Text>
          <View style={styles.dialogActions}>
            <ActionButton variant="secondary" onPress={onCancel}>
              {cancelLabel}
            </ActionButton>
            <ActionButton onPress={onConfirm}>{confirmLabel}</ActionButton>
          </View>
        </View>
      </View>
    </Modal>
  );
}

export type FirebaseAccountFormBoundary = {
  email: string;
  password: string;
  onEmailChange: (email: string) => void;
  onPasswordChange: (password: string) => void;
  onSubmit: () => void;
  busy?: boolean;
  submitLabel: string;
};

export function AccountFormFields({
  email,
  password,
  onEmailChange,
  onPasswordChange,
  onSubmit,
  busy = false,
  submitLabel,
}: FirebaseAccountFormBoundary) {
  const { colors } = useThinkSoTheme();
  const styles = usePrimitiveStyles();
  const [showPassword, setShowPassword] = useState(false);
  return (
    <View style={styles.form}>
      <Text style={styles.fieldLabel}>EMAIL</Text>
      <TextInput
        testID="account-email"
        accessibilityLabel="Email"
        autoCapitalize="none"
        autoComplete="email"
        keyboardType="email-address"
        editable={!busy}
        value={email}
        onChangeText={onEmailChange}
        placeholder="you@somewhere.com"
        placeholderTextColor={colors.mutedInk}
        style={styles.input}
      />
      <View style={styles.passwordLabel}>
        <Text style={styles.fieldLabel}>PASSWORD</Text>
        <Pressable
          disabled={busy}
          hitSlop={hitSlop}
          onPress={() => setShowPassword((value) => !value)}
        >
          <Text style={styles.link}>{showPassword ? 'HIDE' : 'SHOW'}</Text>
        </Pressable>
      </View>
      <TextInput
        testID="account-password"
        accessibilityLabel="Password"
        autoCapitalize="none"
        autoComplete="password"
        editable={!busy}
        secureTextEntry={!showPassword}
        value={password}
        onChangeText={onPasswordChange}
        placeholder="••••••••"
        placeholderTextColor={colors.mutedInk}
        style={styles.input}
      />
      <ActionButton disabled={busy} loading={busy} onPress={onSubmit}>
        {submitLabel}
      </ActionButton>
    </View>
  );
}

function textToneColor(colors: ThemeColors, tone: TextTone): string {
  if (tone === 'muted') return colors.mutedInk;
  if (tone === 'blue') return colors.blueInk;
  if (tone === 'red') return colors.redInk;
  if (tone === 'green') return colors.approvalGreen;
  if (tone === 'inverse') return colors.inverseInk;
  return colors.ink;
}

function statusToneColor(colors: ThemeColors, tone: 'neutral' | 'blue' | 'red' | 'green'): string {
  if (tone === 'blue') return colors.blueInk;
  if (tone === 'red') return colors.redInk;
  if (tone === 'green') return colors.approvalGreen;
  return colors.mutedInk;
}

function actionVariant(
  colors: ThemeColors,
  variant: NonNullable<ActionButtonProps['variant']>,
): ViewStyle {
  if (variant === 'secondary') return { backgroundColor: 'transparent', borderColor: colors.ink };
  if (variant === 'destructive') {
    return { backgroundColor: colors.redInk, borderColor: colors.redInk };
  }
  return { backgroundColor: colors.ink, borderColor: colors.ink };
}

function actionPressedVariant(
  colors: ThemeColors,
  variant: NonNullable<ActionButtonProps['variant']>,
): ViewStyle {
  if (variant === 'secondary') {
    return { backgroundColor: colors.secondaryPressed, borderColor: colors.blueInkDark };
  }
  if (variant === 'destructive') {
    return { backgroundColor: colors.redInkPressed, borderColor: colors.redInkPressed };
  }
  return { backgroundColor: colors.inkPressed, borderColor: colors.inkPressed };
}

const primitiveStyleCache = new WeakMap<ThemeColors, ReturnType<typeof createPrimitiveStyles>>();

function primitiveStyles(colors: ThemeColors) {
  const cached = primitiveStyleCache.get(colors);
  if (cached) return cached;
  const created = createPrimitiveStyles(colors);
  primitiveStyleCache.set(colors, created);
  return created;
}

function usePrimitiveStyles() {
  return primitiveStyles(useThinkSoTheme().colors);
}

function createPrimitiveStyles(colors: ThemeColors) {
  return StyleSheet.create({
    canvas: { flex: 1, backgroundColor: colors.canvas },
    centerColumn: {
      flex: 1,
      width: '100%',
      maxWidth: sizes.contentMaxWidth,
      alignSelf: 'center',
      backgroundColor: colors.paper,
    },
    scroll: { flexGrow: 1 },
    documentContent: { width: '100%', paddingHorizontal: spacing.xl, gap: spacing.xl },
    marginRule: { borderLeftWidth: 1, borderLeftColor: colors.marginRule },
    header: { gap: spacing.sm },
    headerLine: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      gap: spacing.md,
    },
    eyebrow: {
      color: colors.mutedInk,
      ...textStyles.label,
    },
    reference: {
      color: colors.blueInkDark,
      ...textStyles.reference,
    },
    formNumber: {
      alignSelf: 'flex-end',
      color: colors.mutedInk,
      ...textStyles.reference,
    },
    rule: { height: 1, width: '100%', backgroundColor: colors.rule },
    dashedRule: { borderStyle: 'dashed', borderWidth: 1, backgroundColor: 'transparent' },
    headingWrap: { alignSelf: 'flex-start', gap: spacing.xs },
    editorialHeading: {
      color: colors.ink,
      ...textStyles.display,
    },
    blueUnderline: {
      height: 3,
      width: '100%',
      backgroundColor: colors.blueInk,
      transform: [{ rotate: '-1deg' }],
    },
    clauseHeading: { gap: spacing.xs },
    clauseTitle: {
      color: colors.ink,
      ...textStyles.heading,
    },
    bodyText: {
      color: colors.ink,
      ...textStyles.body,
    },
    statusLabel: {
      ...textStyles.label,
    },
    stamp: {
      alignSelf: 'flex-start',
      borderWidth: 2,
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      ...textStyles.label,
      fontSize: 14,
      letterSpacing: 1.3,
    },
    annotation: textStyles.annotation,
    actionButton: {
      minHeight: sizes.actionHeight,
      borderWidth: 1,
      borderRadius: radii.control,
      paddingHorizontal: spacing.lg,
      alignItems: 'center',
      justifyContent: 'center',
    },
    actionText: {
      color: colors.inverseInk,
      ...textStyles.action,
    },
    secondaryText: { color: colors.ink },
    actionDisabled: { opacity: 0.45 },
    threadsButton: {
      minHeight: sizes.providerActionHeight,
      width: '100%',
      borderRadius: radii.provider,
      backgroundColor: colors.providerBackground,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 9,
    },
    threadsButtonPressed: { backgroundColor: colors.providerPressed },
    threadsButtonDisabled: {
      backgroundColor: colors.providerDisabledBackground,
      borderWidth: 1,
      borderColor: colors.providerDisabledBorder,
    },
    threadsButtonText: {
      color: colors.providerInk,
      fontFamily: Platform.select({ ios: 'Helvetica Neue', android: 'sans-serif-medium' }),
      fontSize: 17,
      fontWeight: '600',
    },
    threadsButtonTextDisabled: { color: colors.providerDisabledInk },
    iconButton: {
      width: sizes.minimumTouchTarget,
      height: sizes.minimumTouchTarget,
      alignItems: 'center',
      justifyContent: 'center',
    },
    iconPressed: { opacity: 0.6 },
    iconText: {
      color: colors.ink,
      fontFamily: textStyles.body.fontFamily,
      fontSize: 28,
      lineHeight: 32,
    },
    acknowledgment: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: spacing.md,
      borderWidth: 1,
      borderColor: colors.rule,
      backgroundColor: colors.checkboxPaper,
      padding: spacing.lg,
      minHeight: 64,
    },
    ackPressed: { backgroundColor: colors.raisedPaper },
    checkbox: {
      width: 28,
      height: 28,
      borderWidth: 1,
      borderColor: colors.ink,
      alignItems: 'center',
      justifyContent: 'center',
    },
    checkboxChecked: { backgroundColor: colors.blueInk, borderColor: colors.blueInk },
    checkmark: {
      color: colors.inverseInk,
      fontFamily: textStyles.annotation.fontFamily,
      fontSize: 21,
      lineHeight: 24,
    },
    toast: {
      backgroundColor: colors.filingError,
      borderWidth: 1,
      borderColor: colors.redInk,
      padding: spacing.lg,
      gap: spacing.md,
    },
    toastHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    toastHeading: {
      flex: 1,
      color: colors.redInkDark,
      ...textStyles.action,
    },
    toastActions: { alignItems: 'flex-start', gap: spacing.sm },
    toastHint: { color: colors.redInkDark, ...textStyles.caption },
    dialogBackdrop: {
      flex: 1,
      backgroundColor: colors.scrim,
      justifyContent: 'center',
      padding: spacing.xl,
    },
    dialog: {
      width: '100%',
      maxWidth: 560,
      alignSelf: 'center',
      backgroundColor: colors.raisedPaper,
      borderWidth: 1,
      borderColor: colors.ink,
      padding: spacing.xl,
      gap: spacing.lg,
    },
    dialogActions: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      gap: spacing.md,
      flexWrap: 'wrap',
    },
    form: { gap: spacing.md },
    fieldLabel: {
      color: colors.mutedInk,
      ...textStyles.label,
    },
    input: {
      minHeight: 48,
      borderWidth: 1,
      borderColor: colors.rule,
      backgroundColor: colors.raisedPaper,
      paddingHorizontal: spacing.md,
      color: colors.ink,
      ...textStyles.body,
    },
    passwordLabel: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    link: {
      color: colors.blueInkDark,
      ...textStyles.label,
    },
  });
}
