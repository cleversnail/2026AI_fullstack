// 单端口服务：静态文件 + 把 /ollama/* 反向代理到本机 Ollama
// 目的：页面和 Ollama 同源，浏览器不会触发跨域检查
// 运行：node proxy.js        (默认 8080 端口，可用 PORT 环境变量覆盖)
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const PORT = Number(process.env.PORT) || 8080;
const OLLAMA = process.env.OLLAMA || 'http://127.0.0.1:11434';

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2'
};

function proxyToOllama(req, res) {
  const targetPath = req.url.slice('/ollama'.length) || '/';
  const upstream = new URL(targetPath, OLLAMA);
  // 剥掉浏览器的来源头，否则 Ollama 会按白名单返回 403
  const headers = { ...req.headers, host: upstream.host };
  delete headers.origin;
  delete headers.referer;
  const proxyReq = http.request(
    {
      hostname: upstream.hostname,
      port: upstream.port,
      path: upstream.pathname + upstream.search,
      method: req.method,
      headers
    },
    (proxyRes) => {
      res.writeHead(proxyRes.statusCode, proxyRes.headers);
      proxyRes.pipe(res);
    }
  );
  proxyReq.on('error', (err) => {
    console.error('[ollama] 代理失败:', err.message);
    if (!res.headersSent) res.writeHead(502, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Ollama 未启动或不可达: ' + err.message);
  });
  req.pipe(proxyReq);
}

function serveStatic(req, res) {
  let urlPath = decodeURIComponent(req.url.split('?')[0]);
  if (urlPath === '/') urlPath = '/index.html';
  const filePath = path.join(ROOT, path.normalize(urlPath).replace(/^(\.\.[/\\])+/, ''));
  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403);
    return res.end('Forbidden');
  }
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      return res.end('Not Found: ' + urlPath);
    }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(filePath).toLowerCase()] || 'application/octet-stream' });
    res.end(data);
  });
}

http
  .createServer((req, res) => {
    console.log(req.method, req.url);
    if (req.url.startsWith('/ollama/')) return proxyToOllama(req, res);
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      res.writeHead(405);
      return res.end('Method Not Allowed');
    }
    serveStatic(req, res);
  })
  .listen(PORT, '0.0.0.0', () => {
    console.log(`静态页面: http://127.0.0.1:${PORT}/`);
    console.log(`Ollama 代理: http://127.0.0.1:${PORT}/ollama/  ->  ${OLLAMA}`);
  });
