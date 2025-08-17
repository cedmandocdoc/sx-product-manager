import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import federation from '@originjs/vite-plugin-federation'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  
  const port = parseInt(env.VITE_PORT) || 4001

  return {
    plugins: [
      react(),
      federation({
        name: 'productManager',
        filename: 'remoteEntry.js',
        exposes: {
          './App': './src/App.tsx',
        },
        shared: ['react', 'react-dom']
      })
    ],
    build: {
      modulePreload: false,
      target: 'esnext',
      minify: false,
      cssCodeSplit: false
    },
    server: {
      port: port
    },
    preview: {
      port: port
    }
  }
})
