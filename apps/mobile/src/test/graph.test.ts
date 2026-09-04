import { QueryClient } from '@tanstack/react-query';
import { AppGraph } from '../di/app-graph';

describe('AppGraph Obsidian compatibility', () => {
  it('resolves decorated providers through graph transforms', () => {
    const graph = new AppGraph();
    const queryClient = graph.retrieve<QueryClient>('queryClient');
    expect(queryClient).toBeInstanceOf(QueryClient);
    expect(graph.retrieve('healthQueries')).toBeDefined();
    queryClient?.clear();
  });
});
