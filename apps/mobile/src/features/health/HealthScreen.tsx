import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useHealthPresenter } from './presentation/use-health-presenter';

export function HealthScreen() {
  const state = useHealthPresenter();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>ThinkSo</Text>
      {state.type === 'loading' && <Text>Checking API health…</Text>}
      {state.type === 'error' && <Text accessibilityRole="alert">{state.message}</Text>}
      {state.type === 'ready' && (
        <>
          <Text testID="health-status">{state.label}</Text>
          <Text>Checked {state.checkedAt}</Text>
        </>
      )}
      <Pressable
        accessibilityRole="button"
        onPress={() => state.onEvent({ type: 'refreshPressed' })}
      >
        <Text style={styles.button}>Refresh</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12, padding: 24 },
  title: { fontSize: 32, fontWeight: '700' },
  button: { padding: 12, color: '#0a7' },
});
