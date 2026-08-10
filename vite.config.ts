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
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'Connected — Personal Relationship Tracker',
        short_name: 'Connected',
        description: 'Intimate, fast interaction logger and recency tracker for iOS',
        theme_color: '#F2F2F7',
        background_color: '#000000',
        display: 'standalone',
        orientation: 'portrait',
        scope: './',
        start_url: './',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
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
