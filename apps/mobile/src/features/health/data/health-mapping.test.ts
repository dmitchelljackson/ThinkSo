import { mapHealthDto } from './health-mapping';

describe('mapHealthDto', () => {
  it('maps the wire DTO into a domain model', () => {
    const result = mapHealthDto({
      status: 'ok',
      service: 'thinkso-api',
      version: '0.0.0',
      checked_at: '2026-09-04T12:00:00Z',
    });
    expect(result.checkedAt).toEqual(new Date('2026-09-04T12:00:00Z'));
    expect(result.status).toBe('ok');
  });
});
