// 原生 Node.js 代理服务（零依赖）
// 作用：1) 隐藏 Token，避免暴露在浏览器端  2) 解决跨域问题  3) 透传 Coze 流式 SSE 响应
const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

// ====== 配置区（请按需修改）======
const PORT = process.env.PORT || 4399; // 3000/3001 已被其他项目占用
const COZE_TOKEN = process.env.COZE_TOKEN || 'pat_fYrY2gJrmN4t412yRLOoLNsvgbWhikcBcfJT4nO4F05WSiegudxgopPZEN732zgd';
const COZE_BASE_URL = 'https://api.coze.cn';
const WORKFLOW_ID = '7702726282568761395';
// =================================

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);

  // 1. 静态文件服务
  if (req.method === 'GET' && url.pathname === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(fs.readFileSync(path.join(__dirname, 'index.html')));
    return;
  }

  // 2. 工作流代理接口：POST /api/run  body: {"input": "大闹天宫"}
  if (req.method === 'POST' && url.pathname === '/api/run') {
    let body = '';
    req.on('data', (chunk) => { body += chunk; });
    req.on('end', () => {
      let parameters = {};
      try {
        parameters = JSON.parse(body || '{}');
      } catch (_) {
        res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ error: '请求体必须是 JSON' }));
        return;
      }

      // 调用 Coze 工作流流式接口（SSE）
      const cozeReq = https.request(
        `${COZE_BASE_URL}/v1/workflow/stream_run`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${COZE_TOKEN}`,
          },
        },
        (cozeRes) => {
          if (cozeRes.statusCode !== 200) {
            console.warn(`⚠️ Coze 返回 ${cozeRes.statusCode}，请检查 Token / workflow_id 是否有效`);
          }
          // 透传 SSE 流给前端
          res.writeHead(cozeRes.statusCode, {
            'Content-Type': 'text/event-stream; charset=utf-8',
            'Cache-Control': 'no-cache',
            Connection: 'keep-alive',
            'Access-Control-Allow-Origin': '*',
          });
          cozeRes.pipe(res);
        }
      );

      cozeReq.on('error', (err) => {
        res.writeHead(502, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ error: '调用 Coze 接口失败: ' + err.message }));
      });

      cozeReq.end(
        JSON.stringify({ workflow_id: WORKFLOW_ID, parameters })
      );
    });
    return;
  }

  res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify({ error: 'Not Found' }));
});

server.listen(PORT, () => {
  console.log(`✅ 服务已启动: http://localhost:${PORT}`);
  console.log(`   工作流 ID: ${WORKFLOW_ID}`);
});
