import type { ExpoConfig } from 'expo/config';

const config: ExpoConfig & { newArchEnabled: boolean; jsEngine: 'hermes' } = {
  name: 'ThinkSo',
  slug: 'thinkso',
  version: '0.0.0',
  scheme: 'thinkso',
  jsEngine: 'hermes',
  userInterfaceStyle: 'automatic',
  newArchEnabled: true,
  runtimeVersion: { policy: 'appVersion' },
  extra: {
    eas: {
      projectId: 'a53d6e77-474f-4f27-a5d4-35627d7c405e',
    },
  },
  experiments: { typedRoutes: true },
  ios: { bundleIdentifier: 'com.thinkso.app', supportsTablet: true },
  android: { package: 'com.thinkso.app' },
  web: { bundler: 'metro' },
  plugins: ['expo-router'],
};

export default config;
