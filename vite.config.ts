import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import pages from 'vite-plugin-pages';
import path from 'path';
import fs from 'fs';

// https://vitejs.dev/config/
export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                main: './src/main.tsx',
                ...getPagesInput('./src/pages'),
            },
        },
    },
    plugins: [react(), pages()],
});

function getPagesInput(pagesDir) {
    const pages = {};

    if (fs.existsSync(pagesDir)) {
        const files = fs.readdirSync(pagesDir);

        files.forEach((file) => {
            const name = path.basename(file, path.extname(file));
            pages[name] = `${pagesDir}/${file}`;
        });
    }

    return pages;
}
