import inquirer from 'inquirer';
import path from 'node:path';
import fs from 'fs-extra';
import generator from './generator.js';

async function create(projectName) {
  // 在提问前就检查，避免用户答完问题才发现目录已存在
  if (fs.existsSync(path.join(process.cwd(), projectName))) {
    console.error(`项目 ${projectName} 已存在，请换一个名称或先删除该目录`);
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
      name: 'vitest',
      message: '是否需要 Vitest 单元测试？',
      default: false
    }
  ]);

  try {
    await generator(projectName, {
      ...answers,
      language: answers.template
    });
  } catch (error) {
    console.error('项目创建失败：', error);
    process.exit(1);
  }
}

export default create;
