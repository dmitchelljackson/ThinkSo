import { createApiClient } from './transport';

describe('typed API transport', () => {
  it('creates an openapi-fetch client with the canonical API base', () => {
    const client = createApiClient('http://localhost:8000');
    expect(typeof client.GET).toBe('function');
  });
});
