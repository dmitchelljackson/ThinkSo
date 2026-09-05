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

  it.each([
    null,
    {},
    {
      status: 'degraded',
      service: 'thinkso-api',
      version: '0.0.0',
      checked_at: '2026-09-04T12:00:00Z',
    },
    { status: 'ok', version: '0.0.0', checked_at: '2026-09-04T12:00:00Z' },
    { status: 'ok', service: 42, version: '0.0.0', checked_at: '2026-09-04T12:00:00Z' },
    { status: 'ok', service: 'thinkso-api', checked_at: '2026-09-04T12:00:00Z' },
    { status: 'ok', service: 'thinkso-api', version: '0.0.0' },
  ])('rejects a malformed wire value %#', (value) => {
    expect(() => mapHealthDto(value)).toThrow('Invalid health response');
  });

  it('rejects an invalid timestamp before it reaches presentation', () => {
    expect(() =>
      mapHealthDto({
        status: 'ok',
        service: 'thinkso-api',
        version: '0.0.0',
        checked_at: 'not-a-date',
      }),
    ).toThrow('Invalid health response timestamp');
  });
});
