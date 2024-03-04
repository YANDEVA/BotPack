const logger = require('./utils/log');
const cron = require('node-cron');

module.exports = async ({ api }) => {
  const minInterval = 5;
  let lastMessageTime = 0;
  let messagedThreads = new Set();

  const config = {
    autoRestart: {
      status: false,
      time: 40,
      note: 'To avoid problems, enable periodic bot restarts',
    },
    acceptPending: {
      status: false,
      time: 30,
      note: 'Approve waiting messages after a certain time',
    },
  };

  function autoRestart(config) {
    if (config.status) {
      cron.schedule(`*/${config.time} * * * *`, () => {
        logger.log('Start rebooting the system!', 'Auto Restart');
        process.exit(1);
      });
    }
  }

  function acceptPending(config) {
    if (config.status) {
      cron.schedule(`*/${config.time} * * * *`, async () => {
        const list = [
          ...(await api.getThreadList(1, null, ['PENDING'])),
          ...(await api.getThreadList(1, null, ['OTHER'])),
        ];
        if (list[0]) {
          api.sendMessage('You have been approved for the queue. (This is an automated message)', list[0].threadID);
        }
      });
    }
  }

  autoRestart(config.autoRestart);
  acceptPending(config.acceptPending);

  // AUTOGREET EVERY 10 MINUTES
  cron.schedule('*/10 * * * *', () => {
    const currentTime = Date.now();
    if (currentTime - lastMessageTime < minInterval) {
      console.log("Skipping message due to rate limit");
      return;
    }
    api.getThreadList(25, null, ['INBOX'], async (err, data) => {
      if (err) return console.error("Error [Thread List Cron]: " + err);
      let i = 0;
      let j = 0;

      async function message(thread) {
        try {
          api.sendMessage({
            body: `⟩ Thank you for using BotPack!\n\n⟩ Fork Here: https://replit.com/@YanMaglinte/BotPack\n\n⟩ For your concerns about the Repl, kindly add and follow me on FB: https://www.facebook.com/yandeva.me?mibextid=ZbWKwL`
          }, thread.threadID, (err) => {
            if (err) return;
            messagedThreads.add(thread.threadID);

          });
        } catch (error) {
          console.error("Error sending a message:", error);
        }
      }

      while (j < 20 && i < data.length) {
        if (data[i].isGroup && data[i].name != data[i].threadID && !messagedThreads.has(data[i].threadID)) {
          await message(data[i]);
          j++;
          const CuD = data[i].threadID;
          setTimeout(() => {
            messagedThreads.delete(CuD);
          }, 1000);
        }
        i++;
      }
    });
  }, {
    scheduled: false, // Set this to false to turn it off
    timezone: "Asia/Manila"
  });

  // AUTOGREET EVERY 30 MINUTES
  cron.schedule('*/30 * * * *', () => {
    const currentTime = Date.now();
    if (currentTime - lastMessageTime < minInterval) {
      console.log("Skipping message due to rate limit");
      return;
    }
    api.getThreadList(25, null, ['INBOX'], async (err, data) => {
      if (err) return console.error("Error [Thread List Cron]: " + err);
      let i = 0;
      let j = 0;

      async function message(thread) {
        try {
          api.sendMessage({
            body: `Hey There! How are you? ヾ(＾-＾)ノ`
          }, thread.threadID, (err) => {
            if (err) return;
            messagedThreads.add(thread.threadID);

          });
        } catch (error) {
          console.error("Error sending a message:", error);
        }
      }


      while (j < 20 && i < data.length) {
        if (data[i].isGroup && data[i].name != data[i].threadID && !messagedThreads.has(data[i].threadID)) {
          await message(data[i]);
          j++;
          const CuD = data[i].threadID;
          setTimeout(() => {
            messagedThreads.delete(CuD);
          }, 1000);
        }
        i++;
      }
    });
  }, {
    scheduled: false, // Set this to false to turn it off
    timezone: "Asia/Manila"
  });
};
