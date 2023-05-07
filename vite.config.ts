import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import pages from 'vite-plugin-pages';
import { resolve } from 'path';
import reactRefresh from '@vitejs/plugin-react-refresh';

const root = resolve(__dirname, 'src');
const outDir = resolve(__dirname, 'dist');

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), pages(), reactRefresh()],
    build: {
        outDir,
        rollupOptions: {
            input: {
                main: resolve('index.html'),
                pc: resolve(root, 'pages', 'pc.html'),
            },
        },
    },
});
