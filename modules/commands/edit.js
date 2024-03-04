module.exports.config = {
  name: "edit",
  version: "1.0",
  hasPermssion: 0,
  credits: 'Yan Maglinte',
  description: `Edit Bot's messages!`,
  usePrefix: true,
  commandCategory: 'message',
  usages: 'reply to a message then type <prefix>edit <your_message>',
  cooldowns: 5,
};

module.exports.run = async function({ api, event, args }) {
  const reply = event.messageReply.body;
  const edit = `${args.join(" ")}`;
  
  if (!reply || !args || args.length === 0) {
    api.sendMessage("Invalid input. Please reply to a bot message to edit.", event.threadID, event.messageID);
    return;
  }

  try {
    await api.editMessage(`${edit}`, event.messageReply.messageID);
    api.setMessageReaction('✅', event.messageID, () => {}, true);
  } catch (error) {
    console.error("Error editing message", error);
    api.sendMessage("An error occurred while editing the message. Please try again later.", event.threadID);
  }
};
