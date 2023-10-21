"use strict";

const config = require("./../../config.json");
const gradient = require("gradient-string");
const chalk = require("chalk");
const theme = config.DESIGN.Theme.toLowerCase();
let cra;
let co;

if (theme === 'blue') {
  cra = gradient('yellow', 'lime', 'green');
  co = gradient("#243aff", "#4687f0", "#5800d4");
} else if (theme === 'fiery') {
  cra = gradient('orange', 'orange', 'yellow');
  co = gradient("#fc2803", "#fc6f03", "#fcba03");
} else if (theme === 'red') {
  cra = gradient('yellow', 'lime', 'green');
  co = gradient("red", "orange");
} else if (theme === 'aqua') {
  cra = gradient("#6883f7", "#8b9ff7", "#b1bffc");
  co = gradient("#0030ff", "#4e6cf2");
} else if (theme === 'pink') {
  cra = gradient('purple', 'pink');
  co = gradient("#d94fff", "purple");
} else if (theme === 'retro') {
  cra = gradient("orange", "purple");
  co = gradient.retro;
} else if (theme.toLowerCase() === 'sunlight') {
  cra = gradient("#f5bd31", "#f5e131");
  co = gradient("#ffff00", "#ffe600");
} else if (theme.toLowerCase() === 'teen') {
  cra = gradient("#81fcf8", "#853858");
  co = gradient.teen;
} else if (theme.toLowerCase() === 'summer') {
  cra = gradient("#fcff4d", "#4de1ff");
  co = gradient.summer;
} else if (theme.toLowerCase() === 'flower') {
  cra = gradient("blue", "purple", "yellow", "#81ff6e");
  co = gradient.pastel;
} else if (theme.toLowerCase() === 'ghost') {
  cra = gradient("#0a658a", "#0a7f8a", "#0db5aa");
  co = gradient.mind;
} else if (theme === 'hacker') {
  cra = chalk.hex('#4be813');
  co = gradient('#47a127', '#0eed19', '#27f231');
} else {
  cra = gradient('yellow', 'lime', 'green');
  co = gradient("#243aff", "#4687f0", "#5800d4");
};

var utils = require("./utils");
var cheerio = require("cheerio");
var log = require('npmlog');
var defaultLogRecordSize = 100;
log.maxRecordSize = defaultLogRecordSize;

function setOptions(globalOptions, options) {
  Object.keys(options).map(function(key) {
    switch (key) {
      case 'online':
        globalOptions.online = Boolean(options.online);
        break;
      case 'logLevel':
        log.level = options.logLevel;
        globalOptions.logLevel = options.logLevel;
        break;
      case 'logRecordSize':
        log.maxRecordSize = options.logRecordSize;
        globalOptions.logRecordSize = options.logRecordSize;
        break;
      case 'selfListen':
        globalOptions.selfListen = Boolean(options.selfListen);
        break;
      case 'selfListenEvent':
        globalOptions.selfListenEvent = options.selfListenEvent;
        break;
      case 'listenEvents':
        globalOptions.listenEvents = Boolean(options.listenEvents);
        break;
      case 'pageID':
        globalOptions.pageID = options.pageID.toString();
        break;
      case 'updatePresence':
        globalOptions.updatePresence = Boolean(options.updatePresence);
        break;
      case 'forceLogin':
        globalOptions.forceLogin = Boolean(options.forceLogin);
        break;
      case 'userAgent':
        globalOptions.userAgent = options.userAgent;
        break;
      case 'autoMarkDelivery':
        globalOptions.autoMarkDelivery = Boolean(options.autoMarkDelivery);
        break;
      case 'autoMarkRead':
        globalOptions.autoMarkRead = Boolean(options.autoMarkRead);
        break;
      case 'listenTyping':
        globalOptions.listenTyping = Boolean(options.listenTyping);
        break;
      case 'proxy':
        if (typeof options.proxy != "string") {
          delete globalOptions.proxy;
          utils.setProxy();
        } else {
          globalOptions.proxy = options.proxy;
          utils.setProxy(globalOptions.proxy);
        }
        break;
      case 'autoReconnect':
        globalOptions.autoReconnect = Boolean(options.autoReconnect);
        break;
      default:
        log.warn("setOptions", "Unrecognized option given to setOptions: " + key);
        break;
    }
  });
}

function buildAPI(globalOptions, html, token, jar) {
  var { c_user, i_user } = jar.getCookies('https://www.facebook.com').reduce(function(form, val) {
    var [name, value] = val.cookieString().split('=');
    form[name] = value;
    return form;
  }, {});

  if (!i_user && !c_user) {
    throw { error: "Error retrieving userID. This can be caused by a lot of things, including getting blocked by Facebook for logging in from an unknown location. Try logging in with a browser to verify." };
  }

  if (html.indexOf("/checkpoint/block/?next") > -1) {
    log.warn("login", "Checkpoint detected. Please log in with a browser to verify.");
  }

  var userID = i_user || c_user;
  console.log(co("[ DATABASE ]"), (cra("[ CONNECT ]")), `Logged in as ${userID}`);
  var clientID = (Math.random() * 2147483648 | 0).toString(16);
  var api = {
    setOptions: setOptions.bind(null, globalOptions),
    getAppState: function getAppState() {
      return utils.getAppState(jar);
    }
  }

  let oldFBMQTTMatch = html.match(/irisSeqID:"(.+?)",appID:219994525426954,endpoint:"(.+?)"/);
  let mqttEndpoint = null;
  let region = null;
  let irisSeqID = null;

  if (token == 'NONE') 
    //log.warn('login', 'Cant get access_token');
    console.log(co("[ DATABASE ]"), (cra("[ CONNECT ]")), `Cant get access_token`);
  if (oldFBMQTTMatch) {
    irisSeqID = oldFBMQTTMatch[1];
    mqttEndpoint = oldFBMQTTMatch[2];
    region = new URL(mqttEndpoint).searchParams.get("region").toUpperCase();
    console.log(co("[ DATABASE ]"), (cra("[ CONNECT ]")), `Account's message region: ${region}`);
  } else {
    let newFBMQTTMatch = html.match(/{"app_id":"219994525426954","endpoint":"(.+?)","iris_seq_id":"(.+?)"}/);
    if (newFBMQTTMatch) {
      irisSeqID = newFBMQTTMatch[2];
      mqttEndpoint = newFBMQTTMatch[1].replace(/\\\//g, "/");
      region = new URL(mqttEndpoint).searchParams.get("region").toUpperCase();
      console.log(co("[ DATABASE ]"), (cra("[ CONNECT ]")), `Account's message region: ${region}`);
    } else {
      let legacyFBMQTTMatch = html.match(/(\["MqttWebConfig",\[\],{fbid:")(.+?)(",appID:219994525426954,endpoint:")(.+?)(",pollingEndpoint:")(.+?)(3790])/);
      if (legacyFBMQTTMatch) {
        mqttEndpoint = legacyFBMQTTMatch[4];
        region = new URL(mqttEndpoint).searchParams.get("region").toUpperCase();
      console.log(co("[ DATABASE ]"), (cra("[ CONNECT ]")), `Your account has been disconnected. Please check your Facebook account to see if anything has happened.`);
        //log.warn("login", `Cannot get sequence ID with new RegExp. Fallback to old RegExp (without seqID)...`);
        //log.info("login", `Got this account's message region: ${region}`);
        //log.info("login", `[Unused] Polling endpoint: ${legacyFBMQTTMatch[6].split('",')[0]}`);
        return;
      } else {
        log.warn("login", "Cannot get MQTT region & sequence ID.");
        api.htmlData = html;
      }
    }
  }

  // All data available to api functions
  var ctx = {
    userID,
    jar,
    clientID,
    globalOptions,
    loggedIn: true,
    access_token: token,
    clientMutationId: 0,
    mqttClient: undefined,
    lastSeqId: irisSeqID,
    syncToken: undefined,
    mqttEndpoint,
    region,
    firstListen: true
  };

  var http = utils.makeDefaults(html, userID, ctx);

  // Load all api functions in a loop
  require('node:fs')
    .readdirSync(__dirname + '/src/')
    .filter((v) => v.endsWith('.js'))
    .map(function(v) {
      api[v.replace('.js', '')] = require('./src/' + v)(http, api, ctx);
    });

  //Removing original `listen` that uses pull.
  //Map it to listenMqtt instead for backward compatibly.
  api.listen = api.listenMqtt;

  return [ctx, http, api];
}

function makeLogin(jar, email, password, loginOptions, callback, prCallback) {
  return function(res) {
    var html = res.body;
    var $ = cheerio.load(html);
    var arr = [];

    // This will be empty, but just to be sure we leave it
    $("#login_form input").map(function(i, v) {
      arr.push({ val: $(v).val(), name: $(v).attr("name") });
    });

    arr = arr.filter(function(v) {
      return v.val && v.val.length;
    });

    var form = utils.arrToForm(arr);
    form.lsd = utils.getFrom(html, "[\"LSD\",[],{\"token\":\"", "\"}");
    form.lgndim = Buffer.from("{\"w\":1440,\"h\":900,\"aw\":1440,\"ah\":834,\"c\":24}").toString('base64');
    form.email = email;
    form.pass = password;
    form.default_persistent = '0';
    form.lgnrnd = utils.getFrom(html, "name=\"lgnrnd\" value=\"", "\"");
    form.locale = 'en_US';
    form.timezone = '240';
    form.lgnjs = ~~(Date.now() / 1000);


    // Getting cookies from the HTML page... (kill me now plz)
    // we used to get a bunch of cookies in the headers of the response of the
    // request, but FB changed and they now send those cookies inside the JS.
    // They run the JS which then injects the cookies in the page.
    // The "solution" is to parse through the html and find those cookies
    // which happen to be conveniently indicated with a _js_ in front of their
    // variable name.
    //
    // ---------- Very Hacky Part Starts -----------------
    var willBeCookies = html.split("\"_js_");
    willBeCookies.slice(1).map(function(val) {
      var cookieData = JSON.parse("[\"" + utils.getFrom(val, "", "]") + "]");
      jar.setCookie(utils.formatCookie(cookieData, "facebook"), "https://www.facebook.com");
    });
    // ---------- Very Hacky Part Ends -----------------

    //log.info("login", "Logging in...");
    console.log(co("[ LOGIN ]"), (chalk.yellow(' ')), `Logging in...`);
    return utils
      .post("https://www.facebook.com/login/device-based/regular/login/?login_attempt=1&lwv=110", jar, form, loginOptions)
      .then(utils.saveCookies(jar))
      .then(function(res) {
        var headers = res.headers;
         if (!headers.location)
          // return;
         throw { error: "Wrong username/password." };

        // This means the account has login approvals turned on.
        if (headers.location.includes('.com/checkpoint/')) {
          //log.info("login", "You have login approvals turned on.");
          console.log(co("[ LOGIN ]"), (chalk.yellow(' ')), `Please check your Facebook and click 'This was me" as you have login approvals turned on.'`);
          if (callback == prCallback)
            throw { error: 'Promise is not supported for login code verification' };
          var Referer = headers.location;

          return utils
            .get(Referer, jar, null, loginOptions)
            .then(utils.saveCookies(jar))
            .then(function(res) {
              var html = res.body;
              // Make the form in advance which will contain the fb_dtsg and nh
              var $ = cheerio.load(html);
              var arr = [];
              $("form input").map(function(i, v) {
                arr.push({ val: $(v).val(), name: $(v).attr("name") });
              });
              arr = arr.filter(function(v) {
                return v.val && v.val.length;
              });
              var form = utils.arrToForm(arr);
              if (html.includes('.com/checkpoint/?next')) {
                function submit2FA(code) {
                  var cb;
                  var rtPromise = new Promise(function(resolve) {
                    cb = function(err, api) {
                      resolve(callback(err, api));
                    }
                  });

                  form.approvals_code = code;
                  form['submit[Continue]'] = $("#checkpointSubmitButton").html(); // Continue
                  if (typeof code == 'string') {
                    utils
                      .post(Referer, jar, form, loginOptions, null, { Referer })
                      .then(utils.saveCookies(jar))
                      .then(function(res) {
                        var html = res.body;
                        var $ = cheerio.load(html);
                        var error = $("#approvals_code").parent().attr("data-xui-error");
                        if (error)
                          throw {
                            error: 'submit2FA',
                            errordesc: "Invalid 2FA code.",
                            lerror: error,
                            continue: submit2FA
                          }
                      })
                      .then(function() {
                        // Use the same form (safe I hope)
                        delete form.no_fido;
                        delete form.approvals_code;
                        form.name_action_selected = 'save_device';

                        return utils
                          .post(Referer, jar, form, loginOptions, null, { Referer })
                          .then(utils.saveCookies(jar));
                      })
                      .then(function(res) {
                        var { headers, body: html } = res;
                        if (!headers.location && html.indexOf('Review Recent Login') > -1)
                          throw { error: "Something went wrong with login approvals." }
                        var appState = utils.getAppState(jar);
                        return loginHelper(appState, email, password, loginOptions, cb);
                      })
                      .catch(function(err) {
                        //log.error('login', err);
                        return cb(err);
                      });
                  }
                  else {
                    utils
                      .post(Referer, jar, form, loginOptions, null, { Referer })
                      .then(utils.saveCookies(jar))
                      .then(function(res) {
                        try {
                          var maybeObject = res.body.split(';').pop();
                          JSON.parse(maybeObject);
                        } catch (_) {
                          log.info('login', 'Verified from browser. Logging in...');
                          var appState = utils.getAppState(jar);
                          return loginHelper(appState, email, password, loginOptions, cb);
                        }
                      })
                      .catch(function(err) {
                        login.error('login', err);
                        return cb(err);
                      });
                  }

                  return rtPromise;
                }
                throw {
                  error: 'submit2FA',
                  continue: submit2FA
                }
              }
              else {
                if (!loginOptions.forceLogin)
                  throw { error: "Couldn't login. Facebook might have blocked this account. Please login with a browser or enable the option 'forceLogin' and try again." };
                if (html.indexOf("Suspicious Login Attempt") > -1)
                  form['submit[This was me]'] = "This was me";
                else
                  form['submit[This Is Okay]'] = "This Is Okay";

                function submitNot2FA() {
                  var cb;
                  var rtPromise = new Promise(function(resolve) {
                    cb = function(err, api) {
                      resolve(callback(err, api));
                    }
                  });

                  utils
                    .post(Referer, jar, form, loginOptions)
                    .then(utils.saveCookies(jar))
                    .then(function() {
                      // Use the same form (safe I hope)
                      form.name_action_selected = 'save_device';
                      return utils
                        .post(Referer, jar, form, loginOptions)
                        .then(utils.saveCookies(jar));
                    })
                    .then(function(res) {
                      var headers = res.headers;
                      if (!headers.location && res.body.includes('Review Recent Login'))
                        throw { error: "Something went wrong with review recent login." };
                      var appState = utils.getAppState(jar);
                      // Simply call loginHelper because all it needs is the jar
                      // and will then complete the login process
                      return loginHelper(appState, email, password, loginOptions, cb);
                    })
                    .catch(function(e) {
                      return cb(e);
                    });
                  return rtPromise;
                }
                throw {
                  error: 'submitNot2FA',
                  continue: submitNot2FA()
                }
              }
            });
        }

        setOptions(loginOptions, {
          userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_2) AppleWebKit/600.3.18 (KHTML, like Gecko) Version/8.0.3 Safari/600.3.18"
        });
        return utils
          .get('https://www.facebook.com/', jar, null, loginOptions, null, { noRef: true })
          .then(utils.saveCookies(jar));
      });
  }
}

// Helps the login
function loginHelper(appState, email, password, globalOptions, callback, prCallback) {
  var mainPromise = null;
  var jar = utils.getJar();

  // If we're given an appState we loop through it and save each cookie
  // back into the jar.
  if (appState) {
    setOptions(globalOptions, {
      userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_2) AppleWebKit/600.3.18 (KHTML, like Gecko) Version/8.0.3 Safari/600.3.18"
    });
    appState.map(function(c) {
      var str = c.key + "=" + c.value + "; expires=" + c.expires + "; domain=" + c.domain + "; path=" + c.path + ";";
      jar.setCookie(str, "http://" + c.domain);
    });

    // Load the main page.
    mainPromise = utils
      .get('https://www.facebook.com/', jar, null, globalOptions, null, { noRef: true })
      .then(utils.saveCookies(jar));
  } else {
    // Make it easier to log in with email (maybe ~~)
    setOptions(globalOptions, {
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36"
    });
    // Open the main page, then we login with the given credentials and finally
    // load the main page again (it'll give us some IDs that we need)
    mainPromise = utils
      .get("https://www.facebook.com/", null, null, globalOptions, null, { noRef: true })
      .then(utils.saveCookies(jar))
      .then(makeLogin(jar, email, password, globalOptions, callback, prCallback));
  }

  var ctx = null;
  var _defaultFuncs = null;
  var api = null;

  mainPromise = mainPromise
    .then(function(res) {
      // Hacky check for the redirection that happens on some ISPs, which doesn't return statusCode 3xx
      var reg = /<meta http-equiv="refresh" content="0;url=([^"]+)[^>]+>/;
      var redirect = reg.exec(res.body);
      if (redirect && redirect[1]) {
        return utils
          .get(redirect[1], jar, null, globalOptions)
          .then(utils.saveCookies(jar));
      }
      return res;
    })
    // get access_token (maybe?)
    .then(utils.createAccess_token(jar, globalOptions))
    .then(function(res) {
      var [html, token] = res;
      var stuff = buildAPI(globalOptions, html.body, token, jar);
      ctx = stuff[0];
      _defaultFuncs = stuff[1];
      api = stuff[2];
      return res;
    });

  // given a pageID we log in as a page  
  if (globalOptions.pageID) {
    mainPromise = mainPromise
      .then(function() {
        return utils
          .get('https://www.facebook.com/' + ctx.globalOptions.pageID + '/messages/?section=messages&subsection=inbox', ctx.jar, null, globalOptions);
      })
      .then(function(resData) {
        var url = utils.getFrom(resData.body, 'window.location.replace("https:\\/\\/www.facebook.com\\', '");').split('\\').join('');
        url = url.substring(0, url.length - 1);

        return utils
          .get('https://www.facebook.com' + url, ctx.jar, null, globalOptions);
      });
  }

  // At the end we call the callback or catch an exception
  mainPromise
    .then(function() {
      console.log(co("[ DATABASE ]"), (cra("[ CONNECT ]")), 'Done logging in.'); return callback(null, api);
    })
    .catch(function(e) {
      log.error("login", e.error || e);
      return callback(e);
    });
}

function login(loginData, options, callback) {
  var prCallback;
  var returnPromise = new Promise(function(resolve, reject) {
    prCallback = (error, api) => api ? resolve(api) : reject(error);
  });

  if (typeof options == 'function') {
    callback = options;
    options = {};
  }
  if (typeof callback == 'function') prCallback = null;
  else callback = prCallback;
  if (options == undefined) options = {};

  var globalOptions = {
    selfListen: false,
    selfListenEvent: false,
    listenEvents: true,
    listenTyping: false,
    updatePresence: true,
    forceLogin: false,
    autoMarkDelivery: true,
    autoMarkRead: true,
    autoReconnect: true,
    logRecordSize: defaultLogRecordSize,
    online: true,
    emitReady: false
  };
  setOptions(globalOptions, options);

  if (parseInt(process.versions.node) < 14) {
    log.error('login', 'node version must be 14.x or higher, recommended version: 16.7.0');
    return callback({
      error: 'nodeDeprecated',
      lerror: 'node version must be 14.x or higher, recommended version: 16.7.0'
    });
  }
  loginHelper(loginData.appState, loginData.email, loginData.password, globalOptions, callback, prCallback);

  return returnPromise;
}

module.exports = login;