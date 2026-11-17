# Vibe Coding
概念编程

# OpenAI
大模型 ———— GPT
Agent ---- Codex


# vibeCoding一个产品步骤
企业vibeCoding 没有标准，但是有工程化


1. LLM 是有幻觉的，且没有办法消除
2. 工程师 -- 减少开发中LLM的幻觉 工程化


# 图书管理系统
1. 登录注册

 - 先打造设计稿  靠AI来干 （figma 平台做设计）

 - 创建codex的契约文件 Agents.md (必要文件)：约束规则

 - 为codex安装 figma 插件，生成设计稿的代码

## 登录注册前端

- 技术栈：React 18 + Vite + TypeScript + CSS Modules
- 样式约束：颜色、间距、字号与圆角统一定义在 `src/styles/tokens.css`
- 页面结构：`src/components/BrandPanel.tsx`、`src/components/AuthPanel.tsx`
- 已实现：登录、注册、忘记密码切换，表单校验、密码显隐、加载态与登录成功态

```sh
npm install
npm run dev
npm run lint
npm run typecheck
npm test
npm run build
```
