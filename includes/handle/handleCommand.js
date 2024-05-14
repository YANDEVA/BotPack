let activeCmd = false;

module.exports = function ({ api, models, Users, Threads, Currencies, ...rest }) {
  const stringSimilarity = require("string-similarity");
  const moment = require("moment-timezone");
  const logger = require("../../utils/log");

  return async function ({ event, ...rest2 }) {
    if (activeCmd) {
      return;
    }

    const dateNow = Date.now();
    const time = moment.tz("Asia/Manila").format("HH:MM:ss DD/MM/YYYY");
    const { allowInbox, PREFIX, ADMINBOT, DeveloperMode, adminOnly } = global.config;
    const { userBanned, threadBanned, threadInfo, threadData, commandBanned } = global.data;
    const { commands, cooldowns } = global.client;

    var { body, senderID, threadID, messageID } = event;
    var senderID = String(senderID),
      threadID = String(threadID);

    const threadSetting = threadData.get(threadID) || {};
    const args = (body || "").trim().split(/ +/);
    const commandName = args.shift()?.toLowerCase();
    var command = commands.get(commandName);
    const replyAD = "[ MODE ] - Only bot admin can use bot";

    if (
      command &&
      command.config.name.toLowerCase() === commandName.toLowerCase() &&
      !ADMINBOT.includes(senderID) &&
      adminOnly &&
      senderID !== api.getCurrentUserID()
    ) {
      return api.sendMessage(replyAD, threadID, messageID);
    }

    if (
      typeof body === "string" &&
      body.startsWith(PREFIX) &&
      !ADMINBOT.includes(senderID) &&
      adminOnly &&
      senderID !== api.getCurrentUserID()
    ) {
      return api.sendMessage(replyAD, threadID, messageID);
    }

    if (
      userBanned.has(senderID) ||
      threadBanned.has(threadID) ||
      (allowInbox == ![] && senderID == threadID)
    ) {
      if (!ADMINBOT.includes(senderID.toString())) {
        if (userBanned.has(senderID)) {
          const { reason, dateAdded } = userBanned.get(senderID) || {};
          return api.sendMessage(
            global.getText("handleCommand", "userBanned", reason, dateAdded),
            threadID,
            async (err, info) => {
              await new Promise((resolve) => setTimeout(resolve, 5 * 1000));
              return api.unsendMessage(info.messageID);
            },
            messageID,
          );
        } else {
          if (threadBanned.has(threadID)) {
            const { reason, dateAdded } = threadBanned.get(threadID) || {};
            return api.sendMessage(
              global.getText(
                "handleCommand",
                "threadBanned",
                reason,
                dateAdded,
              ),
              threadID,
              async (err, info) => {
                await new Promise((resolve) => setTimeout(resolve, 5 * 1000));
                return api.unsendMessage(info.messageID);
              },
              messageID,
            );
          }
        }
      }
    }

    if (commandName.startsWith(PREFIX)) {
      if (!command) {
        const allCommandName = Array.from(commands.keys());
        const checker = stringSimilarity.findBestMatch(
          commandName,
          allCommandName,
        );
        if (checker.bestMatch.rating >= 0.5) {
          command = commands.get(checker.bestMatch.target);
        } else {
          return api.sendMessage(
            global.getText(
              "handleCommand",
              "commandNotExist",
              checker.bestMatch.target,
            ),
            threadID,
          );
        }
      }
    }

    if (commandBanned.get(threadID) || commandBanned.get(senderID)) {
      if (!ADMINBOT.includes(senderID)) {
        const banThreads = commandBanned.get(threadID) || [],
          banUsers = commandBanned.get(senderID) || [];
        if (banThreads.includes(command.config.name))
          return api.sendMessage(
            global.getText(
              "handleCommand",
              "commandThreadBanned",
              command.config.name,
            ),
            threadID,
            async (err, info) => {
              await new Promise((resolve) => setTimeout(resolve, 5 * 1000));
              return api.unsendMessage(info.messageID);
            },
            messageID,
          );
        if (banUsers.includes(command.config.name))
          return api.sendMessage(
            global.getText(
              "handleCommand",
              "commandUserBanned",
              command.config.name,
            ),
            threadID,
            async (err, info) => {
              await new Promise((resolve) => setTimeout(resolve, 5 * 1000));
              return api.unsendMessage(info.messageID);
            },
            messageID,
          );
      }
    }

    if (command && command.config && command.config.usePrefix !== undefined) {
        command.config.usePrefix = command.config.usePrefix ?? true;
    }

    if (command && command.config) {
      if (
        command.config.usePrefix === false &&
        commandName.toLowerCase() !== command.config.name.toLowerCase() &&
        !command.config.allowPrefix
      ) {
        api.sendMessage(
          global.getText("handleCommand", "notMatched", command.config.name),
          event.threadID,
          event.messageID,
        );
        return;
      }
      if (command.config.usePrefix === true && !body.startsWith(PREFIX)) {
        return;
      }
    }

    if (command && command.config) {
      if (typeof command.config.usePrefix === "undefined") {
        api.sendMessage(
          global.getText("handleCommand", "noPrefix", command.config.name),
          event.threadID,
          event.messageID,
        );
        return;
      }
    }

    if (
      command &&
      command.config &&
      command.config.commandCategory &&
      command.config.commandCategory.toLowerCase() === "nsfw" &&
      !global.data.threadAllowNSFW.includes(threadID) &&
      !ADMINBOT.includes(senderID)
    )
      return api.sendMessage(
        global.getText("handleCommand", "threadNotAllowNSFW"),
        threadID,
        async (err, info) => {
          await new Promise((resolve) => setTimeout(resolve, 5 * 1000));
          return api.unsendMessage(info.messageID);
        },
        messageID,
      );

    var threadInfo2;
    if (event.isGroup == !![])
      try {
        threadInfo2 =
          threadInfo.get(threadID) || (await Threads.getInfo(threadID));
        if (Object.keys(threadInfo2).length == 0) throw new Error();
      } catch (err) {
        logger.log(
          global.getText("handleCommand", "cantGetInfoThread", "error"),
        );
      }

    var permssion = 0;
    var threadInfoo =
      threadInfo.get(threadID) || (await Threads.getInfo(threadID));
    const find = threadInfoo.adminIDs.find((el) => el.id == senderID);
    if (ADMINBOT.includes(senderID.toString())) permssion = 2;
    else if (!ADMINBOT.includes(senderID) && find) permssion = 1;
    if (
      command &&
      command.config &&
      command.config.hasPermssion &&
      command.config.hasPermssion > permssion
    ) {
      return api.sendMessage(
        global.getText(
          "handleCommand",
          "permissionNotEnough",
          command.config.name,
        ),
        event.threadID,
        event.messageID,
      );
    }

    if (
      command &&
      command.config &&
      !client.cooldowns.has(command.config.name)
    ) {
      client.cooldowns.set(command.config.name, new Map());
    }

    const timestamps =
      command && command.config
        ? client.cooldowns.get(command.config.name)
        : undefined;

    const expirationTime =
      ((command && command.config && command.config.cooldowns) || 1) * 1000;

    if (
      timestamps &&
      timestamps instanceof Map &&
      timestamps.has(senderID) &&
      dateNow < timestamps.get(senderID) + expirationTime
    )
      return api.setMessageReaction(
        "⏳",
        event.messageID,
        (err) =>
          err
            ? logger.log(
                "An error occurred while executing setMessageReaction",
                2,
              )
            : "",
        !![],
      );

    var getText2;
    if (
      command &&
      command.languages &&
      typeof command.languages === "object" &&
      command.languages.hasOwnProperty(global.config.language)
    )
      getText2 = (...values) => {
        var lang = command.languages[global.config.language][values[0]] || "";
        for (var i = values.length; i > 0x2533 + 0x1105 + -0x3638; i--) {
          const expReg = RegExp("%" + i, "g");
          lang = lang.replace(expReg, values[i]);
        }
        return lang;
      };
    else getText2 = () => {};

    try {
      const Obj = {
        ...rest,
        ...rest2,
        api: api,
        event: event,
        args: args,
        models: models,
        Users: Users,
        Threads: Threads,
        Currencies: Currencies,
        permssion: permssion,
        getText: getText2,
      };

      if (command && typeof command.run === "function") {
        command.run(Obj);
        timestamps.set(senderID, dateNow);

        if (DeveloperMode == !![]) {
          logger.log(
            global.getText(
              "handleCommand",
              "executeCommand",
              time,
              commandName,
              senderID,
              threadID,
              args.join(" "),
              Date.now() - dateNow,
            ),
            "DEV MODE",
          );
        }
        return;
      }
    } catch (e) {
      return api.sendMessage(
        global.getText("handleCommand", "commandError", commandName, e),
        threadID,
      );
    }
    activeCmd = false;
  };
};
