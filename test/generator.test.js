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

const none = { lint: false, prettier: false, i18n: false, vitest: false };
const all = { lint: true, prettier: true, i18n: true, vitest: true };

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
