const fs = require("fs").promises;
const axios = require("axios");

module.exports.config = {
  name: "boxupdate",
  hasPermssion: 2,
  credits: "Liane Cagara",
  description: "Update/install the bot's box methods.",
  commandCategory: "System",
  usePrefix: true,
  usages: "[prefix]boxupdate confirm",
  cooldowns: 100,
};
const url = `https://raw.githubusercontent.com/lianecagara/BotPack-Improvements/main`;

module.exports.run = async function ({ api, event, args }) {
  try {
    const response = await axios.get(`${url}/modules/commands/boxupdate.json`);
    const { files = [] } = response.data;

    if (!files || !files.length) {
      throw new Error("No files found in the response.");
    }

    if (args[0] !== "confirm") {
      const changeList = await getChangeList(files);
      return api.sendMessage(
        `The following files will be changed/added:\n${changeList}\nTo proceed, type:\n"${event.body.split(" ")[0]} confirm"`,
        event.threadID,
        event.messageID,
      );
    }
    let result = "";

    await backupExistingFiles(files);
    await updateFiles(files);

    return api.sendMessage(
      "Files updated successfully!\n\n" + result.trim(),
      event.threadID,
      event.messageID,
    );
  } catch (error) {
    console.error("Error in boxupdate:", error.message);
    return api.sendMessage(
      "An error occurred while updating files.",
      event.threadID,
      event.messageID,
    );
  }

  async function getChangeList(files) {
    const changeList = await Promise.all(
      files.map(async (file) => {
        try {
          await fs.access(file);
          return `[CHANGED] ${file}`;
        } catch {
          return `[ADDED] ${file}`;
        }
      }),
    );

    return changeList.join("\n");
  }

  async function backupExistingFiles(files) {
    const backupFiles = [];
    for (const file of files) {
      try {
        const backup = await fs.readFile(file, "utf-8");
        const backupPath = `backup/${file}`;
        await fs.mkdir(getDir(backupPath), { recursive: true });
        await fs.writeFile(backupPath, backup);
        backupFiles.push({ file, backup });
        result += `[CREATED BACKUP] ${backupPath}\n`;
      } catch (error) {
        console.log(error);
        result += `[ERROR] ${file} => ${error.message}\n`;
      }
    }
    return backupFiles;
  }

  async function updateFiles(files) {
    for (const file of files) {
      try {
        const content = (await axios.get(`${url}/${file}`)).data;
        const dir = file.split("/").slice(0, -1).join("/");
        await fs.mkdir(dir, { recursive: true });
        await fs.writeFile(file, content);
        result += `[UPDATED] ${file}\n`;
      } catch (error) {
        console.log(error);
        result += `[ERROR] ${file} => ${error.message}\n`;
      }
    }
  }

  function getDir(filepath) {
    return filepath.split("/").slice(0, -1).join("/");
  }
};
           
