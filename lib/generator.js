import fs from 'fs-extra';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import chalk from 'chalk';
import * as features from './features.js';

// 模板里的锁文件与实际生成的依赖不一致，不能带进用户项目
const skipLockfile = (src) => path.basename(src) !== 'pnpm-lock.yaml';

async function generator(projectName, options) {
  try {
    // 使用绝对路径
    const baseDir = process.cwd();
    if (!baseDir) {
      throw new Error('无法获取当前工作目录');
    }

    const targetDir = path.join(baseDir, projectName);
    
    // 检查目录是否存在
    if (fs.existsSync(targetDir)) {
      throw new Error(`项目 ${projectName} 已存在`);
    }

    // 创建项目目录
    await fs.ensureDir(targetDir);

    // 获取模板目录的绝对路径
    const templatesDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../templates');

    console.log('📦 复制基础模板...');
    await fs.copy(path.join(templatesDir, 'base'), targetDir, { filter: skipLockfile });

    // 优先配置 TypeScript
    if (options.language === 'TypeScript') {
      console.log('🔧 配置 TypeScript...');
      await fs.copy(path.join(templatesDir, 'ts'), targetDir, { overwrite: true, filter: skipLockfile });
      
      // 删除基础模板中的 JS 文件，避免与 TS 文件重复
      console.log('🧹 清理重复的 JavaScript 文件...');
      try {
        // 查找并删除与 .ts 文件对应的 .js 文件
        const findAndRemoveJs = async (dir) => {
          const entries = await fs.readdir(dir, { withFileTypes: true });
          
          for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);
            
            if (entry.isDirectory()) {
              // 递归处理子目录
              await findAndRemoveJs(fullPath);
            } else if (entry.name.endsWith('.ts')) {
              // 查找对应的 JS 文件
              const jsFile = fullPath.replace(/\.ts$/, '.js');
              if (fs.existsSync(jsFile)) {
                // 删除 JS 文件
                await fs.remove(jsFile);
                console.log(`  删除: ${path.relative(targetDir, jsFile)}`);
              }
            }
          }
        };
        
        await findAndRemoveJs(path.join(targetDir, 'src'));
        
        // 特别处理 index.js 文件
        const dirsToCheck = [
          'src/router',
          'src/store',
          'src/stores',
          'src/api',
          'src/utils'
        ];
        
        for (const dir of dirsToCheck) {
          const dirPath = path.join(targetDir, dir);
          if (fs.existsSync(dirPath)) {
            const jsIndexFile = path.join(dirPath, 'index.js');
            const tsIndexFile = path.join(dirPath, 'index.ts');
            
            if (fs.existsSync(jsIndexFile) && fs.existsSync(tsIndexFile)) {
              await fs.remove(jsIndexFile);
              console.log(`  删除: ${path.relative(targetDir, jsIndexFile)}`);
            }
          }
        }
        
        // 处理根目录下的配置文件
        const rootConfigFiles = [
          'vite.config',
          'vitest.config',
          'jest.config',
          'webpack.config',
          'rollup.config',
          'tsconfig',
          'babel.config',
          'postcss.config'
        ];
        
        for (const baseFileName of rootConfigFiles) {
          const jsFile = path.join(targetDir, `${baseFileName}.js`);
          const tsFile = path.join(targetDir, `${baseFileName}.ts`);
          
          if (fs.existsSync(jsFile) && fs.existsSync(tsFile)) {
            await fs.remove(jsFile);
            console.log(`  删除: ${path.relative(targetDir, jsFile)}`);
          }
        }
      } catch (err) {
        console.error(chalk.yellow('警告: 清理 JavaScript 文件失败:'), err);
      }
    }

    // 处理多语言支持
    if (options.i18n) {
      console.log('🌍 配置多语言支持...');
      try {
        // 1. 创建多语言目录结构
        const i18nDir = path.join(targetDir, 'src/i18n');
        const localesDir = path.join(i18nDir, 'locales');
        await fs.ensureDir(localesDir);

        // 2. 创建多语言文件
        // 中文语言包
        const zhContent = {
          common: {
            confirm: '确认',
            cancel: '取消',
            save: '保存',
            delete: '删除'
          },
          auth: {
            login: '登录',
            register: '注册',
            logout: '退出登录'
          }
        };
        await fs.writeJson(path.join(localesDir, 'zh.json'), zhContent, { spaces: 2 });

        // 英文语言包
        const enContent = {
          common: {
            confirm: 'Confirm',
            cancel: 'Cancel',
            save: 'Save',
            delete: 'Delete'
          },
          auth: {
            login: 'Login',
            register: 'Register',
            logout: 'Logout'
          }
        };
        await fs.writeJson(path.join(localesDir, 'en.json'), enContent, { spaces: 2 });

        // 3. 根据选择的语言创建不同格式的配置文件
        if (options.language === 'TypeScript') {
          // TypeScript 版本的类型定义和配置
          const i18nTypes = `
export interface Messages {
  common: {
    confirm: string;
    cancel: string;
    save: string;
    delete: string;
  };
  auth: {
    login: string;
    register: string;
    logout: string;
  };
}

export type Language = 'zh' | 'en';`;
          
          await fs.writeFile(path.join(i18nDir, 'types.ts'), i18nTypes);

          const i18nConfigTS = `
import { createI18n } from 'vue-i18n';
import type { Messages, Language } from './types';
import zh from './locales/zh.json';
import en from './locales/en.json';

const i18n = createI18n<[Messages], Language>({
  legacy: false,
  locale: (localStorage.getItem('language') as Language) || 'zh',
  fallbackLocale: 'zh',
  messages: {
    zh,
    en
  }
});

export default i18n;`;
          await fs.writeFile(path.join(i18nDir, 'index.ts'), i18nConfigTS);
        } else {
          // JavaScript 版本的配置
          const i18nConfigJS = `
import { createI18n } from 'vue-i18n';
import zh from './locales/zh.json';
import en from './locales/en.json';

const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem('language') || 'zh',
  fallbackLocale: 'zh',
  messages: {
    zh,
    en
  }
});

export default i18n;`;
          await fs.writeFile(path.join(i18nDir, 'index.js'), i18nConfigJS);
        }

        // 4. 修改 main 文件，添加 i18n
        const mainExt = options.language === 'TypeScript' ? 'ts' : 'js';
        const mainPath = path.join(targetDir, `src/main.${mainExt}`);
        let mainContent = await fs.readFile(mainPath, 'utf8');
        mainContent = mainContent
          .replace('// @i18n-import', "import i18n from './i18n'")
          .replace('// @i18n-use', 'app.use(i18n)');
        await fs.writeFile(mainPath, mainContent);

        // 5. 修改 package.json，添加 vue-i18n 依赖
        const pkgPath = path.join(targetDir, 'package.json');
        const pkg = await fs.readJson(pkgPath);
        pkg.dependencies['vue-i18n'] = '^9.2.0';
        await fs.writeJson(pkgPath, pkg, { spaces: 2 });

        // 6. 创建语言切换组件
        const langSwitchContent = options.language === 'TypeScript' 
          ? `
<template>
  <van-dropdown-menu>
    <van-dropdown-item v-model="currentLang" :options="options" @change="handleChange" />
  </van-dropdown-menu>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import type { Language } from '../i18n/types';

const { locale } = useI18n();
const currentLang = ref<Language>(locale.value as Language);

interface Option {
  text: string;
  value: Language;
}

const options: Option[] = [
  { text: '中文', value: 'zh' },
  { text: 'English', value: 'en' }
];

const handleChange = (value: Language): void => {
  locale.value = value;
  localStorage.setItem('language', value);
};
</script>`
          : `
<template>
  <van-dropdown-menu>
    <van-dropdown-item v-model="currentLang" :options="options" @change="handleChange" />
  </van-dropdown-menu>
</template>

<script setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

const { locale } = useI18n();
const currentLang = ref(locale.value);

const options = [
  { text: '中文', value: 'zh' },
  { text: 'English', value: 'en' }
];

const handleChange = (value) => {
  locale.value = value;
  localStorage.setItem('language', value);
};
</script>`;

        await fs.writeFile(
          path.join(targetDir, 'src/components/LanguageSwitch.vue'),
          langSwitchContent
        );

        console.log(chalk.green('✅ 多语言配置完成'));
      } catch (err) {
        console.error(chalk.yellow('警告: 配置多语言失败:'), err);
      }
    }

    // 未启用 i18n 时清除 main 文件里的占位标记
    {
      const mainPath = path.join(targetDir, `src/main.${options.language === 'TypeScript' ? 'ts' : 'js'}`);
      const main = await fs.readFile(mainPath, 'utf8');
      await fs.writeFile(mainPath, main.replace(/^\/\/ @i18n-(import|use)\r?\n/gm, ''));
    }

    const ts = options.language === 'TypeScript';

    if (options.lint) {
      console.log('🔍 配置 ESLint...');
      await features.lint(targetDir, { ts, prettier: options.prettier });
    }

    if (options.prettier) {
      console.log('💅 配置 Prettier...');
      await features.prettier(targetDir, { ts });
    }

    if (options.vitest) {
      console.log('🧪 配置单元测试...');
      await features.vitest(targetDir, templatesDir);
    }

    // 模板里的 .gitignore 会被 npm 发布时丢弃，所以在这里生成
    await fs.writeFile(
      path.join(targetDir, '.gitignore'),
      ['node_modules', 'dist', '.DS_Store', '*.local', '*.log', 'stats.html', 'coverage', ''].join('\n')
    );

    // 更新 package.json
    const pkgPath = path.join(targetDir, 'package.json');
    const pkg = await fs.readJson(pkgPath);
    pkg.name = projectName;
    await fs.writeJson(pkgPath, pkg, { spaces: 2 });

    console.log(chalk.green(`\n✨ 项目 ${projectName} 创建成功！\n`));
    console.log('👉 接下来：');
    console.log(chalk.cyan(`  cd ${projectName}`));
    console.log(chalk.cyan('  pnpm install'));
    console.log(chalk.cyan('  pnpm dev\n'));

  } catch (error) {
    console.error(chalk.red('❌ 项目创建失败：'), error);
    process.exit(1);
  }
}

export default generator;