import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // Build configuration
  build: {
    // Generate proper HTML with our favicon
    rollupOptions: {
      plugins: [
        {
          name: 'remove-vite-favicon',
          transformIndexHtml(html) {
            // Completely remove any Vite-related favicon references
            return html
              .replace(/<link rel="icon"[^>]*vite[^>]*>/gi, '')
              .replace(/<link rel="icon"[^>]*>/gi, '<link rel="icon" type="image/svg+xml" href="/leaf-icon.svg" />')
              .replace(/<title>.*<\/title>/, '<title>Mindscape Wellness - Your Mental Health Companion</title>');
          }
        }
      ]
    }
  },
  
  // Clear any default HTML transformations
  html: {
    transformIndexHtml: (html) => {
      return html
    }
  }
})