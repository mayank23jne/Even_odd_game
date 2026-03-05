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
  },
  plugins: {
    FirebaseAuthentication: {
      skipNativeAuth: false,
      providers: ["google.com"],
    },
  },
};

export default config;
