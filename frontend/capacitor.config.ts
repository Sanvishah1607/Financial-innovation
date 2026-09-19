import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.finguard.app',
  appName: 'FinGuard',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    cleartext: true,
  },
  plugins: {
    Camera: {
      permissionsType: 'prompt',
    },
  },
};

export default config;
