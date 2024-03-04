const fs = require('fs-extra');
const pathFile = __dirname + '/cache/autoseen.txt';

module.exports.config = {
  name: "autoseen",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Yan Maglinte",
  description: "Turn on/off automatically seen when new messages are available",
  usePrefix: true,
  commandCategory: "Admin",
  usages: "on/off",
  cooldowns: 5,
};

module.exports.handleEvent = async ({ api, event, args }) => {
if (!fs.existsSync(pathFile))
   fs.writeFileSync(pathFile, 'false');
   const isEnable = fs.readFileSync(pathFile, 'utf-8');
   if (isEnable == 'true')
     api.markAsReadAll(() => {});
};

module.exports. run = async ({ api, event, args }) => {
   try {
     if (args[0] == 'on') {
       fs.writeFileSync(pathFile, 'true');
       api.sendMessage('The autoseen function is now enabled for new messages.', event.threadID, event.messageID);
     } else if (args[0] == 'off') {
       fs.writeFileSync(pathFile, 'false');
       api.sendMessage('The autoseen function has been disabled for new messages.', event.threadID, event.messageID);
     } else {
       api.sendMessage('Incorrect syntax', event.threadID, event.messageID);
     }
   }
   catch(e) {
     console.log(e);
   }
};