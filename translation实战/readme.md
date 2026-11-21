# UI 设计
1. ps (人为操作打造设计稿)
2. 蓝湖、figma、openDesign (AI 打造设计稿)

- 不同的LLM的强项是不一样的
 1. 编程能力强：claude旗下，GPT，deepseek4.1，kimi3.1，Qwen4，GLM5.3
 2. 图片生成：GPT-Image2，doubao-seed，即梦，keling

# 前端的三驾马车
1. html 主要用来打造页面的结构
2. css 主要用来调整页面中各个元素的样式
3. js 主要用来实现页面中的交互功能


# 这是一个翻译网站
1. 当用户点击翻译按钮时，我们要先获取用户输入的文本
2. 将用户输入的文本传输给LLM （远程的、本地的）
  - ollama：是一个集成环境，允许我们将LLM源码直接运行在ollama这个容器内
3. 获取到LLM 会返回翻译后的文本展示在页面上