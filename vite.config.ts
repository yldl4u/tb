import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.AIzaSyAT-ryLS_E6rmHdzYZeuK12hnUOaoNObUU),
        'process.env.AIzaSyAT-ryLS_E6rmHdzYZeuK12hnUOaoNObUU': JSON.stringify(env.AIzaSyAT-ryLS_E6rmHdzYZeuK12hnUOaoNObUU)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
