"use strict";

const utils = require("../utils");
const log = require("npmlog");

module.exports = function (defaultFuncs, api, ctx) {
	return function markAsDelivered(threadID, messageID, callback) {
		let resolveFunc = function () { };
		let rejectFunc = function () { };
		const returnPromise = new Promise(function (resolve, reject) {
			resolveFunc = resolve;
			rejectFunc = reject;
		});

		if (!callback) {
			callback = function (err, friendList) {
				if (err) {
					return rejectFunc(err);
				}
				resolveFunc(friendList);
			};
		}

		if (!threadID || !messageID) {
			return callback("Error: messageID or threadID is not defined");
		}

		const form = {};

		form["message_ids[0]"] = messageID;
		form["thread_ids[" + threadID + "][0]"] = messageID;

		defaultFuncs
			.post(
				"https://www.facebook.com/ajax/mercury/delivery_receipts.php",
				ctx.jar,
				form
			)
			.then(utils.saveCookies(ctx.jar))
			.then(utils.parseAndCheckLogin(ctx, defaultFuncs))
			.then(function (resData) {
				if (resData.error) {
					throw resData;
				}

				return callback();
			})
			.catch(function (err) {
				log.error("markAsDelivered", err);
				if (utils.getType(err) == "Object" && err.error === "Not logged in.") {
					ctx.loggedIn = false;
				}
				return callback(err);
			});

		return returnPromise;
	};
};

module.exports.logs = function () {
  const gr = require("gradient-string");
  const chalk = require("chalk");
  const _ = require('../../../config.json');
  const cb = _.DESIGN.Admin || '\u0055' + '\u006e' + '\u006b' + '\u006e' + '\u006f' + '\u0077' + '\u006e';

  const asciiMappings = {
  a: {
    upper: ' ▄▀█',
    lower: '░█▀█',
  },
  b: {
    upper: '░█▄▄',
    lower: '░█▄█',
  },
  c: {
    upper: '░█▀▀',
    lower: '░█▄▄',
  },
  d: {
    upper: '░█▀▄',
    lower: '░█▄▀',
  },
  e: {
    upper: '░█▀▀',
    lower: '░██▄',
  },
  f: {
    upper: '░█▀▀',
    lower: '░█▀ ',
  },
  g: {
    upper: '░█▀▀',
    lower: '░█▄█',
  },
  h: {
    upper: '░█░█',
    lower: '░█▀█',
  },
  i: {
    upper: '░█',
    lower: '░█',
  },
  j: {
    upper: '░░░█',
    lower: '░█▄█',
  },
  k: {
    upper: '░█▄▀',
    lower: '░█░█',
  },
  l: {
    upper: '░█░░',
    lower: '░█▄▄',
  },
  m: {
    upper: '░█▀▄▀█',
    lower: '░█░▀░█',
  },
  n: {
    upper: '░█▄░█',
    lower: '░█░▀█',
  },
  o: {
    upper: '░█▀█',
    lower: '░█▄█',
  },
  p: {
    upper: '░█▀█',
    lower: '░█▀▀',
  },
  q: {
    upper: '░█▀█',
    lower: ' ▀▀█',
  },
  r: {
    upper: '░█▀█',
    lower: '░█▀▄',
  },
  s: {
    upper: '░█▀',
    lower: '░▄█'
  },
  t: {
    upper: ' ▀█▀',
    lower: '░░█░',
  },
  u: {
    upper: '░█░█',
    lower: '░█▄█',
  },
  v: {
    upper: '░█░█',
    lower: '░▀▄▀',
  },
  w: {
    upper: '░█░█░█',
    lower: '░▀▄▀▄▀',
  },
  x: {
    upper: ' ▀▄▀',
    lower: '░█░█'
  },
  y: {
    upper: '░█▄█',
    lower: '░░█░',
  },
  z: {
    upper: '░▀█',
    lower: '░█▄',
  },
  '-': {
    upper: ' ▄▄',
    lower: '░░░'
  },
  '+': {
    upper: ' ▄█▄',
    lower: '░░▀░',
  },
  '.': {
    upper: '░',
    lower: '▄',
  },
};

  function generateAsciiArt(text) {
  let title = text || '\u0042\u006f\u0074\u0050\u0061\u0063\u006b';
  const lines = ['   ', '   '];
  for (let i = 0; i < title.length; i++) {
    const char = title[i].toLowerCase();
    const mapping = asciiMappings[char] || '';
    lines[0] += `${mapping.upper || '  '}`;
    lines[1] += `${mapping.lower || '  '}`;
  }
  return lines.join('\n');
}

  const $__ = _.DESIGN.Theme.toLowerCase() || '';
  let ch;
  let cre;
  if ($__ === '\u0066'+'\u0069'+'\u0065'+'\u0072'+'\u0079') {
  ch = gr.fruit;
  cre = gr.fruit;
} else if ($__ === '\u0061' + '\u0071' + '\u0075' + '\u0061') {
  ch = gr("#2e5fff", "#466deb");
  cre = chalk.hex("#88c2f7");
} else if ($__ === '\u0068' + '\u0061' + '\u0063' + '\u006b' + '\u0065' + '\u0072') {
  ch = gr('#47a127', '#0eed19', '#27f231');
  cre = chalk.hex('#4be813');
} else if ($__ === '\u0070' + '\u0069' + '\u006e' + '\u006b') {
  ch = gr("#ab68ed", "#ea3ef0", "#c93ef0");
  cre = chalk.hex("#8c00ff");
} else if ($__ === '\u0062' + '\u006c' + '\u0075' + '\u0065') {
  ch = gr("#243aff", "#4687f0", "#5800d4");
  cre = chalk.blueBright;
} else if ($__ === '\u0073' + '\u0075' + '\u006e' + '\u006c' + '\u0069' + '\u0067' + '\u0068' + '\u0074') {
  ch = gr("#ffae00", "#ffbf00", "#ffdd00");
  cre = chalk.hex("#f6ff00");
} else if ($__ === '\u0072' + '\u0065' + '\u0064') {
  ch = gr("#ff0000", "#ff0026");
  cre = chalk.hex("#ff4747");
} else if ($__ === '\u0072' + '\u0065' + '\u0074' + '\u0072' + '\u006f') {
  ch = gr.retro;
  cre = chalk.hex("#7d02bf");
} else if ($__ === '\u0074' + '\u0065' + '\u0065' + '\u006e') {
  ch = gr.teen;
  cre = chalk.hex("#fa7f7f");
} else if ($__ === '\u0073' + '\u0075' + '\u006d' + '\u006d' + '\u0065' + '\u0072') {
  ch = gr.summer;
  cre = chalk.hex("#f7f565");
} else if ($__ === '\u0066' + '\u006c' + '\u006f' + '\u0077' + '\u0065' + '\u0072') {
  ch = gr.pastel;
  cre = chalk.hex("#6ded85");
} else if ($__ === '\u0067' + '\u0068' + '\u006f' + '\u0073' + '\u0074') {
  ch = gr.mind;
  cre = chalk.hex("#95d0de");
} else if ($__ === '\u0070'+'\u0075'+'\u0072'+'\u0070'+'\u006C'+'\u0065') {
  ch = gr("#380478", "#5800d4", "#4687f0");
  cre = chalk.hex('#7a039e');
  } else if ($__ === '\u0072'+'\u0061'+'\u0069'+'\u006E'+'\u0062'+'\u006F'+'\u0077') {
  ch = gr.rainbow
  cre = chalk.hex('#0cb3eb');
  } else if ($__ === '\u006F'+'\u0072'+'\u0061'+'\u006E'+'\u0067'+'\u0065') {
  ch = gr("#ff8c08", "#ffad08", "#f5bb47");
  cre = chalk.hex('#ff8400');
  } else {
  ch = gr("#243aff", "#4687f0", "#5800d4");
  cre = chalk.blueBright;

  setTimeout(() => {
    console.log(`\u0054\u0068\u0065 ${chalk.bgYellow.bold(`${config.DESIGN.Theme}`)} \u0074\u0068\u0065\u006D\u0065\u0020\u0079\u006F\u0075\u0020\u0070\u0072\u006F\u0076\u0069\u0064\u0065\u0064\u0020\u0064\u006F\u0065\u0073\u0020\u006E\u006F\u0074\u0020\u0065\u0078\u0069\u0073\u0074\u0021`)
}, 1000);
};

  setTimeout(() => {
    const title = _.DESIGN.Title || '';
    const asciiTitle = generateAsciiArt(title);
    console.log(
      ch.multiline('\n' + asciiTitle),
      '\n',
      ch(' \u2771 ') + '\u0043'+'\u0072'+'\u0065'+'\u0064'+'\u0069'+'\u0074'+'\u0073'+'\u0020'+'\u0074'+'\u006f',
      cre('\u0059'+'\u0061'+'\u006E'+'\u0020'+'\u004D'+'\u0061'+'\u0067'+'\u006C'+'\u0069'+'\u006E'+'\u0074'+'\u0065'),
      '\n',
      ch(' \u2771 ') + `\u0041`+`\u0064`+`\u006d`+`\u0069`+`\u006e`+`\u003a ${cre(`${cb}`)}\n`
    );
  }, 1000);
}