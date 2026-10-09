import { spawnSync } from 'node:child_process';
import inquirer from 'inquirer';
import chalk from 'chalk';
import path from 'node:path';
import fs from 'fs-extra';
import generator from './generator.js';
import { validateProjectName } from './validate-name.js';
import { detectPackageManager, runScriptCommand } from './package-manager.js';

function run(command, args, cwd, options = {}) {
  return spawnSync(command, args, { cwd, shell: process.platform === 'win32', ...options });
}

function initGit(targetDir) {
  // 已经在某个 git 仓库内（如 monorepo）时不再嵌套初始化
  const inside = run('git', ['rev-parse', '--is-inside-work-tree'], targetDir, { stdio: 'ignore' });
  if (inside.status === 0) return;

  const result = run('git', ['init', '-q'], targetDir, { stdio: 'ignore' });
  if (result.status !== 0) {
    console.log(chalk.yellow('⚠️  git init 失败（是否已安装 git？），已跳过'));
  } else {
    console.log('🌱 已初始化 Git 仓库');
  }
}

async function create(projectName) {
  const nameResult = validateProjectName(projectName);
  if (nameResult !== true) {
    console.error(chalk.red(nameResult));
    process.exit(1);
  }

  // 在提问前就检查，避免用户答完问题才发现目录已存在
  if (fs.existsSync(path.join(process.cwd(), projectName))) {
    console.error(chalk.red(`项目 ${projectName} 已存在，请换一个名称或先删除该目录`));
    process.exit(1);
  }

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
      name: 'theme',
      message: '是否需要主题 / 暗黑模式？',
      default: false
    },
    {
      type: 'confirm',
      name: 'vitest',
      message: '是否需要 Vitest 单元测试？',
      default: false
    },
    {
      type: 'confirm',
      name: 'git',
      message: '是否初始化 Git 仓库？',
      default: true
    },
    {
      type: 'confirm',
      name: 'install',
      message: '是否立即安装依赖？',
      default: false
    }
  ]);

  try {
    const targetDir = await generator(projectName, {
      ...answers,
      language: answers.template
    });

    const pm = detectPackageManager(process.env.npm_config_user_agent);

    if (answers.git) initGit(targetDir);

    let installed = false;
    if (answers.install) {
      console.log(`\n📥 使用 ${pm} 安装依赖...\n`);
      installed = run(pm, ['install'], targetDir, { stdio: 'inherit' }).status === 0;
      if (!installed) console.log(chalk.yellow('⚠️  依赖安装失败，请稍后手动安装'));
    }

    console.log('\n👉 接下来：');
    console.log(chalk.cyan(`  cd ${projectName}`));
    if (!installed) console.log(chalk.cyan(`  ${pm} install`));
    console.log(chalk.cyan(`  ${runScriptCommand(pm, 'dev')}\n`));
  } catch (error) {
    console.error('项目创建失败：', error);
    process.exit(1);
  }
}

export default create;
