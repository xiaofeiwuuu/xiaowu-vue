import { test } from 'node:test';
import assert from 'node:assert/strict';
import { detectPackageManager, runScriptCommand } from '../lib/package-manager.js';

test('根据 user agent 识别包管理器', () => {
  assert.equal(detectPackageManager('pnpm/9.15.4 npm/? node/v22.13.0 darwin arm64'), 'pnpm');
  assert.equal(detectPackageManager('yarn/1.22.19 npm/? node/v22.13.0'), 'yarn');
  assert.equal(detectPackageManager('bun/1.1.0'), 'bun');
  assert.equal(detectPackageManager('npm/10.9.0 node/v22.13.0'), 'npm');
});

test('无法识别时回退到 npm', () => {
  assert.equal(detectPackageManager(undefined), 'npm');
  assert.equal(detectPackageManager(''), 'npm');
});

test('npm 运行脚本需要 run', () => {
  assert.equal(runScriptCommand('npm', 'dev'), 'npm run dev');
  assert.equal(runScriptCommand('pnpm', 'dev'), 'pnpm dev');
});
