import type { ExpoConfig } from 'expo/config';
import fs from 'node:fs';
import path from 'node:path';

type FirebaseClientConfig = {
  apiKey: string;
  appId: string;
  projectId: string;
  authDomain: string;
};

function firebaseConfig(): FirebaseClientConfig {
  const configPath = path.join(__dirname, 'secrets', 'google-services.json');
  if (!fs.existsSync(configPath)) {
    return {
      apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY ?? 'demo-api-key',
      appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID ?? 'demo-thinkso',
      projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID ?? 'demo-thinkso',
      authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN ?? 'demo-thinkso.firebaseapp.com',
    };
  }
  const raw = JSON.parse(fs.readFileSync(configPath, 'utf8')) as {
    project_info: { project_id: string };
    client: Array<{
      client_info: { mobilesdk_app_id: string };
      api_key: Array<{ current_key: string }>;
    }>;
  };
  const projectId = raw.project_info.project_id;
  const client = raw.client[0];
  if (!client?.api_key[0]) throw new Error('google-services.json is missing Firebase app data');
  return {
    apiKey: client.api_key[0].current_key,
    appId: client.client_info.mobilesdk_app_id,
    projectId,
    authDomain: `${projectId}.firebaseapp.com`,
  };
}

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
    firebase: firebaseConfig(),
    firebaseAuthEmulatorHost: process.env.EXPO_PUBLIC_FIREBASE_AUTH_EMULATOR_HOST,
    eas: {
      projectId: 'a53d6e77-474f-4f27-a5d4-35627d7c405e',
    },
  },
  experiments: { typedRoutes: true },
  ios: { bundleIdentifier: 'com.thinkso.app', supportsTablet: true },
  android: { package: 'com.thinkso.app' },
  web: { bundler: 'metro' },
  plugins: ['expo-router', 'expo-secure-store'],
};

export default config;
