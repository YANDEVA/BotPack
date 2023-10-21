module.exports.config = {
  name: "count",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Blue & Yan Maglinte",
  description: "Counts the number of words, paragraphs, and alphanumeric characters in a given input string.",
  usePrefix: true,
  commandCategory: "utilities",
  usages: "count words, paragraphs, and alphanumerics [input]",
  cooldowns: 5,
  dependencies: {}
};

module.exports.run = function ({ api, event, args }) {
  const inputStr = args.join(" ");
  const wordCount = inputStr.split(" ").length;
  const paragraphCount = (inputStr.match(/\n\n/g) || []).length + 1;
  const alphanumericCount = (inputStr.match(/[a-zA-Z0-9]/g) || []).length;

  api.sendMessage(`❯ There are ${wordCount} word(s), ${paragraphCount} paragraph(s), and ${alphanumericCount} alphanumeric character(s) in your input.`, event.threadID);
};
