import { defineConfig } from 'tsup';

export default defineConfig({
    entryPoints: ['src/index.ts'],
    format: ['cjs', 'esm'],
    dts: true,
    clean: true,
    sourcemap: true,
    minify: true,
    bundle: true,
    ignoreWatch: ['**/dist', '**/node_modules'],
    noExternal: ['ts-monads'],
});
