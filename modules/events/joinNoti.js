module.exports.config = {
  name: "join",
  eventType: ['log:subscribe'],
  version: "1.0.0",
  credits: "Mirai-Team", // FIXED BY YAN MAGLINTE
  description: "GROUP UPDATE NOTIFICATION"
};

const ADMIN = 'YOUR_NAME';
const FB_LINK = 'YOUR_FACEBOOK_LINK';

const fs = require('fs-extra');
const { loadImage, createCanvas, registerFont } = require("canvas");
const request = require('request');
//const { join } = require('path');
const axios = require('axios');
const jimp = require("jimp")
const fontlink = 'https://drive.google.com/u/0/uc?id=1ZwFqYB-x6S9MjPfYm3t3SP1joohGl4iw&export=download'
let PRFX = `${global.config.PREFIX}`;

module.exports.circle = async (image) => {
  image = await jimp.read(image);
  image.circle();
  return await image.getBufferAsync("image/png");
}

let suffix;

module.exports.run = async function({ api, event, Users }) {
  var fullYear = global.client.getTime("fullYear");
  var getHours = await global.client.getTime("hours");
  var session = `${getHours < 3 ? "midnight" : getHours < 8 ? "Early morning" : getHours < 12 ? "noon" : getHours < 17 ? "afternoon" : getHours < 23 ? "evening" : "midnight"}`
  const moment = require("moment-timezone");
  var thu = moment.tz('Asia/Manila').format('dddd');
  if (thu == 'Sunday') thu = 'Sunday'
  if (thu == 'Monday') thu = 'Monday'
  if (thu == 'Tuesday') thu = 'Tuesday'
  if (thu == 'Wednesday') thu = 'Wednesday'
  if (thu == "Thursday") thu = 'Thursday'
  if (thu == 'Friday') thu = 'Friday'
  if (thu == 'Saturday') thu = 'Saturday'
  const time = moment.tz("Asia/Manila").format("HH:mm:ss - DD/MM/YYYY");
  const hours = moment.tz("Asia/Manila").format("HH");
  const { commands } = global.client;
  const { threadID } = event;
  let threadInfo = await api.getThreadInfo(event.threadID);
  let threadName = threadInfo.threadName;
  if (!event.logMessageData.addedParticipants || !Array.isArray(event.logMessageData.addedParticipants)) {
    return;
  }
  if (event.logMessageData.addedParticipants && Array.isArray(event.logMessageData.addedParticipants) && event.logMessageData.addedParticipants.some(i => i.userFbId == api.getCurrentUserID())) {
    //api.changeNickname(`𝗕𝗢𝗧 ${(!global.config.BOTNAME) ? "Buddy" : global.config.BOTNAME}`, threadID, api.getCurrentUserID());
    
    let gifUrl = 'https://i.imgur.com/4HMupHz.gif';
let gifPath = __dirname + '/cache/join/join.gif';

axios.get(gifUrl, { responseType: 'arraybuffer' })
.then(response => {
    fs.writeFileSync(gifPath, response.data);
    return api.sendMessage("Hey There!", event.threadID, () => api.sendMessage({ body: `✅ Group Connection in ${threadName} at ${session} success! \n\n➭ Current Commands: ${commands.size}\n➭ Bot Prefix: ${global.config.PREFIX}\n➭ Version: ${global.config.version}\n➭ Admin: ‹${ADMIN}›\n➭ Facebook: ‹${FB_LINK}›\n➭ Use ${PRFX}help to view command details\n➭ Added bot at: ⟨ ${time} ⟩〈 ${thu} 〉`, attachment: fs.createReadStream(gifPath)}, threadID));
})
.catch(error => {
    console.error(error);
});
  }
  else {
    try {
      if (!fs.existsSync(__dirname + `/cache/font/Semi.ttf`)) {
        let getfont = (await axios.get(fontlink, { responseType: "arraybuffer" })).data;
        fs.writeFileSync(__dirname + `/cache/font/Semi.ttf`, Buffer.from(getfont, "utf-8"));
      };
      const { createReadStream, existsSync, mkdirSync, readdirSync } = global.nodemodule["fs-extra"];
      let { threadName, participantIDs } = await api.getThreadInfo(threadID);
      const threadData = global.data.threadData.get(parseInt(threadID)) || {};
      var mentions = [], nameArray = [], memLength = [], iduser = [], i = 0;
      var abx = [];
      for (id in event.logMessageData.addedParticipants) {
        const userName = event.logMessageData.addedParticipants[id].fullName; iduser.push(event.logMessageData.addedParticipants[id].userFbId.toString());
        nameArray.push(userName);
        mentions.push({ tag: userName, id: event.senderID });
        memLength.push(participantIDs.length - i++);
        console.log(userName)
      }
      // console.log(event.logMessageData.addedParticipants)
      var id = [];
      for (let o = 0; o < event.logMessageData.addedParticipants.length; o++) {
        let pathImg = __dirname + `/cache/join/${o}.png`;
        let pathAva = __dirname + `/cache/join/avt.png`;
        let avtAnime = (await axios.get(encodeURI(
          `https://graph.facebook.com/${event.logMessageData.addedParticipants[o].userFbId}/picture?height=720&width=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`), { responseType: "arraybuffer" })).data;
        var ok = [
          'https://i.imgur.com/dDSh0wc.jpeg',
          'https://i.imgur.com/UucSRWJ.jpeg',
          'https://i.imgur.com/OYzHKNE.jpeg',
          'https://i.imgur.com/V5L9dPi.jpeg',
          'https://i.imgur.com/M7HEAMA.jpeg'
        ]
        let background = (await axios.get(encodeURI(`${ok[Math.floor(Math.random() * ok.length)]}`), { responseType: "arraybuffer", })).data;
        fs.writeFileSync(pathAva, Buffer.from(avtAnime, "utf-8"));
        fs.writeFileSync(pathImg, Buffer.from(background, "utf-8"));
        var avatar = await this.circle(pathAva);
        let baseImage = await loadImage(pathImg);
        let baseAva = await loadImage(avatar);
        registerFont(__dirname + `/cache/font/Semi.ttf`, {
          family: "Semi"
        });
        let canvas = createCanvas(1902, 1082);
        console.log(canvas.width, canvas.height)
        let ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
        ctx.drawImage(baseAva, canvas.width / 2 - 188, canvas.height / 2 - 375, 375, 355);
        ctx.fillStyle = "#FFF";
        ctx.textAlign = "center";
        ctx.font = `155px Semi`;
        ctx.fillText(`${event.logMessageData.addedParticipants[o].fullName}`, canvas.width / 2 + 20, canvas.height / 2 + 100);
        ctx.save();
        ctx.font = `75px Semi`;
        ctx.fillText(`Welcome to ${threadName}`, canvas.width / 2 - 15, canvas.height / 2 + 235)
        const number = participantIDs.length - o;

        if (number === 11 || number === 12 || number === 13) {
          suffix = "th";
        } else {
          const lastDigit = number % 10;
          switch (lastDigit) {
            case 1:
              suffix = "st";
              break;
            case 2:
              suffix = "nd";
              break;
            case 3:
              suffix = "rd";
              break;
            default:
              suffix = "th";
              break;
          }
        }

        ctx.fillText(`You are the ${number}${suffix} member of this group`, canvas.width / 2 - 15, canvas.height / 2 + 350);
        ctx.restore();
        const imageBuffer = canvas.toBuffer();
        fs.writeFileSync(pathImg, imageBuffer);
        abx.push(fs.createReadStream(__dirname + `/cache/join/${o}.png`))
      }
      memLength.sort((a, b) => a - b);
      (typeof threadData.customJoin == "undefined") ? msg = `🌟 Welcome new member {name} to the group {threadName}\n→ URL Profile:\nhttps://www.facebook.com/profile.php?id={iduser}\n→ {type} are the group's {soThanhVien}${suffix} member\n→ Added to the group by: {author}\n→ Added by facebook link: https://www.facebook.com/profile.php?id={uidAuthor}\n─────────────────\n[ {time} - {thu} ]` : msg = threadData.customJoin;
      var nameAuthor = await Users.getNameUser(event.author)
      msg = msg
        .replace(/\{iduser}/g, iduser.join(', '))
        .replace(/\{name}/g, nameArray.join(', '))
        .replace(/\{type}/g, (memLength.length > 1) ? 'You' : 'You')
        .replace(/\{soThanhVien}/g, memLength.join(', '))
        .replace(/\{threadName}/g, threadName)
        .replace(/\{author}/g, nameAuthor)
        .replace(/\{uidAuthor}/g, event.author)
        .replace(/\{buoi}/g, session)
        .replace(/\{time}/g, time)
        .replace(/\{thu}/g, thu);

      var formPush = { body: msg, attachment: abx, mentions }
      api.sendMessage(formPush, threadID);
      for (let ii = 0; ii < parseInt(id.length); ii++) {
        fs.unlinkSync(__dirname + `/cache/join/${ii}.png`)
      }
    } catch (e) { return console.log(e) };
  }
}