import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Slot } from 'expo-router';
import { useFonts } from 'expo-font';
import { useMemo } from 'react';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppGraph } from '../di/app-graph';
import {
  FeedbackProvider,
  LoadingS,
  ThinkSoThemeProvider,
  thinkSoFonts,
  useThinkSoTheme,
} from '../design-system';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThinkSoThemeProvider>
        <ThemedApplication />
      </ThinkSoThemeProvider>
    </SafeAreaProvider>
  );
}

function ThemedApplication() {
  const [fontsLoaded] = useFonts(thinkSoFonts);
  const { colors, dark } = useThinkSoTheme();
  const graph = useMemo(() => new AppGraph(), []);
  const queryClient = graph.retrieve<QueryClient>('queryClient');
  if (queryClient === undefined) throw new Error('Application graph did not provide QueryClient');
  if (!fontsLoaded) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: colors.paper,
        }}
      >
        <StatusBar style={dark ? 'light' : 'dark'} />
        <LoadingS label="Loading ThinkSo fonts" />
      </View>
    );
  }
  return (
    <FeedbackProvider>
      <StatusBar style={dark ? 'light' : 'dark'} />
      <QueryClientProvider client={queryClient}>
        <Slot />
      </QueryClientProvider>
    </FeedbackProvider>
  );
}
