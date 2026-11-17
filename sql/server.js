const http = require('http');
const { URL } = require('url');
const mysql = require('mysql2');


const server = http.createServer((req, res) => {
  // 跨域问题
  res.setHeader('Access-Control-Allow-Origin', '*');

  // 当有前端朝我发登录请求，我要后到前端传过来的账号和密码
  const query = new URL(req.url, 'http://localhost:3000').searchParams;
  console.log(query);

  // 去链接数据库，检验账号密码是否正确
  const connection = mysql.createConnection({
    host: '127.0.0.1',
    port: 3306,
    user: 'root',
    password: '12345678',
    database: 'demo',
  });
  connection.query(
    `select * from user where account="${query.get('account')}" and password="${query.get('password')}"`,
    (err, results) => {
      console.log(results);
      res.end(JSON.stringify(results));
    }
  );


});

server.listen(3000, () => {
  console.log('server is running at http://localhost:3000');
});