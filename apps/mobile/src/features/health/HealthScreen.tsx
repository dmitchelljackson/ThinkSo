import { View } from 'react-native';
import { ActionButton, Stack, ThinkSoText, useThinkSoTheme, spacing } from '../../design-system';
import { useHealthPresenter } from './presentation/use-health-presenter';

export function HealthScreen() {
  const state = useHealthPresenter();
  const { colors } = useThinkSoTheme();
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        backgroundColor: colors.paper,
        padding: spacing.xl,
      }}
    >
      <Stack gap="lg">
        <ThinkSoText variant="display">ThinkSo</ThinkSoText>
        {state.type === 'loading' && <ThinkSoText>Checking API health…</ThinkSoText>}
        {state.type === 'error' && (
          <ThinkSoText accessibilityRole="alert" tone="red">
            {state.message}
          </ThinkSoText>
        )}
        {state.type === 'ready' && (
          <Stack gap="xs">
            <ThinkSoText testID="health-status">{state.label}</ThinkSoText>
            <ThinkSoText variant="caption" tone="muted">
              Checked {state.checkedAt}
            </ThinkSoText>
          </Stack>
        )}
        <ActionButton onPress={() => state.onEvent({ type: 'refreshPressed' })}>
          Refresh
        </ActionButton>
      </Stack>
    </View>
  );
}
