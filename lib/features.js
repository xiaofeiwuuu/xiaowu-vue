import fs from 'fs-extra';
import path from 'node:path';

async function patchPkg(targetDir, patch) {
  const pkgPath = path.join(targetDir, 'package.json');
  const pkg = await fs.readJson(pkgPath);
  patch(pkg);
  await fs.writeJson(pkgPath, pkg, { spaces: 2 });
}

function addDevDeps(pkg, deps) {
  pkg.devDependencies = { ...pkg.devDependencies, ...deps };
}

async function lint(targetDir, { ts, prettier }) {
  await patchPkg(targetDir, (pkg) => {
    pkg.scripts = { ...pkg.scripts, lint: 'eslint src --fix' };
    addDevDeps(pkg, {
      eslint: '^9.0.0',
      '@eslint/js': '^9.0.0',
      'eslint-plugin-vue': '^9.27.0',
      globals: '^15.0.0',
      ...(ts && { 'typescript-eslint': '^8.0.0' }),
      ...(prettier && { 'eslint-config-prettier': '^9.1.0' })
    });
  });

  // ESLint 9 flat config：纯 ESM，与 package.json 的 "type": "module" 一致
  const config = `import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import globals from 'globals'
${ts ? "import tseslint from 'typescript-eslint'\n" : ''}${
    prettier ? "import prettier from 'eslint-config-prettier'\n" : ''
  }
export default [
  { ignores: ['dist', 'node_modules', '**/*.d.ts'] },
  js.configs.recommended,
  ${ts ? '...tseslint.configs.recommended,\n  ' : ''}...pluginVue.configs['flat/essential'],
  {
    files: ['**/*.vue'],
    languageOptions: {
      ${
        ts
          ? "parserOptions: { parser: tseslint.parser }"
          : 'globals: globals.browser'
      }
    }
  },
  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.node }
    },
    rules: {
      // ref / computed / showToast 等由 unplugin-auto-import 自动导入，ESLint 无法识别
      'no-undef': 'off',
      'vue/multi-word-component-names': 'off',
      // 未使用变量只提示，不阻断
      '${ts ? '@typescript-eslint/no-unused-vars' : 'no-unused-vars'}': 'warn'${
        ts ? ",\n      // 禁止使用 any，需要时用 unknown 并收窄类型\n      '@typescript-eslint/no-explicit-any': 'error'" : ''
      }
    }
  }${prettier ? ',\n  // prettier 必须放最后，用来关闭与格式化冲突的规则\n  prettier' : ''}
]
`;
  await fs.writeFile(path.join(targetDir, 'eslint.config.js'), config);
}

async function prettier(targetDir, { ts }) {
  const extensions = ts ? 'ts,tsx,vue,scss,less' : 'js,vue,scss,less';

  await patchPkg(targetDir, (pkg) => {
    pkg.scripts = {
      ...pkg.scripts,
      format: `prettier --write "src/**/*.{${extensions}}"`
    };
    // 锁在 v2：v3 修改了 trailingComma 等默认值
    addDevDeps(pkg, { prettier: '^2.8.0' });
  });

  await fs.writeJson(
    path.join(targetDir, '.prettierrc'),
    {
      semi: false,
      singleQuote: true,
      printWidth: 100,
      trailingComma: 'none'
    },
    { spaces: 2 }
  );
  await fs.writeFile(
    path.join(targetDir, '.prettierignore'),
    'node_modules\ndist\n*.d.ts\npnpm-lock.yaml\n'
  );
}

async function vitest(targetDir, templatesDir) {
  await fs.copy(path.join(templatesDir, 'vitest'), targetDir, { overwrite: true });

  await patchPkg(targetDir, (pkg) => {
    pkg.scripts = {
      ...pkg.scripts,
      test: 'vitest',
      coverage: 'vitest run --coverage'
    };
    addDevDeps(pkg, {
      vitest: '^1.2.1',
      '@vitest/coverage-v8': '^1.2.1',
      '@vue/test-utils': '^2.4.3',
      jsdom: '^24.0.0'
    });
  });
}

export { lint, prettier, vitest };
