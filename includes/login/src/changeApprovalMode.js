"use strict";

var utils = require("../utils");
var log = require("npmlog");

module.exports = function(defaultFuncs, api, ctx) {
    return function changeApprovalMode(approval_mode, threadID, callback) {
        if (utils.getType(threadID) !== "String") {
            throw { error: "changeApprovalMode: threadID must be a string" };
        }

        var resolveFunc = function() {};
        var rejectFunc = function() {};
        var returnPromise = new Promise(function(resolve, reject) {
            resolveFunc = resolve;
            rejectFunc = reject;
        });

        if (!callback) {
            callback = function(err) {
                if (err) {
                    return rejectFunc(err);
                }
                resolveFunc(err);
            };
        }

        if (
            utils.getType(callback) !== "Function" &&
            utils.getType(callback) !== "AsyncFunction"
        ) {
            throw { error: "changeApprovalMode: callback is not a function" };
        }

        approval_mode = parseInt(approval_mode);

        if (approval_mode !== 0 && approval_mode !== 1) {
            throw { error: "changeApprovalMode: approval_mode must be 0 or 1" };
        }

        var form = {
            thread_fbid: threadID,
            set_mode: approval_mode,
        };

        defaultFuncs
            .post(
                "https://www.facebook.com/messaging/set_approval_mode/?dpr=1",
                ctx.jar,
                form
            )
            .then(utils.parseAndCheckLogin(ctx, defaultFuncs))
            .then(function(resData) {
                if (resData.error) {
                    switch (resData.error) {
                        case 1357031:
                            throw {
                                error:
                                    "Cannot alter approval mode: this thread is not a group chat or you are not an admin.",
                                rawResponse: resData,
                            };
                        default:
                            throw {
                                error:
                                    "Cannot alter approval mode: unknown error.",
                                rawResponse: resData,
                            };
                    }
                }

                return callback();
            })
            .catch(function(err) {
                log.error("changeApprovalMode", err);
                return callback(err);
            });

        return returnPromise;
    };
};
