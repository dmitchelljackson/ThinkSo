import { apiBaseUrl } from '../di/app-graph';

describe('apiBaseUrl', () => {
  it('uses the Android emulator host by default', () => {
    expect(apiBaseUrl('android')).toBe('http://10.0.2.2:8000');
  });

  it('uses localhost for iOS and honors an explicit override', () => {
    expect(apiBaseUrl('ios')).toBe('http://localhost:8000');
    const previous = process.env.EXPO_PUBLIC_API_URL;
    process.env.EXPO_PUBLIC_API_URL = 'https://api.example.test';
    expect(apiBaseUrl('android')).toBe('https://api.example.test');
    if (previous === undefined) {
      delete process.env.EXPO_PUBLIC_API_URL;
    } else {
      process.env.EXPO_PUBLIC_API_URL = previous;
    }
  });
});
