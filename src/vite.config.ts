import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
      "@/components": path.resolve(__dirname, "./components"),
      "@/lib": path.resolve(__dirname, "./lib"),
      "@/utils": path.resolve(__dirname, "./utils"),
      "@/styles": path.resolve(__dirname, "./styles"),
      "@/types": path.resolve(__dirname, "./types"),
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  envPrefix: ['VITE_', 'NEXT_PUBLIC_'],
  define: {
    'process.env': {}
  }
})