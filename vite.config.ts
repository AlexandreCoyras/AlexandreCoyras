import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import pages from 'vite-plugin-pages';

// https://vitejs.dev/config/
export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                main: 'src/pages/index.tsx',
                pc: 'src/pages/pc.tsx',
            },
        },
    },
    plugins: [react(), pages()],
});
