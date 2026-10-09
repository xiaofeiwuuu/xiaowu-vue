import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { VantResolver } from 'unplugin-vue-components/resolvers';
import { visualizer } from 'rollup-plugin-visualizer';
import zipPack from 'vite-plugin-zip-pack';
import postcsspxtorem from 'postcss-pxtorem';
import path from 'path';

// 打包体积分析：pnpm analyze（生成 stats.html，不自动打开浏览器）
export default defineConfig(({ mode, command }) => ({
  root: process.cwd(),
  plugins: [
    vue(),
    AutoImport({
      imports: [
        'vue',
        'vue-router',
        'pinia',
        {
          'vant': [
            'showToast',
            'showDialog',
            'showNotify',
            'Dialog'
          ]
        }
      ],
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
        additionalData: `@use "@/assets/styles/variables" as *;`,
      },
    },
    postcss: {
      plugins: [
        postcsspxtorem({
          rootValue: 37.5,
          propList: ['*'],
          selectorBlackList: ['.norem'],
        }),
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
    open: true,
    cors: true,
    hmr: {
      overlay: false
    }
  },
  build: {
    chunkSizeWarningLimit: 2000,
    sourcemap: false
  },
  optimizeDeps: {
    include: ['vue', 'vue-router', 'pinia', 'axios', 'vant']
  }
}));
