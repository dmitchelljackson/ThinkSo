import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Slot } from 'expo-router';
import { useFonts } from 'expo-font';
import { useMemo } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppGraph } from '../di/app-graph';
import { FeedbackProvider, LoadingS, thinkSoFonts } from '../design-system';

export default function RootLayout() {
  const [fontsLoaded] = useFonts(thinkSoFonts);
  const graph = useMemo(() => new AppGraph(), []);
  const queryClient = graph.retrieve<QueryClient>('queryClient');
  if (queryClient === undefined) throw new Error('Application graph did not provide QueryClient');
  if (!fontsLoaded) return <LoadingS label="Loading ThinkSo fonts" />;
  return (
    <SafeAreaProvider>
      <FeedbackProvider>
        <QueryClientProvider client={queryClient}>
          <Slot />
        </QueryClientProvider>
      </FeedbackProvider>
    </SafeAreaProvider>
  );
}
