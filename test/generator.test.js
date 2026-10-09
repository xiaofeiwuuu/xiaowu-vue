import { test, before, after, mock } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs-extra';
import os from 'node:os';
import path from 'node:path';
import generator from '../lib/generator.js';

let cwd;
before(async () => {
  // generator 会向 stdout 打印进度，会干扰 node:test 的结果通道
  mock.method(console, 'log', () => {});
  cwd = await fs.mkdtemp(path.join(os.tmpdir(), 'xiaowu-vue-test-'));
});
after(async () => {
  mock.restoreAll();
  await fs.remove(cwd);
});

const none = { lint: false, prettier: false, i18n: false, theme: false, vitest: false };
const all = { lint: true, prettier: true, i18n: true, theme: true, vitest: true };

async function walk(dir) {
  const out = [];
  for (const e of await fs.readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(full)));
    else out.push(full);
  }
  return out;
}

const read = (...p) => fs.readFile(path.join(cwd, ...p), 'utf8');
const readPkg = (name) => fs.readJson(path.join(cwd, name, 'package.json'));

test('JS 全不选：不产生任何可选功能', async () => {
  await generator('js-none', { language: 'JavaScript', ...none, cwd });
  const pkg = await readPkg('js-none');

  assert.equal(pkg.name, 'js-none');
  assert.equal(pkg.optionalDependencies, undefined);
  for (const script of ['lint', 'format', 'test', 'coverage']) {
    assert.equal(pkg.scripts[script], undefined, script);
  }
  assert.equal(await fs.pathExists(path.join(cwd, 'js-none/tsconfig.json')), false);
  assert.equal(await fs.pathExists(path.join(cwd, 'js-none/eslint.config.js')), false);
  assert.equal(await fs.pathExists(path.join(cwd, 'js-none/pnpm-lock.yaml')), false);
  // 不再整包引入 Vant 样式，也不再同时使用两套 rem 适配
  assert.equal(pkg.devDependencies['amfe-flexible'], undefined);
  assert.doesNotMatch(await read('js-none', 'src/main.js'), /vant\/lib\/index\.css|amfe-flexible/);
  assert.match(await read('js-none', 'src/main.js'), /vant\/es\/toast\/style/);
  assert.ok(await fs.pathExists(path.join(cwd, 'js-none/public/favicon.svg')));
  assert.match(await read('js-none', 'index.html'), /lang="zh-CN"/);
  // rem 适配内联在 index.html 中同步执行，不再作为模块加载
  assert.match(await read('js-none', 'index.html'), /function setRem/);
  assert.match(await read('js-none', 'index.html'), /app-loading/);
  assert.equal(await fs.pathExists(path.join(cwd, 'js-none/src/utils/rem.js')), false);
  assert.doesNotMatch(await read('js-none', 'src/main.js'), /utils\/rem/);
  assert.match(await read('js-none', '.gitignore'), /node_modules/);
  assert.doesNotMatch(await read('js-none', 'src/main.js'), /@i18n/);
});

test('TS 全选：配置、依赖、脚本齐全', async () => {
  await generator('ts-all', { language: 'TypeScript', ...all, cwd });
  const pkg = await readPkg('ts-all');

  for (const script of ['lint', 'format', 'test', 'coverage', 'type-check', 'analyze']) {
    assert.ok(pkg.scripts[script], script);
  }
  assert.ok(pkg.dependencies['vue-i18n']);
  for (const dep of ['eslint', 'prettier', 'vitest', 'typescript-eslint', 'eslint-config-prettier']) {
    assert.ok(pkg.devDependencies[dep], dep);
  }
  assert.match(await read('ts-all', 'eslint.config.js'), /no-explicit-any': 'error'/);
  assert.match(await read('ts-all', 'eslint.config.js'), /no-unused-vars': \['error', \{ ignoreRestSiblings: true \}\]/);
  assert.match(await read('ts-all', 'src/main.ts'), /import i18n from '\.\/i18n'/);
  assert.match(await read('ts-all', 'src/main.ts'), /app\.use\(i18n\)/);
});

test('TS 项目不残留任何 JS 源文件，也没有 CommonJS 配置', async () => {
  const files = (await walk(path.join(cwd, 'ts-all'))).map((f) => path.relative(cwd, f));
  const srcJs = files.filter((f) => f.startsWith('ts-all/src/') && /\.(js|cjs)$/.test(f));
  assert.deepEqual(srcJs, []);
  assert.deepEqual(files.filter((f) => f.endsWith('.cjs')), []);
  assert.equal(files.includes('ts-all/vite.config.js'), false);
});

test('JS 全选：lint 脚本不带 TS 扩展名，且没有 TS 依赖', async () => {
  await generator('js-all', { language: 'JavaScript', ...all, cwd });
  const pkg = await readPkg('js-all');

  assert.equal(pkg.scripts.lint, 'eslint src --fix');
  assert.equal(pkg.devDependencies['typescript-eslint'], undefined);
  assert.doesNotMatch(await read('js-all', 'eslint.config.js'), /no-explicit-any/);
});

test('目录已存在时抛错，且不修改其中的文件', async () => {
  const dir = path.join(cwd, 'exists');
  await fs.outputFile(path.join(dir, 'package.json'), '{"keep":true}');

  await assert.rejects(() => generator('exists', { language: 'JavaScript', ...all, cwd }), /已存在/);
  assert.equal(await fs.readFile(path.join(dir, 'package.json'), 'utf8'), '{"keep":true}');
  assert.deepEqual(await fs.readdir(dir), ['package.json']);
});

test('权限：路由守卫由 meta.requiresAuth 驱动，不再有写死的白名单', async () => {
  for (const [name, file, meta] of [
    ['js-none', 'src/router/index.js', 'src/router/metaConfig.js'],
    ['ts-all', 'src/router/index.ts', 'src/router/metaConfig.ts']
  ]) {
    const guard = await read(name, file);
    assert.match(guard, /!to\.meta\.requiresAuth/);
    assert.doesNotMatch(guard, /whiteList/);
    const metaConfig = await read(name, meta);
    assert.match(metaConfig, /requiresAuth: true/);
    assert.match(metaConfig, /PUBLIC_ROUTES/);
  }
});

test('多环境：.env / .env.development / .env.production，代理地址不带 VITE_ 前缀', async () => {
  for (const name of ['js-none', 'ts-all']) {
    for (const f of ['.env', '.env.development', '.env.production']) {
      assert.ok(await fs.pathExists(path.join(cwd, name, f)), `${name}/${f}`);
    }
    const dev = await read(name, '.env.development');
    assert.match(dev, /^PROXY_TARGET=/m);
    assert.doesNotMatch(dev, /VITE_PROXY/);
    assert.doesNotMatch(await read(name, '.env.production'), /PROXY_TARGET=/);
  }
});

test('主题：启用时生成 composable、开关组件并接入入口；未启用时不留任何痕迹', async () => {
  // 启用（ts-all / js-all 都选了 theme）
  for (const [name, ext] of [['ts-all', 'ts'], ['js-all', 'js']]) {
    assert.ok(await fs.pathExists(path.join(cwd, name, `src/composables/useTheme.${ext}`)));
    assert.ok(await fs.pathExists(path.join(cwd, name, 'src/components/ThemeSwitch.vue')));
    assert.ok(await fs.pathExists(path.join(cwd, name, 'test/theme.test.ts')));
    assert.match(await read(name, `src/main.${ext}`), /initTheme\(\)/);
    assert.match(await read(name, 'src/views/mine/index.vue'), /<theme-switch \/>/);
    const html = await read(name, 'index.html');
    assert.match(html, /van-theme-dark/);
    assert.doesNotMatch(html, /@theme:/);
  }
  // 未启用
  for (const name of ['js-none']) {
    assert.equal(await fs.pathExists(path.join(cwd, name, 'src/composables')), false);
    assert.doesNotMatch(await read(name, 'src/main.js'), /theme|Theme/);
    assert.doesNotMatch(await read(name, 'src/views/mine/index.vue'), /theme/i);
    const html = await read(name, 'index.html');
    assert.doesNotMatch(html, /van-theme-dark|@theme/);
    assert.match(html, /function setRem/); // 其他内联脚本不受影响
  }
});

test('主题：只选主题、不选 Vitest 时，不复制主题测试', async () => {
  await generator('js-theme-only', { language: 'JavaScript', ...none, theme: true, cwd });
  assert.equal(await fs.pathExists(path.join(cwd, 'js-theme-only/test')), false);
  assert.ok(await fs.pathExists(path.join(cwd, 'js-theme-only/src/composables/useTheme.js')));
});
