import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Permite que sea accesible desde fuera del contenedor
    port: 8080, 
    strictPort: true, // Evita que cambie el puerto si está ocupado
    watch: {
      usePolling: true // Importante para que detecte cambios dentro del contenedor
    }
  }
})
