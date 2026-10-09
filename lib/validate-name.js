const RESERVED = new Set(['node_modules', 'favicon.ico']);

/**
 * 校验项目名称，同时作为目录名和 npm 包名使用。
 * 不允许路径分隔符，避免在当前目录之外创建文件。
 * @param {string} name
 * @returns {true | string} 合法返回 true，否则返回错误提示
 */
export function validateProjectName(name) {
  if (!name || !name.trim()) return '项目名称不能为空';
  if (name.length > 214) return '项目名称不能超过 214 个字符';
  if (RESERVED.has(name)) return `"${name}" 是保留名称，请换一个`;
  if (!/^[a-z0-9][a-z0-9._-]*$/.test(name)) {
    return '项目名称只能包含小写字母、数字、-、_、.，且必须以字母或数字开头（不能包含 / 或 ..）';
  }
  return true;
}
