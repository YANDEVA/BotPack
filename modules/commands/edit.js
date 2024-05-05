module.exports.config = {
  name: "edit",
  version: "1.0",
  hasPermssion: 1,
  credits: 'Yan Maglinte',
  description: `Edit Bot's messages!`,
  usePrefix: true,
  commandCategory: 'message',
  usages: 'reply to a message then type <prefix>edit <your_message>',
  cooldowns: 5,
};

module.exports.run = async function({ api, event, args, box }) {
  if (!box) {
    return api.sendMessage("❌ | Unsupported Version.", event.threadID);
  }
  const reply = event.messageReply?.body;
  const edit = `${args.join(" ")}`;
  
  if (!reply || !args || args.length === 0) {
    box.reply("❌ | Invalid input. Please reply to a bot message to edit.");
    return;
  }

  try {
    await box.edit(`${edit}`, event.messageReply.messageID);
    box.react('✅');
  } catch (error) {
    console.error("Error editing message", error);
    box.reply("❌ | An error occurred while editing the message. Please try again later.");
  }
};
