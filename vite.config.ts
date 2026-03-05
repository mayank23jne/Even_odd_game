import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    allowedHosts: [
      'huffily-unworking-knox.ngrok-free.dev'
    ],
    port: 8080,
    proxy: {
      '/api': {
        target: 'https://evenodd.api.jyada.in/',
        changeOrigin: true,
        secure: false,
        onProxyReq: (proxyReq, req, res) => {
          console.log('[DEBUG-VITE] Proxying request:', req.method, req.url);
        }
      }
    }
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
