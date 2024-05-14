module.exports.config = {
  name: "eval",
  version: "1.0.0",
  hasPermssion: 2,
  credits: "Liane Cagara",
  description: "Execute codes quickly.",
  usePrefix: true,
  commandCategory: "Admin",
  usages: "[reply or text]",
  cooldowns: 0,
  dependencies: {

  }
};

module.exports.run = async function({ api, args, event, box, Users, Threads, getText }) {
  if (!box) {
    return api.sendMessage('Unsupported Version!', event.threadID);
  }
  let code = args.join(" ");
  if (event.messageReply) {
    code = event.messageReply.body;
  }
  try {
    await eval(code);
  } catch (error) {
    await box.reply(`❌ Error: ${error.message}`);
    await box.react("❌");
    console.log(error);
  }
}
