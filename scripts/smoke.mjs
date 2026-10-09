// 端到端冒烟测试：生成项目 → 安装依赖 → 类型检查 / lint / 测试 / 构建
// 用法：node scripts/smoke.mjs <JavaScript|TypeScript> <none|lint|all>
import { spawnSync } from 'node:child_process';
import fs from 'fs-extra';
import os from 'node:os';
import path from 'node:path';
import generator from '../lib/generator.js';

const [language = 'TypeScript', preset = 'all'] = process.argv.slice(2);
const presets = {
  none: { lint: false, prettier: false, i18n: false, vitest: false },
  lint: { lint: true, prettier: false, i18n: false, vitest: false },
  all: { lint: true, prettier: true, i18n: true, vitest: true }
};
if (!['JavaScript', 'TypeScript'].includes(language) || !presets[preset]) {
  console.error('用法：node scripts/smoke.mjs <JavaScript|TypeScript> <none|lint|all>');
  process.exit(2);
}

const options = { language, ...presets[preset] };
const cwd = await fs.mkdtemp(path.join(os.tmpdir(), 'xiaowu-vue-smoke-'));
const projectDir = await generator('smoke-app', { ...options, cwd });

function step(title, command, args) {
  console.log(`\n▶ ${title}: ${command} ${args.join(' ')}`);
  const result = spawnSync(command, args, { cwd: projectDir, stdio: 'inherit' });
  if (result.status !== 0) {
    console.error(`\n✖ 失败：${title}`);
    process.exit(1);
  }
}

step('安装依赖', 'pnpm', ['install', '--no-frozen-lockfile']);
if (language === 'TypeScript') step('类型检查', 'pnpm', ['run', 'type-check']);
if (options.lint) step('ESLint', 'pnpm', ['exec', 'eslint', 'src']);
if (options.vitest) step('单元测试', 'pnpm', ['exec', 'vitest', 'run']);
step('构建', 'pnpm', ['run', 'build']);

// 构建/类型检查不应该往 src 里写入编译产物
const stray = (await fs.readdir(path.join(projectDir, 'src'), { recursive: true })).filter((f) =>
  language === 'TypeScript' ? /\.(js|js\.map)$/.test(f) : /\.map$/.test(f)
);
if (stray.length) {
  console.error('✖ src 中出现了不应存在的产物：', stray);
  process.exit(1);
}

await fs.remove(cwd);
console.log(`\n✔ ${language} / ${preset} 冒烟测试通过`);
