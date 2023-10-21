const fs = require("fs");

module.exports.config = {
  name: "sim",
  version: "1.1.0",
  hasPermssion: 0,
  credits: "Yan Maglinte",
  description: "Engage in conversation with Sim!",
  usePrefix: false,
  commandCategory: "chatbots",
  usages: "Chat with sim",
  cooldowns: 2,
};

/** *
Check cache/DAN/readme.md for usage instructions.
** */

module.exports.run = function ({ api, event, args }) {
  const { messageID, threadID, senderID } = event;
  const content = args.join(" ");
  if (!args[0]) return api.sendMessage("Please type a message...", threadID, messageID);

  try {
    const jsonFile = fs.readFileSync(__dirname + "/cache/DAN/dan.json", "utf-8");
    const responses = JSON.parse(jsonFile);
    let respond = responses[content.toLowerCase()];

    if (content.startsWith("add = ")) {
      const switchCase = content.substring(6).toLowerCase();
      if (!global.config.ADMINBOT.includes(senderID)) {
        respond = "You are not authorized to use the add function!";
      } else {
        if (switchCase === "on") {
          respond = "Add function activated.";
          if (typeof global.config.ADD_FUNCTION !== "undefined")
            global.config.ADD_FUNCTION = true;
          else
            console.log("Having some error on getting JSON");
        } else if (switchCase === "off") {
          respond = "Add function deactivated.";
          if (typeof global.config.ADD_FUNCTION !== "undefined")
            global.config.ADD_FUNCTION = false;
          else
            console.log("Having some error on getting JSON");
        }
      }
    } else if (content.startsWith("del = ")) {
      const switchCase = content.substring(6).toLowerCase();
      if (!global.config.ADMINBOT.includes(senderID)) {
        respond = "You are not authorized to use the delete function.";
      } else {
        if (switchCase === "on") {
          respond = "Delete function activated. You can now delete words and responses";
          if (typeof global.config.DEL_FUNCTION !== "undefined")
            global.config.DEL_FUNCTION = true;
          else
            console.log("Having some error on getting JSON");
        } else if (switchCase === "off") {
          respond = "Delete function deactivated.";
          if (typeof global.config.DEL_FUNCTION !== "undefined")
            global.config.DEL_FUNCTION = false;
          else
            console.log("Having some error on getting JSON");
        }
      }
    } else if (content.includes("=!")) {
      const [word, response] = content.split("=!").map((item) => item.trim());
      const lowercaseWord = word.toLowerCase();
      if (!global.config.DEL_FUNCTION) {
        respond = "Delete function is currently deactivated.";
      } else {
        if (responses[lowercaseWord]) {
          if (response) {
            const index = responses[lowercaseWord].indexOf(response);
            if (index !== -1) {
              responses[lowercaseWord].splice(index, 1);
              if (responses[lowercaseWord].length === 0) {
                delete responses[lowercaseWord];
              }
              fs.writeFileSync(__dirname + "/cache/DAN/dan.json", JSON.stringify(responses, null, 4), "utf-8");
              respond = `Successfully deleted the response "${response}" from the word "${word}"`;
            } else {
              respond = `The response "${response}" does not exist in the word "${word}"`;
            }
          } else {
            delete responses[lowercaseWord];
            fs.writeFileSync(__dirname + "/cache/DAN/dan.json", JSON.stringify(responses, null, 4), "utf-8");
            respond = `Successfully deleted the entire responses inside the word "${word}"`;
          }
        } else {
          respond = `The word "${word}" does not exist in the responses`;
        }
      }
    } else if (content.includes("=>")) {
      const [word, ...responseArray] = content.split("=>").map((item) => item.trim());

      const response = responseArray.join("=>").trim();
      if (!global.config.ADD_FUNCTION) {
        respond = "Add function is currently deactivated.";
      } else {
        if (word && response) {
          const lowercaseWord = word.toLowerCase();
          if (responses[lowercaseWord]) {
            if (!responses[lowercaseWord].includes(response)) {
              responses[lowercaseWord].push(response);
            }
          } else {
            responses[lowercaseWord] = [response];
          }
          fs.writeFileSync(__dirname + "/cache/DAN/dan.json", JSON.stringify(responses, null, 4), "utf-8");
          respond = `Successfully added "${word}" as a new word with the response: "${response}"`;
        }
      }
    }

    if (Array.isArray(respond)) {
      const randomIndex = Math.floor(Math.random() * respond.length);
      respond = respond[randomIndex];
    } else if (!respond) {
      respond = "ℹ️ Currently, I have no response for that yet, but you can kindly teach me. Check the current folder's cache/DAN/readme.md for usage instructions.";
    }

    api.sendMessage(respond, threadID, (error, info) => {
      if (error) {
        console.error(error);
      }
    }, messageID);
  } catch (error) {
    console.error(error);
    api.sendMessage("An error occurred while processing the request.", threadID, messageID);
  }
};
