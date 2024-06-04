import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import path from 'path';

export default defineConfig({
    build: {
        lib: {
            entry: path.resolve(__dirname, 'src/index.ts'),
            name: 'syncflow-node-client',
            formats: ['es', 'cjs'],
            fileName: (format) => `syncflow-node-client.${format}.js`,
        },
        rollupOptions: {
            external: [], // Specify your external dependencies here
        },
    },
    plugins: [dts()],
});
