import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    test: {
        include: ['**/e2e/*.test.ts'],
        globals: true,
        testTimeout: 60_000,
        hookTimeout: 60_000,
    },
});
