const express = require('express');
const https = require('https');
const cheerio = require('cheerio');

const app = express();
const port = 3000;

app.get('/api/data', (req, res) => {
  // 发起GET请求获取API数据
  https.get('https://www.zhihu.com/api/v4/columns/c_1261258401923026944/items', (response) => {
    let data = '';

    // 接收数据块并拼接
    response.on('data', (chunk) => {
      data += chunk;
    });

    // 数据接收完毕后进行处理
    response.on('end', () => {
      try {
        const jsonData = JSON.parse(data); // 解析返回的JSON数据
        const firstItem = jsonData.data[0]; // 获取第一条数据
        const content = firstItem.content; // 获取content字段

        // 使用cheerio加载HTML字符串
        const $ = cheerio.load(content);

        // 选择所有的<p>元素
        const paragraphs = $('p');

        // 遍历每个<p>元素并提取非空文本内容
        const texts = [];
        paragraphs.each((index, element) => {
          const text = $(element).text().trim();
          if (text !== '') {
            texts.push(text);
          }
        });

        // 添加当前时间和返回状态
        const result = {
          status: response.statusCode,
          timestamp: new Date().toLocaleString(),
          data: texts
        };

        // 返回结果
        res.json(result);
      } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    });
  }).on('error', (error) => {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});