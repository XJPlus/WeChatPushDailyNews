const axios = require('axios');
const cron = require('node-cron');

// 配置参数
const config = {
  appId: 'wxaac1e64c2da09fc7', 
  appSecret: 'ed97532b3e0f53c3db4c3cba9f778c70', 
  openId: 'oLoUL6_aUygqQEhttEKbGAsmX7Gs', 
  templateId: 'JbreHByLPEelPwSpzfEUUa9B0urQ6aOxWg1ViI5mzPk',
};

// 获取 access_token
async function getAccessToken() {
  const url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${config.appId}&secret=${config.appSecret}`;
  try {
    const response = await axios.get(url);
    return response.data.access_token;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// 调用接口获取数据
async function getDate() {
  const url = `http://42.123.125.40:3000/api/data`;
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// 发送
async function sendTemplateMessage(token, config, configdate) {
  const url = `https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=${token}`;

  const data = {
    touser: config.openId,
    template_id: config.templateId,
    url: 'http://new.v60s.cn', 
    data: {
      nowDate: {
        value: configdate.data[0],
        color: '#57E6E2',
      },
      city: {
        value: '北京',
        color: '#9CA2A0',
      },
      low: {
        value: configdate.data[2],
        color: '#7CD47D',
      },
      high: {
        value: configdate.data[3],
        color: '#CBA476',
      },
      loveDate: {
        value: configdate.data[configdate.data.length-1],
        color: '#AEC5C8',
      },
    },

  };
  console.log('data=', data);
  try {
    const response = await axios.post(url, data);
    console.log('sendTemplateMessage response:', response.data);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// 调用发送模板消息函数
async function main() {
  const configdate = await getDate();
  const token = await getAccessToken();
  await sendTemplateMessage(token, config, configdate);
}

// 每天早上8点执行
cron.schedule('0 8 * * *', () => {
  main();
});