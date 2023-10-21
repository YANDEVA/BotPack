const axios = require('axios');

module.exports.config = {
  name: 'ai',
  version: '1.0.5',
  hasPermssion: 0,
  credits: 'Yan Maglinte',
  description: 'An AI command!',
  usePrefix: false,
  commandCategory: 'chatbots',
  usages: 'Ai [prompt]',
  cooldowns: 5,
};

module.exports.run = async function({ api, event, args }) {
  const prompt = args.join(' ');
  api.setMessageReaction("⏱️", event.messageID, () => {}, true);
  try {
const response = await axios.post('https://api.yandes.repl.co/ai', {prompt});
    
    const data = response.data
    const output = data.reply;
    api.sendMessage(output, event.threadID, event.messageID);
    api.setMessageReaction("", event.messageID, () => {}, true);
  } catch (error) {
    api.sendMessage('⚠️ Something went wrong: ' + error, event.threadID, event.messageID);
    api.setMessageReaction("⚠️", event.messageID, () => { }, true);
  }
};