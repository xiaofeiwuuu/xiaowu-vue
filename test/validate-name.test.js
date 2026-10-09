import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateProjectName } from '../lib/validate-name.js';

test('合法名称', () => {
  for (const name of ['my-app', 'app', 'a1', 'my_app.v2']) {
    assert.equal(validateProjectName(name), true, name);
  }
});

test('拒绝路径穿越与路径分隔符', () => {
  for (const name of ['../x', '..', '.', 'a/b', 'a\\b', '/abs']) {
    assert.notEqual(validateProjectName(name), true, name);
  }
});

test('拒绝大写、空格、空值、保留名与非法开头', () => {
  for (const name of ['MyApp', 'my app', '', '  ', undefined, 'node_modules', '-app', '_app', '.hidden']) {
    assert.notEqual(validateProjectName(name), true, String(name));
  }
});
