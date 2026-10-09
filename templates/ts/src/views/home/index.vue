<template>
    <div class="home-container">
      <nav-bar 
        title="Vue3 移动端模板" 
        :show-back="false"
        background-color="var(--van-primary-color)"
      />
      
      <div class="content">
        <!-- 项目介绍卡片 -->
        <van-cell-group inset class="intro-card">
          <van-cell title="项目简介" />
          <van-cell>
            <template #title>
              <div class="intro-text">
                这是一个基于 Vue3 + Vant4 的移动端项目模板，采用最新的技术栈和最佳实践，帮助你快速开发高质量的移动端应用。
              </div>
            </template>
          </van-cell>
        </van-cell-group>
  
        <!-- 核心依赖 -->
        <van-cell-group inset class="feature-card">
          <van-cell title="核心依赖" />
          <van-cell title="Vue 3" label="渐进式 JavaScript 框架，采用 Composition API" />
          <van-cell title="Vite 5" label="下一代前端构建工具，提供极速开发体验" />
          <van-cell title="Vant 4" label="轻量、可靠的移动端组件库" />
        </van-cell-group>
  
        <!-- 项目依赖 -->
        <van-cell-group inset class="feature-card">
          <van-cell title="项目依赖" />
          <van-cell title="Vue Router 4" label="Vue.js 的官方路由管理器" />
          <van-cell title="Pinia 2" label="新一代状态管理工具，支持组合式 API" />
          <van-cell title="Axios 1" label="基于 Promise 的 HTTP 客户端" />
          <van-cell title="Sass 1" label="成熟、稳定、强大的 CSS 扩展语言" />
        </van-cell-group>
  
        <!-- 开发工具 -->
        <van-cell-group inset class="feature-card">
          <van-cell title="开发工具" />
          <van-cell title="unplugin-auto-import" label="自动导入 API，减少样板代码" />
          <van-cell title="unplugin-vue-components" label="组件自动导入，提高开发效率" />
          <van-cell title="rollup-plugin-visualizer" label="打包体积分析工具" />
          <van-cell title="ESLint + TypeScript" label="代码规范和类型检查" />
        </van-cell-group>
  
        <!-- 项目特性 -->
        <van-cell-group inset class="feature-card">
          <van-cell title="项目特性" />
          <van-cell title="自动路由" label="基于文件系统的自动路由生成" />
          <van-cell title="状态管理" label="使用 Pinia 实现高效状态管理" />
          <van-cell title="用户认证" label="完整的登录注册流程，包含 Token 管理" />
          <van-cell title="请求封装" label="基于 Axios 的请求封装，统一错误处理" />
          <van-cell title="组件封装" label="常用组件封装：NavBar、Tabbar 等" />
          <van-cell title="样式方案" label="基于 SCSS 的主题定制和样式复用" />
        </van-cell-group>
  
        <!-- 项目信息 -->
        <div class="project-info">
          <p>Version: 1.0.0</p>
          <p>Created by xiaofeiwuuu with ❤️</p>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  // TypeScript 版本 - 首页
  import NavBar from '@/components/NavBar.vue'
  </script>
  
  <style lang="scss" scoped>
  .home-container {
    min-height: 100vh;
    background-color: var(--van-background);
  
    :deep(.van-nav-bar) {
      .van-nav-bar__title {
        color: #fff;
      }
    }
  
    .content {
      padding: 16px;
    }
  
    .intro-card {
      margin-bottom: 16px;
  
      .intro-text {
        font-size: 14px;
        color: var(--app-text-secondary);
        line-height: 1.6;
        padding: 8px 0;
      }
    }
  
    .feature-card {
      margin-bottom: 16px;
  
      :deep(.van-cell__title) {
        flex: 3;
      }
  
      :deep(.van-cell__label) {
        color: var(--app-text-secondary);
        line-height: 1.4;
      }
    }
  
    .project-info {
      text-align: center;
      padding: 24px 0;
      color: var(--app-text-tertiary);
      font-size: 12px;
  
      p {
        margin: 4px 0;
      }
    }
  }
  </style> 