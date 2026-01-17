import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.evenoddgame.app',
  appName: 'even-odd-game',
  webDir: 'dist',

  server: {
    cleartext: true,         
    allowNavigation: [
      "api.razorpay.com",
      "*.razorpay.com"
    ]
  }
};

export default config;
