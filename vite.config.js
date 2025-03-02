import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        laravel({
            input: [
                'resources/js/app.jsx',
                'resources/js/Pages/Home.jsx',
                'resources/js/Pages/MyPage.jsx',
                'resources/js/Pages/Projects/Create.jsx',
                'resources/js/Pages/Projects/Show.jsx',
                'resources/js/Pages/Teams/Create.jsx',
                'resources/js/Pages/Teams/Show.jsx',
                'resources/js/Pages/Users/Show.jsx',
                'resources/js/Pages/Auth/Register.jsx',
                'resources/js/Pages/Auth/Login.jsx',
                'resources/js/Pages/Statistics/Index.jsx',
            ],
            refresh: true,
        }),
        react(),
    ],
    server: {
        host: '127.0.0.1',
        port: 5173,
        strictPort: true,
    }
});
