import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tsconfigPaths from 'vite-tsconfig-paths';
import path from 'path';
import { config } from 'dotenv';
config({});
const SERVER_URL = process.env.SERVER_URL;
const proxy = SERVER_URL
    ? {
          '/api': {
              target: SERVER_URL,
              changeOrigin: true,
              rewrite: (path: string) => path,
              configure: (proxy: any, options: any) => {
                  proxy.on('proxyReq', (proxyReq: any, req: any, res: any, options: any) => {
                      const origin = req.headers.host;
                      proxyReq.setHeader('origin', origin);
                  });
              },
          },
          '/api/realtime': {
              target: SERVER_URL.replace('https', 'wss').replace('http', 'ws'),
              changeOrigin: true,
              ws: true,
              rewrite: (path: string) => path,
          },
      }
    : undefined;

export default defineConfig({
    plugins: [
        react({
            jsxImportSource: '@emotion/react',
        }),
        tsconfigPaths(),
    ],
    // root: path.resolve(__dirname, 'src'),
    resolve: {
        alias: {
            '~bootstrap': path.resolve(__dirname, 'node_modules/bootstrap'),
            '~assets': path.resolve(__dirname, 'src/assets'),
        },
    },
    css: {
        preprocessorOptions: {
            scss: {
                quietDeps: true,
                api: 'modern-compiler',
            },
        },
    },
    server: {
        proxy,
    },
});
