import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';


export default defineConfig({
	plugins: [ vue() ],
	server: {
		port: 80,
		proxy: {
			'^/api': {
				target: 'http://localhost:3000',
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/api/, "/")
			},
			'/vatusa': {
				target: 'https://api.vatusa.net/v2',
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/vatusa/, "/")
			}
		}
	},
	resolve: {
		alias: [
			{
				find: '@',
				replacement: path.resolve(__dirname, 'src')
			}
		]
	},
	css: {
		preprocessorOptions: {
			scss: {
				additionalData: `@import "./src/assets/css/styles";`
			}
		}
	},
	define: {
		'process.env': process.env
	}
});