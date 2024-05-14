const { origin } = require("fontstyles");
const chalk = require("chalk");

module.exports.config = {
  name: "unfont",
  version: "1.0.0",
  hasPermssion: 1,
  credits: "Yan Maglinte",
  description: "Removes the bot's message's font by reacting to the bot's message",
  usePrefix: true,
  commandCategory: "message",
  cooldowns: 2,
};

module.exports.run = function ({ api, event }) {
  const botID = api.getCurrentUserID();

  try {
    if (event.type == "message_reaction" && botID === event.senderID) {
      if (event.reaction == "👍") {
        api.getMessage(event.threadID, event.messageID, (err, data) => {
          if (!err) {
            console.log(
              chalk.yellow("Removed font for messageID:", data.messageID),
            );
            const results = data.body;
            api.editMessage(origin(results), event.messageID);
          }
        });
      }
    }
  } catch (error) {
    console.log("An error occurred:", error);
  }
};
