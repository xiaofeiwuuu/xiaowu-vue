/**
 * 根据 npm_config_user_agent 判断用户当前使用的包管理器
 * （通过 pnpm dlx / npx / yarn dlx 等运行时才有），取不到则回退到 npm。
 * @param {string | undefined} userAgent
 * @returns {'pnpm' | 'yarn' | 'bun' | 'npm'}
 */
export function detectPackageManager(userAgent) {
  const name = userAgent?.split(' ')[0]?.split('/')[0];
  return ['pnpm', 'yarn', 'bun'].includes(name) ? name : 'npm';
}

/** 运行 dev 脚本的命令（npm 需要 `run`） */
export function runScriptCommand(pm, script) {
  return pm === 'npm' ? `npm run ${script}` : `${pm} ${script}`;
}
