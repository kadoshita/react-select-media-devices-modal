import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    test: {
        include: ['**/*.test.ts', '**/*.test.tsx'],
        exclude: ['**/e2e/*.test.ts', 'node_modules/**'],
        environment: 'jsdom',
        globals: true,
        setupFiles: ['__tests__/setup.ts'],
    },
});
