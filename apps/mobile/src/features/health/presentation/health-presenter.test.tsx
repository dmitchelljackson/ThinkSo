import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react-native';
import type { ReactNode } from 'react';
import type { Health } from '../../../domain/health';
import { useHealthPresenterImpl } from './health-presenter';

const health: Health = {
  status: 'ok',
  service: 'thinkso-api',
  version: '0.0.0',
  checkedAt: new Date('2026-09-04T12:00:00Z'),
};

describe('useHealthPresenterImpl', () => {
  it('emits ready UI state and sends refresh events to the query', async () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false, gcTime: Infinity } },
    });
    const fetchHealth = jest.fn(async () => health);
    const dependencies = {
      healthQueries: {
        health: () => ({ queryKey: ['health'] as const, queryFn: fetchHealth }),
      },
    };
    const wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
    const rendered = await renderHook(() => useHealthPresenterImpl(dependencies), { wrapper });
    await waitFor(() => expect(rendered.result.current.type).toBe('ready'));
    expect(rendered.result.current).toMatchObject({ type: 'ready', label: 'thinkso-api is ok' });
    rendered.result.current.onEvent({ type: 'refreshPressed' });
    await waitFor(() => expect(fetchHealth).toHaveBeenCalledTimes(2));
    rendered.unmount();
    queryClient.clear();
  });
});
