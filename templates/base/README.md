# xiaowu-vue

一个基于 Vue3 + Vant4 的移动端项目模板，采用最新的技术栈和最佳实践。

## 特性

- 📦 **技术栈**：Vue3 + Vite + Pinia + Vant4
- 📱 **移动端适配**：rem 方案（根字号由 index.html 内联脚本同步设置） (web保持 iPhone6 样式)
- 🚀 **自动化**：
  - 自动路由生成
  - 组件自动导入
  - API 自动导入
- 🔒 **安全性**：
  - 登录验证
  - Token 管理
- 🛠️ **开发体验**：
  - 打包分析
  - 开发调试
- 📦 **组件封装**：
  - NavBar 导航栏
  - Tabbar 标签栏

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

#### 特性
- 自动携带 Token
- 统一错误处理
- 请求重试
- 自动取消重复请求
- 登录失效处理

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
