module.exports.config = {
  name: "video",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "CatalizCS mod video by Đăng",
  description: "Play video from YouTube",
  usePrefix: true,
  commandCategory: "music",
  usages: "video [Text]",
  cooldowns: 10,
  dependencies: {
    "@distube/ytdl-core": "",
    "simple-youtube-api": "",
    "fs-extra": "",
    "axios": ""
  },
  envConfig: {
    "YOUTUBE_API": "AIzaSyDEE1-zZSRVI8lTaQOVsIAQFgL-_BJKvhk"
  }
};

module.exports.handleReply = async function({ api, event, handleReply }) {
  const ytdl = global.nodemodule["@distube/ytdl-core"];
  const { createReadStream, createWriteStream, unlinkSync, statSync } = global.nodemodule["fs-extra"];
  ytdl.getInfo(handleReply.link[event.body - 1]).then(res => {
    let body = res.videoDetails.title;
    api.sendMessage(`Downloading Video!\n❍━━━━━━━━━━━━❍\n${body}\n❍━━━━━━━━━━━━❍\nThis may take a while!`, event.threadID, (err, info) =>
      setTimeout(() => { api.unsendMessage(info.messageID) }, 100000));
  });
  try {
    ytdl.getInfo(handleReply.link[event.body - 1]).then(res => {
      let body = res.videoDetails.title;
      ytdl(handleReply.link[event.body - 1])
        .pipe(createWriteStream(__dirname + `/cache/${handleReply.link[event.body - 1]}.mp4`))
        .on("close", () => {
          if (statSync(__dirname + `/cache/${handleReply.link[event.body - 1]}.mp4`).size > 26214400) return api.sendMessage('The file could not be sent because it is larger than 25MB.', event.threadID, () => unlinkSync(__dirname + `/cache/${handleReply.link[event.body - 1]}.mp4`), event.messageID);
          else return api.sendMessage({ body: `${body}`, attachment: createReadStream(__dirname + `/cache/${handleReply.link[event.body - 1]}.mp4`) }, event.threadID, () => unlinkSync(__dirname + `/cache/${handleReply.link[event.body - 1]}.mp4`), event.messageID)
        })
        .on("error", (error) => api.sendMessage(`There was a problem while processing the request, error: \n${error}`, event.threadID, event.messageID));
    });
  }
  catch {
    api.sendMessage("Your request could not be processed!", event.threadID, event.messageID);
  }
  return api.unsendMessage(handleReply.messageID);
}

module.exports.run = async function({ api, event, args }) {
  const ytdl = global.nodemodule["ytdl-core"];
  const YouTubeAPI = global.nodemodule["simple-youtube-api"];
  const { createReadStream, createWriteStream, unlinkSync, statSync } = global.nodemodule["fs-extra"];

  const youtube = new YouTubeAPI(global.configModule[this.config.name].YOUTUBE_API);
  const keyapi = global.configModule[this.config.name].YOUTUBE_API

  if (args.length == 0 || !args) return api.sendMessage('Search cannot be left blank!', event.threadID, event.messageID);
  const keywordSearch = args.join(" ");
  const videoPattern = /^(http(s)?:\/\/)?((w){3}.)?youtu(be|.be)?(\.com)?\/.+/gm;
  const urlValid = videoPattern.test(args[0]);

  if (urlValid) {
    try {
      var id = args[0].split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
      (id[2] !== undefined) ? id = id[2].split(/[^0-9a-z_\-]/i)[0] : id = id[0];
      ytdl(args[0])
        .pipe(createWriteStream(__dirname + `/cache/${id}.mp4`))
        .on("close", () => {
          if (statSync(__dirname + `/cache/${id}.mp4`).size > 26214400) return api.sendMessage('The file could not be sent because it is larger than 25MB.', event.threadID, () => unlinkSync(__dirname + `/cache/${id}.mp4`), event.messageID);
          else return api.sendMessage({ attachment: createReadStream(__dirname + `/cache/${id}.mp4`) }, event.threadID, () => unlinkSync(__dirname + `/cache/${id}.mp4`), event.messageID)
        })
        .on("error", (error) => api.sendMessage(`There was a problem while processing the request, error: \n${error}`, event.threadID, event.messageID));
    }
    catch {
      api.sendMessage("Your request could not be processed!", event.threadID, event.messageID);
    }

  }
  else {
    try {
      var link = [], msg = "", num = 0, numb = 0;
      var imgthumnail = [];
      var results = await youtube.searchVideos(keywordSearch, 6);
      for (let value of results) {
        if (typeof value.id == 'undefined') return;
        link.push(value.id);
        var idd = value.id;
        let datab = (await axios.get(`https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${value.id}&key=${keyapi}`)).data;
        let gettime = datab.items[0].contentDetails.duration;
        let time = (gettime.slice(2));
        /////////////////////
        let datac = (await axios.get(`https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${value.id}&key=${keyapi}`)).data;
        let channel = datac.items[0].snippet.channelTitle;
        let folderthumnail = __dirname + `/cache/${numb += 1}.png`;

        let linkthumnail = `https://img.youtube.com/vi/${value.id}/maxresdefault.jpg`;

        let getthumnail = (await axios.get(`${linkthumnail}`, { responseType: 'arraybuffer' })).data;

        fs.writeFileSync(folderthumnail, Buffer.from(getthumnail, 'utf-8'));

        imgthumnail.push(fs.createReadStream(__dirname + `/cache/${numb}.png`));
        /////=//////////////
        msg += (`${num += 1}. ${value.title}\nTime: ${time}\nChannel: ${channel}\n❍━━━━━━━━━━━━❍\n`);
      }

      var body = `There are ${link.length} results matching your search keyword:\n\n${msg}\nPlease reply(feedback) choose one of the above searches`

      return api.sendMessage({ attachment: imgthumnail, body: body }, event.threadID, (error, info) => global.client.handleReply.push({
        name: this.config.name,
        messageID: info.messageID,
        author: event.senderID,
        link
      }),
        event.messageID);

    }
    catch (error) {
      //api.sendMessage("Không thể xử lý request do dã phát sinh lỗi: " + error.message, event.threadID, event.messageID);

      const fs = global.nodemodule["fs-extra"];
      const axios = global.nodemodule["axios"];
      var link = [], msg = "", num = 0, numb = 0;
      var imgthumnail = []
      var results = await youtube.searchVideos(keywordSearch, 6);
      for (let value of results) {
        if (typeof value.id == 'undefined') return;
        link.push(value.id);
        var idd = value.id;
        let folderthumnail = __dirname + `/cache/${numb += 1}.png`;

        let linkthumnail = `https://img.youtube.com/vi/${value.id}/hqdefault.jpg`;

        let getthumnail = (await axios.get(`${linkthumnail}`, { responseType: 'arraybuffer' })).data;



        ////////////////////
        let datab = (await axios.get(`https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${value.id}&key=${keyapi}`)).data;
        let gettime = datab.items[0].contentDetails.duration;
        let time = (gettime.slice(2));
        ///////////////////
        let datac = (await axios.get(`https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${value.id}&key=${keyapi}`)).data;
        let channel = datac.items[0].snippet.channelTitle;

        fs.writeFileSync(folderthumnail, Buffer.from(getthumnail, 'utf-8'));

        imgthumnail.push(fs.createReadStream(__dirname + `/cache/${numb}.png`));
        /////=//////////////
        msg += (`${num += 1}. ${value.title}\nTime: ${time}\nChannel: ${channel}\n❍━━━━━━━━━━━━❍\n`);
      }

      var body = `There are ${link.length} results matching your search keyword:\n\n${msg}\nPlease reply(feedback) choose one of the above searches`
      return api.sendMessage({ attachment: imgthumnail, body: body }, event.threadID, (error, info) => global.client.handleReply.push({
        name: this.config.name,
        messageID: info.messageID,
        author: event.senderID,
        link
      }),
        event.messageID);
    }
  }
  for (let ii = 1; ii < 7; ii++) {
    unlinkSync(__dirname + `/cache/${ii}.png`)
  }
}