const inquirer = require('inquirer');
const generator = require('./generator');
const path = require('path');
const fs = require('fs-extra');

async function create(projectName) {
  const answers = await inquirer.prompt([
    {
      type: 'list',
      name: 'template',
      message: '请选择项目模板：',
      choices: ['JavaScript', 'TypeScript'],
      default: 'JavaScript'
    },
    {
      type: 'confirm',
      name: 'lint',
      message: '是否需要代码规范检查？',
      default: false
    },
    {
      type: 'confirm',
      name: 'prettier',
      message: '是否需要代码格式化？',
      when: (answers) => answers.lint,
      default: false
    },
    {
      type: 'confirm',
      name: 'i18n',
      message: '是否需要多语言支持？',
      default: false
    },
    {
      type: 'confirm',
      name: 'vitest',
      message: '是否需要 Vitest 单元测试？',
      default: false
    }
  ]);

  try {
    // 先生成项目
    await generator(projectName, {
      ...answers,
      language: answers.template
    });

    // 然后处理用户选择
    const targetDir = path.join(process.cwd(), projectName);
    await handleUserChoices(answers, targetDir);
  } catch (error) {
    console.error('项目创建失败：', error);
    process.exit(1);
  }
}

function processTemplateFiles(templatePath, targetPath, options) {
  // ... 其他代码

  if (options.i18n) {
    // 如果用户选择了 i18n，替换标记
    content = content
      .replace('// @i18n-import', "import i18n from './i18n'")
      .replace('// @i18n-use', 'app.use(i18n)')
  } else {
    // 如果没有选择 i18n，删除标记行
    content = content
      .replace('// @i18n-import\n', '')
      .replace('// @i18n-use\n', '')
  }

  // ... 其他代码
}

async function handleUserChoices(answers, targetDir) {
  try {
    const pkgPath = path.join(targetDir, 'package.json');
    // 确保文件存在
    if (!fs.existsSync(pkgPath)) {
      throw new Error('package.json not found');
    }

    const pkg = await fs.readJson(pkgPath);
    
    // 处理 ESLint
    if (!answers.lint) {
      delete pkg.optionalDependencies?.eslint;
      delete pkg.optionalDependencies?.['eslint-plugin-vue'];
      delete pkg.scripts?.lint;
      await fs.remove(path.join(targetDir, '.eslintrc.js')).catch(() => {});
      await fs.remove(path.join(targetDir, '.eslintignore')).catch(() => {});
    }

    // 处理 Prettier
    if (!answers.prettier) {
      delete pkg.optionalDependencies?.prettier;
      delete pkg.optionalDependencies?.['eslint-config-prettier'];
      delete pkg.optionalDependencies?.['@vue/eslint-config-prettier'];
      delete pkg.scripts?.format;
      await fs.remove(path.join(targetDir, '.prettierrc')).catch(() => {});
      await fs.remove(path.join(targetDir, '.prettierignore')).catch(() => {});
    }

    // 处理 Vitest
    if (!answers.vitest) {
      delete pkg.optionalDependencies?.vitest;
      delete pkg.optionalDependencies?.['@vitest/coverage-v8'];
      delete pkg.optionalDependencies?.['@vue/test-utils'];
      delete pkg.optionalDependencies?.jsdom;
      delete pkg.optionalDependencies?.['happy-dom'];
      delete pkg.scripts?.test;
      delete pkg.scripts?.coverage;
      await fs.remove(path.join(targetDir, 'vitest.config.js')).catch(() => {});
      await fs.remove(path.join(targetDir, 'tests')).catch(() => {});
    }

    // 保存修改后的 package.json
    await fs.writeJson(pkgPath, pkg, { spaces: 2 });

  } catch (error) {
    console.error('处理配置失败：', error);
    throw error;
  }
}

module.exports = create; 