# xiaowu-vue

一个基于 Vue3 + Vant4 的移动端项目模板，采用最新的技术栈和最佳实践。

## 特性

- 📦 **技术栈**：Vue3 + Vite + Pinia + Vant4
- 📱 **移动端适配**：rem 方案 (web 也是保持的 iPhone6 样式)
- 🚀 **自动化**：
  - 自动路由生成
  - VUE 组件自动导入
  - VUE API自动导入
  - Vant 组件自动导入
- 封装 request
  - 自动添加 Token：在请求头中自动添加 Authorization。
  - 请求取消：支持自动取消重复请求和手动取消所有请求。
  - 统一错误处理：可选择根据业务状态码（code）或 HTTP (status)状态码统一处理错误。
  - 请求重试：对网络错误或服务器错误（5xx）自动重试。
  - 登录过期处理：当 HTTP 状态码为 401 时，自动跳转到登录页。
  - 自定义配置：支持通过配置禁用错误提示。
- 🔒 **安全性**：
  - 登录验证
  - 多种加密
  - 路由守卫
  - Token 管理
- 🛠️ **开发体验**：
  - 打包分析
  - 开发调试
- 📦 **组件封装**：
  - NavBar 导航栏
  - Tabbar 标签栏

## 可选功能

创建项目时可按需选择，未选中的功能不会产生任何文件和依赖：

| 选项 | 内容 |
| --- | --- |
| JavaScript / TypeScript | TS 版含 `vue-tsc` 类型检查 |
| ESLint | ESLint 9 flat config（`eslint.config.js`），`pnpm lint` |
| Prettier | `.prettierrc`，`pnpm format`（需先选 ESLint，并自动接入 `eslint-config-prettier`） |
| 多语言 | `vue-i18n` + 中英文语言包 + `LanguageSwitch` 组件 |
| Vitest | `jsdom` 环境 + 示例测试，`pnpm test` / `pnpm coverage` |

> 要求 Node.js >= 18。CLI 与生成的项目均使用 ESM。

## 快速开始

### 安装

```bash
# npm
npm install -g xiaowu-vue

# yarn
yarn global add xiaowu-vue

# pnpm
pnpm add -g xiaowu-vue
```

### 创建项目

```bash
xiaowu-vue my-project
cd my-project
npm install
npm run dev
```

## 核心功能

### 1. 自动路由

#### 路由生成规则

```bash
views/
  ├── home/
  │   └── index.vue         -> /home
  ├── auth/
  │   ├── login.vue        -> /auth/login
  │   └── register.vue     -> /auth/register
  └── user/
      └── UserProfile.vue   -> /user/user-profile
```

#### 路由元信息
```javascript
{
  hideTabbar: false,  // 是否隐藏底部导航栏
  keepAlive: true,    // 是否启用页面缓存
  title: '页面标题'    // 页面标题
}
```

### 2. 请求封装

#### 基础用法
```javascript
import request from '@/utils/request'

// GET 请求
request.get('/api/users')

// POST 请求
request.post('/api/login', {
  username: 'admin',
  password: '123456'
})
```

#### 配置选项
```javascript
request.post('/api/login', data, {
  noToast: true,      // 禁用错误提示
  retry: 3,           // 请求重试次数
  retryDelay: 1000    // 重试间隔
})
```

### 3. 加密工具

#### MD5 加密
```javascript
import { encrypt, encryptWithSalt } from '@/utils/crypto'

// 基础加密
const hash = encrypt('password')

// 带盐加密
const saltedHash = encryptWithSalt('password', 'secret-key')
```

#### Base64 编码
```javascript
import { base64Encode, base64Decode } from '@/utils/crypto'

// 编码
const encoded = base64Encode('Hello World')

// 解码
const decoded = base64Decode(encoded)
```

### 4. 组件使用

#### NavBar 导航栏
```vue
<template>
  <nav-bar 
    title="页面标题"
    :show-back="true"
    background-color="#ffffff"
    @click-right="onClickRight"
  />
</template>
```

#### Tabbar 标签栏
```vue
<template>
  <van-tabbar v-model="active">
    <van-tabbar-item icon="home-o">首页</van-tabbar-item>
    <van-tabbar-item icon="user-o">我的</van-tabbar-item>
  </van-tabbar>
</template>
```

## 项目结构

```bash
src/
├── api/                # API 接口
├── assets/            # 静态资源
├── components/        # 公共组件
├── router/           # 路由配置
│   ├── autoRouter.js   # 自动路由
│   └── metaConfig.js   # 路由元信息
├── store/            # 状态管理
├── styles/           # 全局样式
├── utils/            # 工具函数
│   ├── request.js     # 请求封装
│   └── crypto.js      # 加密工具
└── views/            # 页面组件
```

## 开发指南

### 1. 新建页面
1. 在 `views` 目录创建 `.vue` 文件
2. 路由会自动生成
3. 可在 `metaConfig.js` 配置页面属性

### 2. 状态管理
```javascript
// store/modules/user.js
export const useUserStore = defineStore('user', {
  state: () => ({
    userInfo: null
  }),
  actions: {
    // ...
  }
})
```

### 3. 样式开发
```scss
// 使用 rem 函数
.container {
  width: rem(375);
  height: rem(100);
  font-size: rem(14);
}
```

## 发布部署

```bash
# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

## 注意事项

1. 移动端适配
   - 设计稿基准宽度：375px
   - 开发时使用 px，自动转换为 rem

2. 路由配置
   - 自动生成的路由支持嵌套
   - 可通过元信息控制页面行为

3. 安全性
   - 密码传输使用 MD5 加密
   - 敏感信息不要使用 Base64

## 更新日志

### v1.4.0
- CLI 迁移到 ESM（Node >= 18）
- ESLint / Prettier / Vitest 选项真正生效，按选择生成配置与依赖
- 目标目录已存在时中止，不再误改已有项目
- TS 模板全面禁止 `any`（ESLint `no-explicit-any` 为 error），`request` 统一为直接返回业务数据
- 修复 TS 登录流程：`request` 返回值契约前后矛盾，导致登录实际失败
- `.env` 变量与类型声明对齐（`VITE_API_URL` / `VITE_TITLE` / `VITE_SALT`），JS 模板补上 `.env`
- JS 模板补齐 `utils/common.js`、`date.js`、`validate.js`；生成项目自动带 `.gitignore`
- 修复 TS 模板：`vue-tsc` 版本不兼容、编译产物写入 `src/`、缺少 `terser`、`api/user.ts` 类型错误

### v1.0.0
- 初始版本发布
- 基础框架搭建
- 核心功能实现

## 贡献指南

1. Fork 本仓库
2. 创建特性分支
3. 提交代码
4. 发起 Pull Request

## 许可证

[MIT](LICENSE)
