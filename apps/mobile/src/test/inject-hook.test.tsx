import { renderHook } from '@testing-library/react-native';
import { injectHook } from 'react-obsidian';
import type { HealthPresenterDependencies } from '../features/health/presentation/health-presenter';
import { AppGraph } from '../di/app-graph';

const useInjectedFixture = injectHook(
  ({ healthQueries }: HealthPresenterDependencies) => healthQueries.health().queryKey,
  AppGraph,
);

describe('injectHook Obsidian compatibility', () => {
  it('injects graph dependencies into a hook', async () => {
    const rendered = await renderHook(() => useInjectedFixture());
    expect(rendered.result.current).toEqual(['health']);
    rendered.unmount();
  });
});
