# 神话故事生成器（Coze 工作流接入示例）

纯原生实现，零依赖：前端是单个 `index.html`，后端是原生 Node.js 代理 `server.js`。

## 启动

```bash
node server.js        # 或 npm start
```

打开 http://localhost:4399 （默认端口 4399，可用 `PORT` 环境变量修改）

## 架构

```
浏览器 (index.html)
   │  POST /api/run  {"input": "大闹天宫"}
   ▼
server.js 代理（隐藏 Token、解决跨域）
   │  POST https://api.coze.cn/v1/workflow/stream_run
   ▼
Coze 工作流 7702726282568761395（SSE 流式返回）
```

## 说明

- Token 放在服务端（`server.js` 顶部，或用环境变量 `COZE_TOKEN` 覆盖），**不要**放到前端。
- 工作流最终输出为 JSON 字符串，形如 `{"audio": {"link": "...mp3"}, "text": "故事正文"}`，
  前端会自动解析：正文流式逐字展示，音频渲染为 `<audio>` 播放器。
- 如果之后改了工作流输出格式，只需调整 `index.html` 中「完成」部分的解析逻辑。
