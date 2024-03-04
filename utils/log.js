const chalk = require('chalk');
const gradient = require('gradient-string');
const con = require('./../config.json');

function getThemeColors() {
  const theme = con.DESIGN.Theme;
  let co, cra, error, cb, cv;
  
  switch (theme.toLowerCase()) {
    case 'blue':
      cra = gradient('yellow', 'lime', 'green');
      co = gradient("#243aff", "#4687f0", "#5800d4");
      cb = chalk.blueBright;
      cv = chalk.bold.hex("#3467eb");
      error = chalk.red.bold;
      break;
    case 'fiery':
      cra = gradient('orange', 'orange', 'yellow');
      co = gradient("#fc2803", "#fc6f03", "#fcba03");
      cb = chalk.hex("#fff308");
      cv = chalk.bold.hex("#fc3205");
      error = chalk.red.bold;
      break;
    case 'red':
      cra = gradient('yellow', 'lime', 'green');
      co = gradient("red", "orange");
      cb = chalk.hex("#ff0000");
      cv = chalk.bold.hex("#ff0000");
      error = chalk.red.bold;
      break;
    case 'aqua':
      cra = gradient("#6883f7", "#8b9ff7", "#b1bffc")
      co = gradient("#0030ff", "#4e6cf2");
      cb = chalk.hex("#3056ff");
      cv = chalk.bold.hex("#0332ff");
      error = chalk.blueBright;
      break;
    case 'pink':
      cra = gradient('purple', 'pink');
      co = gradient("#d94fff", "purple");
      cb = chalk.hex("#6a00e3");
      cv = chalk.bold.hex("#6a00e3");
      error = gradient('purple', 'pink');
      break;
    case 'retro':
      cra = gradient("orange", "purple");
      co = gradient.retro;
      cb = chalk.hex("#ffce63");
      cv = chalk.bold.hex("#3c09ab");
      error = gradient("#d94fff", "purple");
      break;
    case 'sunlight':
      cra = gradient("#f5bd31", "#f5e131");
      co = gradient("orange", "#ffff00", "#ffe600");
      cb = chalk.hex("#faf2ac");
      cv = chalk.bold.hex("#ffe600");
      error = gradient("#f5bd31", "#f5e131");
      break;
    case 'teen':
      cra = gradient("#81fcf8", "#853858");
      co = gradient.teen;
      cb = chalk.hex("#a1d5f7");
      cv = chalk.bold.hex("#ad0042");
      error = gradient("#00a9c7", "#853858");
      break;
    case 'summer':
      cra = gradient("#fcff4d", "#4de1ff");
      co = gradient.summer;
      cb = chalk.hex("#ffff00");
      cv = chalk.bold.hex("#fff700")
      error = gradient("#fcff4d", "#4de1ff");
      break;
    case 'flower':
      cra = gradient("yellow", "yellow", "#81ff6e");
      co = gradient.pastel;
      cb = gradient('#47ff00', "#47ff75");
      cv = chalk.bold.hex("#47ffbc");
      error = gradient("blue", "purple", "yellow", "#81ff6e");
      break;
    case 'ghost':
      cra = gradient("#0a658a", "#0a7f8a", "#0db5aa");
      co = gradient.mind;
      cb = chalk.blueBright;
      cv = chalk.bold.hex("#1390f0");
      error = gradient("#0a658a", "#0a7f8a", "#0db5aa");
      break;
    case 'hacker':
      cra = chalk.hex('#4be813');
      co = gradient('#47a127', '#0eed19', '#27f231');
      cb = chalk.hex("#22f013");
      cv = chalk.bold.hex("#0eed19");
      error = chalk.hex('#4be813');
      break;
    case 'purple':
      cra = chalk.hex('#7a039e');
      co = gradient("#243aff", "#4687f0", "#5800d4");
      cb = chalk.hex("#6033f2");
      cv = chalk.bold.hex("#5109eb");
      error = chalk.hex('#7a039e');
      break;
    case 'rainbow':
      cra = chalk.hex('#0cb3eb');
      co = gradient.rainbow;
      cb = chalk.hex("#ff3908");
      cv = chalk.bold.hex("#f708ff");
      error = chalk.hex('#ff8400');
      break;
    case 'orange':
      cra = chalk.hex('#ff8400');
      co = gradient("#ff8c08", "#ffad08", "#f5bb47");
      cb = chalk.hex("#ebc249");
      cv = chalk.bold.hex("#ff8c08");
      error = chalk.hex('#ff8400');
      break;
    default:
      cra = gradient('yellow', 'lime', 'green');
      co = gradient("#243aff", "#4687f0", "#5800d4");
      cb = chalk.blueBright;
      cv = chalk.bold.hex("#3467eb");
      error = chalk.red.bold;
      break;
  }
  return { co, error, cra, cb, cv};
};

module.exports = {
  getThemeColors,
  log: (text, type) => {
    switch (type) {
      case 'warn':
        process.stderr.write(getThemeColors().error(`\r[ ERROR ] `) + text + '\n');
        break;
      case 'error':
        console.log(chalk.bold.hex("#ff0000").bold(`[ ERROR ] `) + text + '\n');
        break;
      case 'load':
        console.log(getThemeColors().co(`[ NEW USER ] `) + text + '\n');
        break;
      default:
        process.stderr.write(getThemeColors().co(`\r[ ${String(type).toUpperCase()} ] `) + text + '\n');
        break;
    }
  },
  error: (text, type) => {
    process.stderr.write(chalk.hex("#ff0000")(`\r» ${type} « `) + text + '\n');
  },
  err: (text, type) => {
    process.stderr.write(getThemeColors().co(`[ ${type} ] `) + text + '\n');
  },
  warn: (text, type) => {
    process.stderr.write(getThemeColors().co(`\r[ ${type} ] `) + text + '\n');
  },
  loader: (data, option) => {
    switch (option) {
      case 'warn':
        process.stderr.write(getThemeColors().co(`[ SYSTEM ]`), data + '\n');
        break;
      case 'error':
        process.stderr.write(chalk.hex("#ff0000")(`\r[ SYSTEM ] `) + data + '\n');
        break;
      default:
        console.log(getThemeColors().co(`[ SYSTEM ]`), data);
        break;
    }
  }
};