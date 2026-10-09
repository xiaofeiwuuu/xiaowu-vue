import fs from 'fs-extra';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import chalk from 'chalk';
import * as features from './features.js';

const templatesDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../templates');

// 递归列出目录下所有文件的相对路径
async function listFiles(dir, base = dir) {
  const files = new Set();
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      for (const f of await listFiles(full, base)) files.add(f);
    } else {
      files.add(path.relative(base, full));
    }
  }
  return files;
}

const escapeRegExp = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// 启用：把标记替换为实际内容；未启用：删除标记所在的整行
async function applyMarkers(file, markers) {
  let content = await fs.readFile(file, 'utf8');
  for (const [marker, replacement, enabled] of markers) {
    content = enabled
      ? content.replace(marker, replacement)
      : content.replace(new RegExp(`^[ \\t]*${escapeRegExp(marker)}\\r?\\n`, 'm'), '');
  }
  await fs.writeFile(file, content);
}

// 处理 <!-- @name:start --> ... <!-- @name:end --> 区块：启用则只去掉标记行，未启用则整块删除
async function applyBlock(file, name, enabled) {
  const content = await fs.readFile(file, 'utf8');
  const block = new RegExp(
    `[ \\t]*<!-- @${name}:start -->\\r?\\n([\\s\\S]*?)[ \\t]*<!-- @${name}:end -->\\r?\\n`
  );
  await fs.writeFile(file, content.replace(block, enabled ? '$1' : ''));
}

/**
 * 生成项目。
 * @param {string} projectName
 * @param {{ language: 'JavaScript' | 'TypeScript', lint?: boolean, prettier?: boolean, i18n?: boolean, theme?: boolean, vitest?: boolean, cwd?: string }} options
 * @returns {Promise<string>} 项目目录的绝对路径
 */
async function generator(projectName, options) {
  const ts = options.language === 'TypeScript';
  const targetDir = path.resolve(options.cwd ?? process.cwd(), projectName);

  if (fs.existsSync(targetDir)) {
    throw new Error(`项目 ${projectName} 已存在`);
  }

  await fs.ensureDir(targetDir);

  console.log('📦 复制基础模板...');
  // TS 模板会整体覆盖同名的 .js 文件，复制 base 时直接跳过它们，避免残留重复文件
  const tsFiles = ts ? await listFiles(path.join(templatesDir, 'ts')) : new Set();
  const baseDir = path.join(templatesDir, 'base');
  await fs.copy(baseDir, targetDir, {
    filter: (src) => {
      if (!ts || !src.endsWith('.js')) return true;
      return !tsFiles.has(path.relative(baseDir, src).replace(/\.js$/, '.ts'));
    }
  });

  if (ts) {
    console.log('🔧 配置 TypeScript...');
    await fs.copy(path.join(templatesDir, 'ts'), targetDir, { overwrite: true });
  }

  if (options.i18n) {
    console.log('🌍 配置多语言支持...');
    await features.i18n(targetDir, { ts, templatesDir });
  }

  if (options.theme) {
    console.log('🌓 配置主题 / 暗黑模式...');
    await features.theme(targetDir, { ts, templatesDir, vitest: options.vitest });
  }

  // 模板里的占位标记：启用对应功能则替换为实际代码，否则整行（或整块）删除
  await applyMarkers(path.join(targetDir, `src/main.${ts ? 'ts' : 'js'}`), [
    ['// @i18n-import', "import i18n from './i18n'", options.i18n],
    ['// @i18n-use', 'app.use(i18n)', options.i18n],
    ['// @theme-import', "import { initTheme } from './composables/useTheme'", options.theme],
    ['// @theme-use', 'initTheme()', options.theme]
  ]);
  await applyMarkers(path.join(targetDir, 'src/views/mine/index.vue'), [
    ['<!-- @theme-switch -->', '<theme-switch />', options.theme]
  ]);
  await applyBlock(path.join(targetDir, 'index.html'), 'theme', options.theme);

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

  // 模板里的 .gitignore 会在 npm 发布时被丢弃，所以在这里生成
  await fs.writeFile(
    path.join(targetDir, '.gitignore'),
    ['node_modules', 'dist', 'dist-zip', '.DS_Store', '*.local', '*.log', 'stats.html', 'coverage', ''].join('\n')
  );

  const pkgPath = path.join(targetDir, 'package.json');
  const pkg = await fs.readJson(pkgPath);
  pkg.name = projectName;
  await fs.writeJson(pkgPath, pkg, { spaces: 2 });

  console.log(chalk.green(`\n✨ 项目 ${projectName} 创建成功！`));
  return targetDir;
}

export default generator;
