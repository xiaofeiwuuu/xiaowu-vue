import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { VantResolver } from 'unplugin-vue-components/resolvers';
import { visualizer } from 'rollup-plugin-visualizer';
import zipPack from 'vite-plugin-zip-pack';
import postcsspxtorem from 'postcss-pxtorem';
import path from 'path';

// 开发环境代理：仅当配置了 PROXY_TARGET 时启用（见 .env.development）
function createProxy(env) {
  if (!env.PROXY_TARGET) return undefined;
  return {
    '/api': {
      target: env.PROXY_TARGET,
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, ''),
    },
  };
}

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
    proxy: createProxy(loadEnv(mode, process.cwd(), 'PROXY_')),
    hmr: {
      overlay: false
    }
  },
  build: {
    chunkSizeWarningLimit: 2000,
    sourcemap: false,
    rollupOptions: {
      output: {
        // 拆分第三方依赖：业务代码更新后，用户浏览器仍可命中 vendor 缓存
        manualChunks(id) {
          if (!id.includes('node_modules')) return
          if (/node_modules\/(vue|@vue|vue-router|pinia)\//.test(id)) return 'vue'
          if (/node_modules\/(vant|@vant)\//.test(id)) return 'vant'
          if (/node_modules\/axios\//.test(id)) return 'axios'
        }
      }
    }
  },
  optimizeDeps: {
    include: ['vue', 'vue-router', 'pinia', 'axios', 'vant']
  }
}));
