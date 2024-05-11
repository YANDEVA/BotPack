const { exec } = require("child_process");
const chalk = require("chalk");
const check = require("get-latest-version");
const fs = require("fs");
const semver = require("semver");

let configJson;
let packageJson;
const sign = "(›^-^)›";
const fbstate = "appstate.json";

try {
  configJson = require("./config.json");
} catch (error) {
  console.error("Error loading config.json:", error);
  process.exit(1); // Exit the script with an error code
}

const delayedLog = async (message) => {
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  for (const char of message) {
    process.stdout.write(char);
    await delay(50);
  }

  console.log();
};

const showMessage = async () => {
  const message =
    chalk.yellow(" ") +
    `The "removeSt" property is set true in the config.json. Therefore, the Appstate was cleared effortlessly! You can now place a new one in the same directory.`;

  await delayedLog(message);
};

if (configJson.removeSt) {
  fs.writeFileSync(fbstate, sign, { encoding: "utf8", flag: "w" });
  showMessage();
  configJson.removeSt = false;
  fs.writeFileSync(
    "./config.json",
    JSON.stringify(configJson, null, 2),
    "utf8",
  );
  setTimeout(() => {
    process.exit(0);
  }, 10000);
  return;
}

// # Please note that sometimes this function is the reason the bot will auto-restart, even if your custom.js auto-restart is set to false. This is because the port switches automatically if it is unable to connect to the current port. ↓↓↓↓↓↓

const excluded = configJson.UPDATE.EXCLUDED || [];

try {
  packageJson = require("./package.json");
} catch (error) {
  console.error("Error loading package.json:", error);
  return;
}

function nv(version) {
  return version.replace(/^\^/, "");
}

async function updatePackage(dependency, currentVersion, latestVersion) {
  if (!excluded.includes(dependency)) {
    const ncv = nv(currentVersion);

    if (semver.neq(ncv, latestVersion)) {
      console.log(
        chalk.bgYellow.bold(` UPDATE `),
        `There is a newer version ${chalk.yellow(`(^${latestVersion})`)} available for ${chalk.yellow(dependency)}. Updating to the latest version...`,
      );

      packageJson.dependencies[dependency] = `^${latestVersion}`;

      fs.writeFileSync("./package.json", JSON.stringify(packageJson, null, 2));

      console.log(
        chalk.green.bold(`UPDATED`),
        `${chalk.yellow(dependency)} updated to ${chalk.yellow(`^${latestVersion}`)}`,
      );

      exec(`npm install ${dependency}@latest`, (error, stdout, stderr) => {
        if (error) {
          console.error("Error executing npm install command:", error);
          return;
        }
        console.log("npm install output:", stdout);
      });
    }
  }
}

async function checkAndUpdate() {
  if (configJson.UPDATE && configJson.UPDATE.Package) {
    try {
      for (const [dependency, currentVersion] of Object.entries(
        packageJson.dependencies,
      )) {
        const latestVersion = await check(dependency);
        await updatePackage(dependency, currentVersion, latestVersion);
      }
    } catch (error) {
      console.error("Error checking and updating dependencies:", error);
    }
  } else {
    console.log(
      chalk.yellow(""),
      "Update for packages is not enabled in config.json",
    );
  }
}

// Do not remove anything if you don't know what you're doing! -Yan

setTimeout(() => {
  checkAndUpdate();
}, 20000);

const path = require("path");
const express = require("express");
const app = express();
global.loading = require("./utils/log.js");

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "/includes/cover/index.html"));
});
app.listen(2024, () => {
  global.loading.log(
    `Bot is running on port: 2024`,
    "SYSTEM",
  );
});

// __@YanMaglinte was Here__ //
// ----------------------------//
