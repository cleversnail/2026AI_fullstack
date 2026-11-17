import { createCrawl, createCrawlOpenAI } from 'x-crawl'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url' 
import dotenv from 'dotenv'

// 1. 先加载环境文件中的变量
dotenv.config({
  path: path.join(
    path.dirname(fileURLToPath(import.meta.url)), // 当前文件所在目录
    '.env.local'                                  // 环境变量文件
  ),
});


// 2. 创建爬虫实例（内置 Puppeteer 浏览器，用于打开网页）
const crawlApp = createCrawl();

// 3. 读取 AI 配置：优先用 .env.local 中的值，没有则降级
const apiKey = process.env['OPENAI_API_KEY']
const baseURL = process.env['OPENAI_BASE_URL']
const model = process.env['OPENAI_MODEL'] 

async function main(params) {
  const url = 'https://movie.douban.com/top250'  // 想要爬取的目标

  console.log(`打开页面：${url}`);

  // 用无头浏览器打开掘金页面  
  const res = await crawlApp.crawlPage(url)   // 启动浏览器
  const { page, browser } = res.data
  
  // console.log(page);

  // 等待页面加载完毕
  // await page.waitForSelector('.grid_view', {timeout: 20000})
  // await new Promise((r) => setTimeout(r, 2000))

  // 提取数据
  const targetHTML = await page.$eval('.grid_view', (el) => el.outerHTML)
  // console.log(targetHTML);

  const crawlOpenAIApp = createCrawlOpenAI({
    clientOptions: {apiKey, baseURL},
    defaultModel: {chatModel: model}
  })
  
  const aiRes = await crawlOpenAIApp.parseElements(
    targetHTML,
    `这是豆瓣top250的电影列表页面，需要获取每部电影的信息，使用括号内的英文作为属性名：
    - 标题（title）
    - 导演（director）
    - 评分（score）
    - 评价数（nums）
    - 电影宣传图片（pic）`
  )

  console.log(aiRes);

  await browser.close()

  // 将数据本地保存
  fs.writeFileSync('./douban_top_250.json', JSON.stringify(aiRes), 'utf-8')

}

main()
