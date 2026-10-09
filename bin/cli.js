#!/usr/bin/env node

import { readFileSync } from 'node:fs';
import { program } from 'commander';
import create from '../lib/create.js';

const { version } = JSON.parse(
  readFileSync(new URL('../package.json', import.meta.url), 'utf8')
);

program
  .version(version)
  .arguments('<project-name>')
  .description('创建新项目')
  .action((projectName) => {
    create(projectName);
  });

program.parse(process.argv);
