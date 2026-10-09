# xiaowu-vue

一个基于 Vue3 + Vant4 的移动端项目模板，采用最新的技术栈和最佳实践。

## 特性

- 📦 **技术栈**：Vue3 + Vite + Pinia + Vant4
- 📱 **移动端适配**：rem 方案（根字号由 index.html 内联脚本同步设置） (web 也是保持的 iPhone6 样式)
- 🚀 **自动化**：
  - 自动路由生成
  - VUE 组件自动导入
  - VUE API自动导入
  - Vant 组件自动导入
- 封装 request
  - 自动添加 Token：在请求头中自动添加 Authorization。
  - 请求取消：支持自动取消重复请求和手动取消所有请求。
  - 统一错误处理：可选择根据业务状态码（code）或 HTTP (status)状态码统一处理错误。
  - 请求重试：对网络错误或服务器错误（5xx）自动重试（默认仅 GET 等幂等请求）。
  - 登录过期处理：当 HTTP 状态码为 401 时，自动跳转到登录页。
  - 自定义配置：支持通过配置禁用错误提示。
- 🔒 **安全性**：
  - 登录验证
  - 加密/编码工具（仅限非安全场景）
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
| Git / 安装依赖 | 创建时可选择是否 `git init`、是否立即安装依赖（自动识别 pnpm / yarn / bun / npm） |
| 主题 / 暗黑模式 | 跟随系统或手动切换，选择保存在本地；页面颜色全部使用主题变量，首屏不闪白 |
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

| 字段 | 默认值 | 说明 |
| --- | --- | --- |
| `title` | `VITE_TITLE` | 页面标题 |
| `keepAlive` | `true` | 是否缓存页面（最多缓存 10 个，需要每次进入刷新的页面在 `onActivated` 里处理） |
| `hideTabbar` | `false` | 是否隐藏底部导航栏 |
| `requiresAuth` | `true` | 是否需要登录，未登录会弹出登录提示；**新增页面默认受保护** |

默认值和按目录的特例都在 `router/metaConfig` 中配置；无需登录的公开页面在 `PUBLIC_ROUTES` 里声明（默认只有 `home`，`auth/` 目录下的登录、注册页自动公开）。
前端的路由守卫只负责体验（跳转与提示），**不是安全边界**，真正的权限校验必须由后端完成。

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

> 失败重试：仅对网络错误和 5xx 生效。未设置 `retry` 时，GET / HEAD / OPTIONS 默认重试 3 次，POST 等非幂等请求默认不重试，避免重复提交；可按请求覆盖。
> 去重取消：同一接口且参数（`params` / `data`）完全相同的未完成请求会被取消，参数不同的并发请求互不影响。被取消的请求不会重试。

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

## 环境变量

| 文件 | 何时加载 | 用途 |
| --- | --- | --- |
| `.env` | 所有环境 | 共用变量（如 `VITE_TITLE`） |
| `.env.development` | `pnpm dev` | 开发环境：接口走 vite 代理，`PROXY_TARGET` 指向本地后端 |
| `.env.production` | `pnpm build` | 生产环境：按实际情况修改 `VITE_API_URL` |
| `.env.local` | 所有环境 | 本机私有覆盖，已被 `.gitignore` 忽略 |

- 只有以 `VITE_` 开头的变量会暴露到前端代码；`PROXY_TARGET` 只在 vite 配置中读取，不会打进产物。
- 开发时浏览器请求 `/api/xxx`，由 vite 转发到 `PROXY_TARGET` 并**去掉 `/api` 前缀**，因此没有跨域问题；生产环境请让 Nginx / 网关做同样的转发，或把 `VITE_API_URL` 改成完整地址（需后端配置 CORS）。
- 需要测试环境时，新增 `.env.staging`，并用 `vite build --mode staging` 构建。

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
# 构建生产版本（自动移除 console.log / warn / debug 与 debugger，保留 console.error）
pnpm build

# 预览构建结果
pnpm preview

# 打包体积分析（生成 stats.html，不会自动打开浏览器）
pnpm analyze
```

构建完成后会自动把 `dist/` 打包为 `dist-zip/dist.zip`，可直接上传部署。

构建时 `vue` / `vant` / `axios` 会拆分为独立的 vendor 文件，业务代码更新后用户仍可命中第三方依赖的缓存。

## 注意事项

0. 安全区（刘海屏 / Home 横条）
   - `index.html` 设置了 `viewport-fit=cover`，页面会延伸到安全区内。`common.scss` 提供 `--safe-top/right/bottom/left` 四个变量（来自 `env(safe-area-inset-*)`，不支持时为 0）
   - 底部 `Tabbar` 已自动避让；`NavBar` 由 Vant 自行处理顶部；**没有导航栏的页面**请在根节点加上 `safe-top` 类（登录、注册、我的已加）
   - 自己写的固定定位元素（如悬浮按钮、底部操作栏）请使用 `var(--safe-bottom)` 避让

0. Vant 样式
   - `<van-xxx>` 组件的样式由 `VantResolver` 自动按需引入，无需全量引入 `vant/lib/index.css`
   - `showToast` / `showDialog` / `showNotify` 等函数式组件的样式已在 `main` 中引入；用到 `showImagePreview` 等其他函数式组件时，请补充对应的 `vant/es/xxx/style`

1. 移动端适配
   - 设计稿基准宽度：375px
   - 开发时使用 px，自动转换为 rem

2. 路由配置
   - 默认开启页面缓存（`keep-alive`，最多缓存 10 个页面），需要每次进入都刷新数据的页面请在 `onActivated` 里处理
   - 自动生成的路由支持嵌套
   - 可通过元信息控制页面行为

3. 安全性
   - 登录/注册密码以明文经 HTTPS 提交，请由服务端使用 bcrypt / argon2 存储。
     前端的 MD5 / Base64 只适合缓存混淆、签名等非安全场景：前端代码和 `.env` 变量对用户完全可见，加盐 MD5 并不能保护密码
   - token 保存在 localStorage，页面一旦存在 XSS 就可能被读取；对安全要求高时请改用后端下发的 httpOnly Cookie

## 更新日志

### v1.4.0
- 路由权限由 `meta.requiresAuth` 驱动，取代写死的白名单（新增页面默认受保护）
- 多环境配置：`.env` / `.env.development` / `.env.production`，开发代理读取 `PROXY_TARGET`
- 新增可选的主题 / 暗黑模式；页面颜色改用主题变量；修复 TS 版 `NavBar` 的 `style` 未绑定导致首页标题不可见的问题
- CLI 迁移到 ESM（Node >= 18）
- ESLint / Prettier / Vitest 选项真正生效，按选择生成配置与依赖
- 目标目录已存在时中止，不再误改已有项目
- TS 模板全面禁止 `any`（ESLint `no-explicit-any` 为 error），`request` 统一为直接返回业务数据
- 修复 TS 登录流程：`request` 返回值契约前后矛盾，导致登录实际失败
- `.env` 变量与类型声明对齐（`VITE_API_URL` / `VITE_TITLE` / `VITE_SALT`），JS 模板补上 `.env`
- JS 模板补齐 `utils/common.js`、`date.js`、`validate.js`；生成项目自动带 `.gitignore`
- 生产构建移除 `console.log` / `warn` / `debug`，并自动生成 `dist-zip/dist.zip`；`pnpm analyze` 才生成体积分析且不再自动打开浏览器
- 登录/注册不再使用前端 MD5 加盐（盐值会暴露在 bundle 中，并无安全意义）
- 校验项目名称，拒绝 `../x` 等路径；可选 `git init` 与自动安装依赖，自动识别包管理器
- 新增 `LICENSE`、CLI 单元测试、端到端冒烟脚本（`pnpm smoke`）与 GitHub Actions
- 升级 Vite 5，启用 Sass modern API，消除构建时的 DEPRECATION 警告
- 性能：去掉整包 Vant 样式（CSS 约 201 KB → 83 KB）、拆分 vendor、`keep-alive` 限制 10 个页面、去掉与自研 rem 冲突的 `amfe-flexible`
- 请求：去重 key 带上参数，修复参数不同的并发请求被误取消、被取消的请求仍被重试；重试仅默认作用于幂等请求，TS 版补齐真正的重试
- 补充 `favicon.svg`，`lang` 改为 `zh-CN`；新增 `request` 行为测试
- 性能与体验：`rem` 适配改为 `index.html` 内联脚本（消除强制回流），新增首屏加载占位，补 `robots.txt` 与 meta description，登录/注册页修复对比度与链接可辨识性问题
- 安全区：Tabbar 底部、无导航栏页面顶部、横屏左右均已避让；`100vh` 改为 `100dvh`
- 暗色主题改为柔和深灰（`#121212` / `#1e1e1e`），并提亮暗色下的输入框占位文字
- 重排「我的」页，修复取消退出时的未处理 Promise 拒绝
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
