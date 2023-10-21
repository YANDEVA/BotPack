module.exports.config = {
  name: "leave",
  eventType: ["log:unsubscribe"],
  version: "1.0.0",
  credits: "Mirai Team & Mod by Yan Maglinte", // Added canvas
  description: "Notifies bots or people leaving the group",
  dependencies: {
    "fs-extra": "",
    "path": ""
  }
};

const axios = require('axios');
const { createCanvas, loadImage, registerFont } = require('canvas');
const fs = require('fs-extra');
const path = require('path');
const jimp = require("jimp");

let backgrounds = [
  "https://i.imgur.com/MnAwD8U.jpg",
  "https://i.imgur.com/tSkuyIu.jpg"
];
let fontlink = 'https://drive.google.com/u/0/uc?id=1ZwFqYB-x6S9MjPfYm3t3SP1joohGl4iw&export=download';

module.exports.run = async function({ api, event, Users, Threads }) {
  const leftParticipantFbId = event.logMessageData.leftParticipantFbId;
  const name = global.data.userName.get(leftParticipantFbId) || await Users.getNameUser(leftParticipantFbId);
  const type = (event.author == leftParticipantFbId) ? "left by itself" : "been kicked by the administrator";
  const Yan = (event.author == leftParticipantFbId) ? "left by itself" : "has been kicked by the administrator";

  let fontPath = path.join(__dirname, "cache", "font.ttf");
  let font = (await axios.get(fontlink, { responseType: 'arraybuffer' })).data;
  fs.writeFileSync(fontPath, font);
  registerFont(fontPath, { family: 'CustomFont' });

  let randomBackground = backgrounds[Math.floor(Math.random() * backgrounds.length)];
  let background = await loadImage(randomBackground);

  let avatarUrl = `https://graph.facebook.com/${leftParticipantFbId}/picture?height=720&width=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
  let avatarPath = path.join(__dirname, "cache/leave/leave.png");
  let avatarData = (await axios.get(avatarUrl, { responseType: 'arraybuffer' })).data;
  fs.writeFileSync(avatarPath, avatarData);
  let avatar = await jimp.read(avatarPath);
  avatar.circle();
  let roundAvatar = await avatar.getBufferAsync('image/png');
  let roundAvatarImg = await loadImage(roundAvatar);

  const canvas = createCanvas(1280, 720);
  const ctx = canvas.getContext('2d');
  const yandeva = name.length > 10 ? name.slice(0, 10) + "..." : name;

  ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
  ctx.drawImage(roundAvatarImg, canvas.width / 2 - 500, canvas.height / 2 - 200, 420, 420);
  ctx.font = '100px CustomFont';
  ctx.fillStyle = '#FFF';
  ctx.fillText(yandeva, canvas.width / 2 - 60, canvas.height / 2 + 90);

  ctx.font = '40px CustomFont';
  ctx.fillText(Yan, canvas.width / 2 - 50, canvas.height / 2 + 140);

  let finalImage = canvas.toBuffer();
  fs.writeFileSync(path.join(__dirname, 'cache/leave/leave.png'), finalImage);

  const formPush = {
    body: `💥${name} has ${type} from the group`,
    attachment: fs.createReadStream(path.join(__dirname, 'cache/leave/leave.png'))
  };

  return api.sendMessage(formPush, event.threadID);
}
