const fs = require('fs-extra');
const ytdl = require('@distube/ytdl-core');
const Youtube = require('youtube-search-api');
const axios = require('axios');
const convertHMS = (value) => new Date(value * 1000).toISOString().slice(11, 19);

const config = {
     name: "sing",
     version: "1.0.0",
     hasPermssion: 0,
     credits: "Mirai Team & Yan Maglinte",
     description: "Play music via YouTube link or search keyword",
     usePrefix: true,
     commandCategory: "Means",
     usages: "[searchMusic]",
     cooldowns: 0
};

const downloadMusicFromYoutube = async (link, path, itag = 249) => {
     try {
         var timestart = Date.now();
         var data = await ytdl.getInfo(link);
         var result = {
             title: data.videoDetails.title,
             dur: Number(data.videoDetails.lengthSeconds),
             viewCount: data.videoDetails.viewCount,
             likes: data.videoDetails.likes,
             author: data.videoDetails.author.name,
             timestart: timestart
         };
         return new Promise((resolve, reject) => {
             ytdl(link, {
                 filter: format => format.itag == itag
             }).pipe(fs.createWriteStream(path)).on('finish', () => {
                 resolve({
                     data: path,
                     info: result
                 });
             });
         });
     } catch (e) {
         return console.log(e);
     }
};

const handleReply = async ({ api, event, handleReply }) => {
     try {
         const path = `${__dirname}/cache/audio-${event.senderID}.mp3`;
         const { data, info } = await downloadMusicFromYoutube("https://www.youtube.com/watch?v=" + handleReply.link[event.body - 1], path);

         if (fs.statSync(data).size > 26214400) return api.sendMessage('⚠️The file could not be sent because it is larger than 25MB.', event.threadID, () => fs.unlinkSync(path), event.messageID);
         api.unsendMessage(handleReply.messageID);

         const message = {
             body: `❍━━━━━━━━━━━━❍\n🎵 Title: ${info.title}\n⏱️ Time: ${convertHMS(info.dur)}\n⏱️ Processing time: ${Math.floor((Date.now() - info.timestart) / 1000)} seconds\n❍━━━━━━━━━━━━❍`,
             attachment: fs.createReadStream(data),
         };
         return api.sendMessage(message, event.threadID, async () => {
             fs.unlinkSync(path);
         }, event.messageID);
     } catch (error) {
         console.log(error);
     }
};

const run = async function ({ api, event, args }) {
     if (!args?.length) return api.sendMessage('❯ Search cannot be empty!', event.threadID, event.messageID);

     const keywordSearch = args.join(" ");
     const path = `${__dirname}/cache/sing-${event.senderID}.mp3`;

     if (args[0]?.startsWith("https://")) {
         try {
             const { data, info } = await downloadMusicFromYoutube(args[0], path);
             const body = `❍━━━━━━━━━━━━❍\n🎵 Title: ${info.title}\n⏱️ Time: ${convertHMS(info.dur)}\n⏱️ Processing time: ${Math.floor((Date.now() - info.timestart) / 1000)} seconds\n❍━━━━━━━━━━━━❍`;

             if (fs.statSync(data).size > 26214400) {
                 return api.sendMessage('⚠️The file could not be sent because it is larger than 25MB.', event.threadID, () => fs.unlinkSync(data), event.messageID);
             }

             return api.sendMessage({ body, attachment: fs.createReadStream(data) }, event.threadID, () => fs.unlinkSync(data), event.messageID);
         } catch (e) {
             console.log(e);
         }
     } else {
         try {
             const data = (await Youtube.GetListByKeyword(keywordSearch, false, 6))?.items ?? [];
             const link = data.map(value => value?.id);
             const thumbnails = [];

             for (let i = 0; i < data.length; i++) {
                 const thumbnailUrl = `https://i.ytimg.com/vi/${data[i]?.id}/hqdefault.jpg`;
                 const thumbnailPath = `${__dirname}/cache/thumbnail-${event.senderID}-${i + 1}.jpg`;
                 const response = await axios.get(thumbnailUrl, { responseType: 'arraybuffer' });
                 fs.writeFileSync(thumbnailPath, Buffer.from(response.data, 'binary'));
                 thumbnails.push(fs.createReadStream(thumbnailPath));
             }

             const body = `There are ${link.length} results matching your search keyword:\n\n${data.map((value, index) => `❍━━━━━━━━━━━━❍\n${index + 1} - ${value?.title} (${value?.length?.simpleText})\n\n`).join('')}❯ Please reply and select one of the above searches`;

             return api.sendMessage({ attachment: thumbnails, body }, event.threadID, (error, info) => {
                 for (let i = 0; i < thumbnails.length; i++) {
                     fs.unlinkSync(`${__dirname}/cache/thumbnail-${event.senderID}-${i + 1}.jpg`);
                 }

                 global.client.handleReply.push({
                     type: 'reply',
                     name: config.name,
                     messageID: info.messageID,
                     author: event.senderID,
                     link
                 });
             }, event.messageID);
         } catch (e) {
             return api.sendMessage(`⚠️An error occurred, please try again in a moment!!\n${e}`, event.threadID, event.messageID);
         }
     }
};

module.exports = { config, run, handleReply };
