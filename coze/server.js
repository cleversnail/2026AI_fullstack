// Coze 工作流本地代理服务器
// 用途：1) 托管前端页面  2) 代理转发流式工作流请求，规避浏览器 CORS
// 运行：node server.js （无需安装依赖）

const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

const COZE_TOKEN = process.env.COZE_TOKEN || 'pat_siqnaaB73FfDqG9ce1C5B0eLg7xcIo3Wx50ETbsgLFYkUStvqBcjUyxXQW9yDfXo';
const COZE_WORKFLOW_ID = process.env.COZE_WORKFLOW_ID || '7569786021433802806';
const COZE_BASE_URL = process.env.COZE_BASE_URL || 'https://api.coze.cn';
const PORT = process.env.PORT || 3000;

// Token 有效性预检查
if (!COZE_TOKEN || COZE_TOKEN.length < 20) {
  console.warn('⚠️  警告：COZE_TOKEN 未配置或过短，请设置有效的 Coze 访问令牌');
  console.warn('    获取地址：https://www.coze.cn/open/oauth/pats');
  console.warn('    设置方式：COZE_TOKEN=你的token node server.js');
}

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
};

function serveStatic(req, res) {
  let urlPath = decodeURIComponent(req.url.split('?')[0]);
  if (urlPath === '/') urlPath = '/index.html';
  const filePath = path.join(__dirname, urlPath);
  if (!filePath.startsWith(__dirname)) {
    res.writeHead(403); res.end('Forbidden'); return;
  }
  fs.readFile(filePath, (err, data) => {
    if (err) { res.writeHead(404); res.end('Not Found'); return; }
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
    res.end(data);
  });
}

// 代理转发流式工作流请求
function proxyWorkflowRun(req, res) {
  if (req.method !== 'POST') {
    res.writeHead(405, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Method Not Allowed' }));
    return;
  }

  let body = '';
  req.on('data', chunk => { body += chunk; });
  req.on('end', () => {
    let input = '';
    try {
      const parsed = JSON.parse(body || '{}');
      input = parsed.input || '';
    } catch (e) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Invalid JSON body' }));
      return;
    }

    const payload = JSON.stringify({
      workflow_id: COZE_WORKFLOW_ID,
      parameters: { input },
    });

    const targetUrl = new URL(COZE_BASE_URL + '/v1/workflow/stream_run');
    const options = {
      hostname: targetUrl.hostname,
      port: targetUrl.port || 443,
      path: targetUrl.pathname,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${COZE_TOKEN}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload),
        'Accept': 'text/event-stream',
      },
    };

    const upstream = targetUrl.protocol === 'https:' ? https : http;
    const proxyReq = upstream.request(options, (proxyRes) => {
      // 上游返回的不是 SSE 流（通常是 JSON 错误），转换成 SSE Error 事件
      const isSSE = (proxyRes.headers['content-type'] || '').includes('text/event-stream');
      res.writeHead(200, {
        'Content-Type': 'text/event-stream; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        'Connection': 'keep-alive',
        'X-Accel-Buffering': 'no',
      });
      if (isSSE) {
        proxyRes.pipe(res);
      } else {
        let buf = '';
        proxyRes.on('data', c => buf += c);
        proxyRes.on('end', () => {
          let msg = `请求失败 (HTTP ${proxyRes.statusCode})`;
          try { const o = JSON.parse(buf); if (o.msg) msg = o.msg; } catch(e) {}
          res.end(`id: 0\nevent: Error\ndata: {"error_code":${proxyRes.statusCode},"error_message":${JSON.stringify(msg)}}\n\n`);
        });
      }
    });

    proxyReq.on('error', (err) => {
      if (!res.headersSent) {
        res.writeHead(200, { 'Content-Type': 'text/event-stream; charset=utf-8' });
      }
      res.end(`id: 0\nevent: Error\ndata: {"error_message":${JSON.stringify('代理请求失败：' + err.message)}}\n\n`);
    });

    proxyReq.write(payload);
    proxyReq.end();
  });
}

const server = http.createServer((req, res) => {
  if (req.url.startsWith('/api/run')) {
    proxyWorkflowRun(req, res);
    return;
  }
  serveStatic(req, res);
});

server.listen(PORT, () => {
  console.log(`🌙 睡前故事服务已启动`);
  console.log(`   访问地址: http://localhost:${PORT}`);
  console.log(`   工作流 ID: ${COZE_WORKFLOW_ID}`);
});
