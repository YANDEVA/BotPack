"use strict";

var utils = require("../utils");
var log = require("npmlog");

module.exports = function (defaultFuncs, api, ctx) {
  function makeTypingIndicator(typ, threadID, callback) {
    var form = {
      typ: +typ,
      to: threadID || "",
      source: "mercury-chat",
      thread: threadID
    };

    defaultFuncs
      .post("https://www.facebook.com/ajax/messaging/typ.php", ctx.jar, form)
      .then(function (resData) {
        if (resData.error) {
          throw resData.errorDescription || "Unknown error";
        }
        return callback();
      })
      .catch(function (err) {
        log.error("sendTypingIndicator", err);
        if (utils.getType(err) == "Object" && err.error === "Not logged in.") {
          ctx.loggedIn = false;
        }
        return callback(err);
      });
  }

  return function sendTypingIndicator(threadID, callback) {
    if (
      utils.getType(callback) !== "Function" &&
      utils.getType(callback) !== "AsyncFunction"
    ) {
      if (callback) {
        log.warn(
          "sendTypingIndicator",
          "callback is not a function - ignoring."
        );
      }
      callback = () => {};
    }

    makeTypingIndicator(true, threadID, callback);

    return function end(cb) {
      if (
        utils.getType(cb) !== "Function" &&
        utils.getType(cb) !== "AsyncFunction"
      ) {
        if (cb) {
          log.warn(
            "sendTypingIndicator",
            "callback is not a function - ignoring."
          );
        }
        cb = () => {};
      }

      makeTypingIndicator(false, threadID, cb);
    };
  };
};
