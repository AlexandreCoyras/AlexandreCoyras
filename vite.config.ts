import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import pages from 'vite-plugin-pages';
import reactRefresh from '@vitejs/plugin-react-refresh';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), pages(), reactRefresh()],
});
