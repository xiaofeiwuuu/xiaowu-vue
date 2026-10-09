import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { VantResolver } from 'unplugin-vue-components/resolvers';
import { visualizer } from 'rollup-plugin-visualizer';
import postcsspxtorem from 'postcss-pxtorem';
import path from 'path';

export default defineConfig({
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
    visualizer(),
  ],
  css: {
    preprocessorOptions: {
      scss: {
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
    brotliSize: false,
    chunkSizeWarningLimit: 2000,
    sourcemap: false,
    cache: true
  },
  optimizeDeps: {
    include: ['vue', 'vue-router', 'pinia', 'axios', 'vant']
  }
}); 