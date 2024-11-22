import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
	plugins: [react()],
	server: {
		port: 5175,
		proxy: {
			'/api': {
				target: 'https://localhost:7280',
				changeOrigin: true,
				secure: false
			}
		}
	}
})
