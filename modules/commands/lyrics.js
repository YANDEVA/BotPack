module.exports.config = {
  name: "lyrics",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "LTChi",
  description: "View lyrics",
  usePrefix: true,
  commandCategory: "media",
  usages: "[name of the song]",
  cooldowns: 5
};

module.exports.run = async function ({ api, args, event }) {
  const lyricsFinder = require('lyrics-finder');
    let lyrics = await lyricsFinder(args.join(" ")) || "Not Found!";
    console.log(lyrics);
api.sendMessage(`${lyrics}`, event.threadID, event.messageID);
  api.setMessageReaction("🎼", event.messageID, (err) => {}, true)
}