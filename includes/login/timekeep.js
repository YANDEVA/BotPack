"use strict";

const path = require("path");
const fs = require("fs");
const http = require("http");
const fetch = require("node-fetch");

function getConfig() {
  const filePath = path.resolve("./uptime.config.json");
  const defaultConfig = {
    debug: false,
    create_api: true,
    port: 3000,
    path: "/",
    body: {
      title: "replit.uptimer ⚡",
      description:
        "Don't worry about downtime anymore! With replit.uptimer, your project will work 24 hours a day, 365 days a year. Powered by the npm package replit.uptimer, you can rest easy knowing your project is always running. Try replit.uptimer today and never worry about downtime again!",
      url: "https://npmjs.com/package/replit.uptimer",
    },
  };

  try {
    let data = fs.readFileSync(filePath, { encoding: "utf8", flag: "r" });
    return { ...defaultConfig, ...JSON.parse(data) };
  } catch (e) {
    return defaultConfig;
  }
}

async function createAPI() {
  const config = getConfig();

  return new Promise((resolve, reject) => {
    const server = http.createServer((request, response) => {
      const reqURL = request.url;
      const reqMethod = request.method;

      if (reqMethod === "GET" && reqURL === config.path) {
        const indexPath = path.resolve("./includes/login/cover/index.html");

        fs.readFile(indexPath, { encoding: "utf8", flag: "r" }, (err, data) => {
          if (err) {
            response.writeHead(500, {
              "Content-Type": "text/plain",
            });
            response.end("Internal Server Error!");
            return;
          }

          response.writeHead(200, {
            "Content-Type": "text/html",
          });
          response.write(data);
          response.end();
        });
      }
    });

    server.listen(config.port, () => {
      //console.log(`⚡ Uptime for your project is now created: \u001b[38;5;209m\u001b[1m${`https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.replit.dev`.toLowerCase()}\u001b[0m`);
      resolve(config);
    });

    server.on("error", (e) => {
      reject(e);
    });
  });
}

function OpenTime() {
  if (!process.env.REPL_ID || !process.env.REPL_SLUG || !process.env.REPL_OWNER) {
    //throw new TypeError("Uptimer package only works with Replit projects");
    return;
  }

  createAPI()
    .then((config) => {
      const replId = process.env.REPL_ID.toLowerCase();
      const replSlug = process.env.REPL_SLUG.toLowerCase();
      const replOwner = process.env.REPL_OWNER.toLowerCase();
      const apiURL = `https://api.shuruhatik.com/uptime/${replId}/${replSlug}/${replOwner}/${config.path.split("/").join("-")}`;

      fetch(apiURL)
        .then((response) => response.json())
        .then((body) => {
          if (config.debug) {
            console.log(body);
          }
        })
        .catch((e) => {
          if (config.debug) {
            console.log(e.message);
          }
        });

      setTimeout(() => {
        fetch(apiURL)
          .then((response) => response.json())
          .then((body) => {
            if (config.debug) {
              console.log(body);
            }
          })
          .catch((e) => {
            if (config.debug) {
              console.log(e.message);
            }
          });
      }, 70000);
    })
    .catch((e) => {
      console.error(e);
    });
}

exports.OpenTime = OpenTime;