import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: './', // Ensures GitHub Pages relative paths work on subpath URLs
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['app-logo.jpg', 'icon-192.png', 'icon-512.png', 'apple-touch-icon.png'],
      workbox: {
        skipWaiting: true,
        clientsClaim: true,
        cleanupOutdatedCaches: true,
      },
      manifest: {
        name: 'Connected — Touchpoints & Memory Log',
        short_name: 'Connected',
        description: 'Intimate relationship tracker and memory log for iOS',
        theme_color: '#0d0f14',
        background_color: '#0d0f14',
        display: 'standalone',
        orientation: 'portrait',
        scope: './',
        start_url: './',
        icons: [
          {
            src: 'icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'icon-512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ],
        share_target: {
          action: './?quicklog=true',
          method: 'GET',
          params: {
            title: 'contact',
            text: 'summary',
            url: 'url'
          }
        }
      }
    })
  ]
});
