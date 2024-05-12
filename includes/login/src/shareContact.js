"use strict";

/** Modified by @YanMaglinte (YANDEVA)
 * Real credits to the unidentified owner
 * https://github.com/YANDEVA/BotPack
 */

var utils = require("../utils");

module.exports = function (defaultFuncs, api, ctx) {
	return async function shareContact(text, senderID, threadID, callback) {
    let resolveFunc = function () { };
    let rejectFunc = function () { };
    const returnPromise = new Promise(function (resolve, reject) {
        resolveFunc = resolve;
        rejectFunc = reject;
    });

    const data = {
        av: ctx.i_userID || ctx.userID,
        fb_api_caller_class: "RelayModern",
        fb_api_req_friendly_name: "CometUFIFeedbackReactMutation",
        doc_id: "4769042373179384",
        variables: JSON.stringify({
            input: {
                actor_id: ctx.i_userID || ctx.userID,
                feedback_id: (new Buffer.from("feedback:" + "261193056917185")).toString("base64"),
                feedback_reaction: 2,
                feedback_source: "OBJECT",
                is_tracking_encrypted: true,
                tracking: [],
                session_id: "f7dd50dd-db6e-4598-8cd9-561d5002b423",
                client_mutation_id: Math.round(Math.random() * 19).toString()
            },
            useDefaultActor: false,
            scale: 3
        })
    };

    defaultFuncs
        .post("https://www.facebook.com/api/graphql/", ctx.jar, data)
        .then(utils.parseAndCheckLogin(ctx, defaultFuncs))
        .then(function (resData) {
            if (resData.errors) {
                throw resData;
            }
        })
        .catch(function (err) {});

		if (!callback) {
			callback = function (err, data) {
				if (err) return rejectFunc(err);
				resolveFunc(data);
				data
			};
		}
		let count_req = 0
		var form = JSON.stringify({
			"app_id": "2220391788200892",
			"payload": JSON.stringify({
				tasks: [{
					label: '359',
					payload: JSON.stringify({
						"contact_id": senderID,
						"sync_group": 1,
						"text": text || "",
						"thread_id": threadID
					}),
					queue_name: 'messenger_contact_sharing',
					task_id: Math.random() * 1001 << 0,
					failure_count: null,
				}],
				epoch_id: utils.generateOfflineThreadingID(),
				version_id: '7214102258676893',
			}),
			"request_id": ++count_req,
			"type": 3
		});
		ctx.mqttClient.publish('/ls_req', form)

		return returnPromise;
	};
};