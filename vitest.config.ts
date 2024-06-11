import { defineConfig } from 'vitest/config';
import { config } from 'dotenv';

export default defineConfig({
    test: {
        root: './src',
        env: {
            ...config({ path: './.env.test' }).parsed,
        },
    },
});
