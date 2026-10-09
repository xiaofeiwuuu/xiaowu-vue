import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { visualizer } from 'rollup-plugin-visualizer';
import zipPack from 'vite-plugin-zip-pack';
import { VantResolver } from 'unplugin-vue-components/resolvers';

// 打包体积分析：pnpm analyze（生成 stats.html，不自动打开浏览器）
export default defineConfig(({ mode, command }) => ({
  plugins: [
    vue(),
    AutoImport({
      imports: ['vue', 'vue-router', 'pinia'],
      dts: 'src/auto-imports.d.ts',
    }),
    Components({
      resolvers: [VantResolver()],
      dts: 'src/components.d.ts',
    }),
    mode === 'analyze' && visualizer({ gzipSize: true, brotliSize: true }),
    // 构建完成后把 dist 打包为 dist-zip/dist.zip，方便上传部署
    { ...zipPack({ inDir: 'dist', outDir: 'dist-zip', outFileName: 'dist.zip' }), apply: 'build' },
  ],

  // 仅生产构建：移除 console.log / console.warn / console.debug（保留 console.error）和 debugger
  esbuild: command === 'build' ? { pure: ['console.log', 'console.warn', 'console.debug'], drop: ['debugger'] } : {},
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
        // additionalData: `@use "@/assets/styles/_variables" as *;`,
      },
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  server: {
    host: true,
    cors: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  build: {
    chunkSizeWarningLimit: 2000,
    cssCodeSplit: true,
    sourcemap: false,
  },
}));
