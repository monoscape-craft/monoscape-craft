import { defineConfig } from 'vite';
import { resolve, relative, extname } from 'path';
import viteImagemin from 'vite-plugin-imagemin';
import fg from 'fast-glob';
import { ViteEjsPlugin } from 'vite-plugin-ejs'; // 追加

export default defineConfig({
  base: '/monoscape-craft/',
  plugins: [
    ViteEjsPlugin(),
    viteImagemin({
      gifsicle: { optimizationLevel: 7, interlaced: false },
      optipng: { optimizationLevel: 7 },
      mozjpeg: { quality: 80 },
      pngquant: { quality: [0.8, 0.9], speed: 4 },
      svgo: {
        plugins: [{ name: 'removeViewBox' }, { name: 'removeEmptyAttrs', active: false }],
      },
    }),
  ],
  server: {
    open: true,
  },
  build: {
    rollupOptions: {
      // fg.sync() として呼び出す
      input: Object.fromEntries(
        fg.sync(['./**/*.html'], { ignore: ['node_modules/**', 'dist/**'] }).map(file => [
          relative(__dirname, file).slice(0, -extname(file).length),
          resolve(__dirname, file)
        ])
      ),
    },
  },
});
