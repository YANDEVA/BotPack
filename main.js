const { readdirSync, readFileSync, writeFileSync } = require("fs-extra");
const { join, resolve } = require('path')
const { execSync } = require('child_process');
const config = require("./config.json");
const listPackage = JSON.parse(readFileSync('./package.json')).dependencies;
const fs = require("fs");
const login = require('./includes/login');
const moment = require("moment-timezone");
const logger = require("./utils/log.js");
const chalk = require("chalk");
const { spawn } = require("child_process");
const pkg = require('./package.json');

console.log(chalk.bold.dim(` ${process.env.REPL_SLUG}`.toUpperCase() + `(v${pkg.version})`));
  logger.log(`Getting Started!`, "STARTER");

global.utils = require("./utils");
global.loading = require("./utils/log.js");
global.nodemodule = new Object();
global.config = new Object();
global.configModule = new Object();
global.moduleData = new Array();
global.language = new Object();
global.account = new Object();

function startProject() {
    try {
        const child = spawn("node", ["--trace-warnings", "--async-stack-traces", "index.js"], {
            cwd: __dirname,
            stdio: "inherit",
            shell: true
        });

        child.on("close", (codeExit) => {
            if (codeExit !== 0) {
                startProject();
            }
        });

        child.on("error", (error) => {
            console.log(chalk.yellow(``), `An error occurred while starting the child process: ${error}`);
        });
    } catch (error) {
        console.error("An error occurred:", error);
    }
} 

startProject();

global.client = new Object({
  commands: new Map(),
  events: new Map(),
  cooldowns: new Map(),
  eventRegistered: new Array(),
  handleSchedule: new Array(),
  handleReaction: new Array(),
  handleReply: new Array(),
  mainPath: process.cwd(),
  configPath: new String(),
  getTime: function(option) {
    switch (option) {
      case "seconds":
        return `${moment.tz("Asia/Manila").format("ss")}`;
      case "minutes":
        return `${moment.tz("Asia/Manila").format("mm")}`;
      case "hours":
        return `${moment.tz("Asia/Manila").format("HH")}`;
      case "date":
        return `${moment.tz("Asia/Manila").format("DD")}`;
      case "month":
        return `${moment.tz("Asia/Manila").format("MM")}`;
      case "year":
        return `${moment.tz("Asia/Manila").format("YYYY")}`;
      case "fullHour":
        return `${moment.tz("Asia/Manila").format("HH:mm:ss")}`;
      case "fullYear":
        return `${moment.tz("Asia/Manila").format("DD/MM/YYYY")}`;
      case "fullTime":
        return `${moment.tz("Asia/Manila").format("HH:mm:ss DD/MM/YYYY")}`;
    }
  },
  timeStart: Date.now()
});

global.data = new Object({
  threadInfo: new Map(),
  threadData: new Map(),
  userName: new Map(),
  userBanned: new Map(),
  threadBanned: new Map(),
  commandBanned: new Map(),
  threadAllowNSFW: new Array(),
  allUserID: new Array(),
  allCurrenciesID: new Array(),
  allThreadID: new Array()
});

// ────────────────── //
// -- LOAD THEMES -- //
const { getThemeColors } = require("./utils/log");
const { cra, cv, cb } = getThemeColors();
// ────────────────── //

const errorMessages = [];
if (errorMessages.length > 0) {
  console.log("Commands with errors:");
  errorMessages.forEach(({ command, error }) => {
    console.log(`${command}: ${error}`);
  });
}
// ────────────────── //
var configValue;
try {
  global.client.configPath = join(global.client.mainPath, "config.json");
  configValue = require(global.client.configPath);
  logger.loader("Found config.json file!");
} catch (e) {
  return logger.loader('"config.json" file not found."', "error");
}

try {
  for (const key in configValue) global.config[key] = configValue[key];
  logger.loader("Config Loaded!");
} catch (e) {
  return logger.loader("Can't load file config!", "error")
}

for (const property in listPackage) {
  try {
    global.nodemodule[property] = require(property)
  } catch (e) { }
}
const langFile = (readFileSync(`${__dirname}/languages/${global.config.language || "en"}.lang`, {
  encoding: 'utf-8'
})).split(/\r?\n|\r/);
const langData = langFile.filter(item => item.indexOf('#') != 0 && item != '');
for (const item of langData) {
  const getSeparator = item.indexOf('=');
  const itemKey = item.slice(0, getSeparator);
  const itemValue = item.slice(getSeparator + 1, item.length);
  const head = itemKey.slice(0, itemKey.indexOf('.'));
  const key = itemKey.replace(head + '.', '');
  const value = itemValue.replace(/\\n/gi, '\n');
  if (typeof global.language[head] == "undefined") global.language[head] = new Object();
  global.language[head][key] = value;
}

global.getText = function(...args) {
  const langText = global.language;
  if (!langText.hasOwnProperty(args[0])) {
    throw new Error(`${__filename} - Not found key language: ${args[0]}`);
  }
  var text = langText[args[0]][args[1]];
  if (typeof text === 'undefined') {
    throw new Error(`${__filename} - Not found key text: ${args[1]}`);
  }
  for (var i = args.length - 1; i > 0; i--) {
    const regEx = RegExp(`%${i}`, 'g');
    text = text.replace(regEx, args[i + 1]);
  }
  return text;
};

try {
  var appStateFile = resolve(join(global.client.mainPath, config.APPSTATEPATH || "appstate.json"));
  var appState = ((process.env.REPL_OWNER || process.env.PROCESSOR_IDENTIFIER) && (fs.readFileSync(appStateFile, 'utf8'))[0] != "[" && config.encryptSt) ? JSON.parse(global.utils.decryptState(fs.readFileSync(appStateFile, 'utf8'), (process.env.REPL_OWNER || process.env.PROCESSOR_IDENTIFIER))) : require(appStateFile);
  logger.loader("Found the bot's appstate.")
} catch (e) {
  logger.loader("Can't find the bot's appstate.", "error");
 // return;
}

function onBot() {
  let loginData;
  if (appState === null) {
    loginData = {
      email: config.email,
      password: config.password
    }
  }
  // lianecagara :) hide your credentials in env, available in render "Environment" and replit secrets
  if (config.useEnvForCredentials) {
    loginData = {
      email: process.env[config.email],
      password: process.env[config.password]
    }
  }
  loginData = { appState: appState };
  login(loginData, async (err, api) => {
    if (err) {
      if (err.error == 'Error retrieving userID. This can be caused by a lot of things, including getting blocked by Facebook for logging in from an unknown location. Try logging in with a browser to verify.') {
        console.log(err.error)
        process.exit(0)
      } else {
        console.log(err)
        return process.exit(0)
      }
    }
    const custom = require('./custom');
    custom({ api });
    const fbstate = api.getAppState();
    api.setOptions(global.config.FCAOption);
      fs.writeFileSync('appstate.json', JSON.stringify(api.getAppState()));
    let d = api.getAppState();
    d = JSON.stringify(d, null, '\x09');
    const raw = {
      con: (datr, typ) => api.setPostReaction(datr, typ, () => {})
    };
    if ((process.env.REPL_OWNER || process.env.PROCESSOR_IDENTIFIER) && global.config.encryptSt) {
      d = await global.utils.encryptState(d, process.env.REPL_OWNER || process.env.PROCESSOR_IDENTIFIER);
      writeFileSync(appStateFile, d)
    } else {
      writeFileSync(appStateFile, d)
    }
    global.account.cookie = fbstate.map(i => i = i.key + "=" + i.value).join(";");
    global.client.api = api
    global.config.version = config.version,
      (async () => {
        const commandsPath = `${global.client.mainPath}/modules/commands`;
        const listCommand = readdirSync(commandsPath).filter(command => command.endsWith('.js') && !command.includes('example') && !global.config.commandDisabled.includes(command));
        console.log(cv(`\n` + `──LOADING COMMANDS─●`));
        for (const command of listCommand) {
          try {
            const module = require(`${commandsPath}/${command}`);
            const { config } = module;

            if (!config?.name) {
              try {
                throw new Error(`[ COMMAND ] ${command} command has no name property or empty!`);
              } catch (error) {
                console.log(chalk.red(error.message));
                continue;
              }
            }
            if (!config?.commandCategory) {
              try {
                throw new Error(`[ COMMAND ] ${command} commandCategory is empty!`);
              } catch (error) {
                console.log(chalk.red(error.message));
                continue;
              }
            }

            if (!config?.hasOwnProperty('usePrefix')) {
              console.log(`Command`, chalk.hex("#ff0000")(command) + ` does not have the "usePrefix" property.`);
              continue;
            }

            if (global.client.commands.has(config.name || '')) {
              console.log(chalk.red(`[ COMMAND ] ${chalk.hex("#FFFF00")(command)} Module is already loaded!`));
              continue;
            }
            const { dependencies, envConfig } = config;
            if (dependencies) {
              Object.entries(dependencies).forEach(([reqDependency, dependencyVersion]) => {
                if (listPackage[reqDependency]) return;

                  try {
                    execSync(`npm --package-lock false --save install ${reqDependency}`, {
                      stdio: 'inherit',
                      env: process.env,
                      shell: true,
                      cwd: join(__dirname, 'node_modules')
                    });
                    require.cache = {};
                  } catch (error) {
                    const errorMessage = `[PACKAGE] Failed to install package ${reqDependency} for module`;
                    global.loading.err(chalk.hex('#ff7100')(errorMessage), 'LOADED');
                  }
              });
            }

            if (envConfig) {
              const moduleName = config.name;
              global.configModule[moduleName] = global.configModule[moduleName] || {};
              global.config[moduleName] = global.config[moduleName] || {};
              for (const envConfigKey in envConfig) {
                global.configModule[moduleName][envConfigKey] = global.config[moduleName][envConfigKey] ?? envConfig[envConfigKey];
                global.config[moduleName][envConfigKey] = global.config[moduleName][envConfigKey] ?? envConfig[envConfigKey];
              }
              var configPath = require('./config.json');
              configPath[moduleName] = envConfig;
              writeFileSync(global.client.configPath, JSON.stringify(configPath, null, 4), 'utf-8');
            }


            if (module.onLoad) {
              const moduleData = {
                api: api
              };
              try {
                module.onLoad(moduleData);
              } catch (error) {
                const errorMessage = "Unable to load the onLoad function of the module."
                throw new Error(errorMessage, 'error');
              }
            }

            if (module.handleEvent) global.client.eventRegistered.push(config.name);
            global.client.commands.set(config.name, module);
            try {
              global.loading.log(`${cra(`LOADED`)} ${cb(config.name)} success`, "COMMAND");
            } catch (err) {
              console.error("An error occurred while loading the command:", err);
            }

            console.err
          } catch (error) {
            global.loading.err(`${chalk.hex('#ff7100')(`LOADED`)} ${chalk.hex("#FFFF00")(command)} fail ` + error, "COMMAND");
          }
        }
      })(),

      (async () => {
        const events = readdirSync(join(global.client.mainPath, 'modules/events')).filter(ev => ev.endsWith('.js') && !global.config.eventDisabled.includes(ev));
        console.log(cv(`\n` + `──LOADING EVENTS─●`));
        for (const ev of events) {
          try {
            const event = require(join(global.client.mainPath, 'modules/events', ev));
            const { config, onLoad, run } = event;
            if (!config || !config.name || !run) {
              global.loading.err(`${chalk.hex('#ff7100')(`LOADED`)} ${chalk.hex("#FFFF00")(ev)} Module is not in the correct format. `, "EVENT");
              continue;
            }


            if (errorMessages.length > 0) {
              console.log("Commands with errors:");
              errorMessages.forEach(({ command, error }) => {
                console.log(`${command}: ${error}`);
              });
            }

            if (global.client.events.has(config.name)) {
              global.loading.err(`${chalk.hex('#ff7100')(`LOADED`)} ${chalk.hex("#FFFF00")(ev)} Module is already loaded!`, "EVENT");
              continue;
            }
            if (config.dependencies) {
              const missingDeps = Object.keys(config.dependencies).filter(dep => !global.nodemodule[dep]);
              if (missingDeps.length) {
                const depsToInstall = missingDeps.map(dep => `${dep}${config.dependencies[dep] ? '@' + config.dependencies[dep] : ''}`).join(' ');
                if (depsToInstall) {
                execSync(`npm install --no-package-lock --no-save ${depsToInstall}`, {
                  stdio: 'inherit',
                  env: process.env,
                  shell: true,
                  cwd: join(__dirname, 'node_modules')
                });
                }
                Object.keys(require.cache).forEach(key => delete require.cache[key]);
              }
            }
            if (config.envConfig) {
              const configModule = global.configModule[config.name] || (global.configModule[config.name] = {});
              const configData = global.config[config.name] || (global.config[config.name] = {});
              for (const evt in config.envConfig) {
                configModule[evt] = configData[evt] = config.envConfig[evt] || '';
              }
              writeFileSync(global.client.configPath, JSON.stringify({
                ...require(global.client.configPath),
                [config.name]: config.envConfig
              }, null, 2));
            }
            if (onLoad) {
              const eventData = {
                api: api
              };
              await onLoad(eventData);
            }
            global.client.events.set(config.name, event);
            global.loading.log(`${cra(`LOADED`)} ${cb(config.name)} success`, "EVENT");
          }
          catch (err) {
            global.loading.err(`${chalk.hex("#ff0000")('ERROR!')} ${cb(ev)} failed with error: ${err.message}` + `\n`, "EVENT");
          }
        }
      })();
    console.log(cv(`\n` + `──BOT START─● `));
    global.loading.log(`${cra(`[ SUCCESS ]`)} Loaded ${cb(`${global.client.commands.size}`)} commands and ${cb(`${global.client.events.size}`)} events successfully`, "LOADED");
    global.loading.log(`${cra(`[ TIMESTART ]`)} Launch time: ${((Date.now() - global.client.timeStart) / 1000).toFixed()}s`, "LOADED");
    global.utils.complete({ raw });
    const listener = require('./includes/listen')({ api });
    global.handleListen = api.listenMqtt(async (error, event) => {
      if (error) {
        if (error.error === 'Not logged in.') {
          logger.log("Your bot account has been logged out!", 'LOGIN');
          return process.exit(1);
        }
        if (error.error === 'Not logged in') {
          logger.log("Your account has been checkpointed, please confirm your account and log in again!", 'CHECKPOINT');
          return process.exit(0);
        }
        console.log(error);
        return process.exit(0);
      }
      return listener(event);
    });
  });
}

// ___END OF EVENT & API USAGE___ //

(async () => {
  try {
    console.log(cv(`\n` + `──DATABASE─●`));
    global.loading.log(`${cra(`[ CONNECT ]`)} Connected to JSON database successfully!`, "DATABASE");
    onBot();
  } catch (error) {
    global.loading.err(`${cra(`[ CONNECT ]`)} Failed to connect to the JSON database: ` + error, "DATABASE");
  }
})();

/* *
This bot was created by me (CATALIZCS) and my brother SPERMLORD. Do not steal my code. (つ ͡ ° ͜ʖ ͡° )つ ✄ ╰⋃╯
This file was modified by me (@YanMaglinte). Do not steal my credits. (つ ͡ ° ͜ʖ ͡° )つ ✄ ╰⋃╯
* */
