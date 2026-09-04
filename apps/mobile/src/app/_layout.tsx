import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Slot } from 'expo-router';
import { useMemo } from 'react';
import { AppGraph } from '../di/app-graph';

export default function RootLayout() {
  const graph = useMemo(() => new AppGraph(), []);
  const queryClient = graph.retrieve<QueryClient>('queryClient');
  if (queryClient === undefined) throw new Error('Application graph did not provide QueryClient');
  return (
    <QueryClientProvider client={queryClient}>
      <Slot />
    </QueryClientProvider>
  );
}
