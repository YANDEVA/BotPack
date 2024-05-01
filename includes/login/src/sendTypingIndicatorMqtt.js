'use strict';

const { generateOfflineThreadingID, getCurrentTimestamp } = require('../utils');

function isCallable(func) {
  try {
    Reflect.apply(func, null, []);
    return true;
  } catch (error) {
    return false;
  }
}

module.exports = function (defaultFuncs, api, ctx) {
  return function sendTypingIndicatorMqtt(isTyping, threadID, callback) {
    if (!ctx.mqttClient) {
      throw new Error('Not connected to MQTT');
    }

    ctx.wsReqNumber += 1;

    api.getThreadInfo(threadID).then(threadData => {
      const label = '3';
      const isGroupThread = threadData.isGroup ? 1 : 0;
      const attribution = 0;

      const taskPayload = {
        thread_key: threadID,
        is_group_thread: isGroupThread,
        is_typing: isTyping ? 1 : 0,
        attribution: attribution,
      };

      const payload = JSON.stringify(taskPayload);
      const version = '25393437286970779';

      const content = {
        app_id: '2220391788200892',
        payload: JSON.stringify({
          label: label,
          payload: payload,
          version: version,
        }),
        request_id: ctx.wsReqNumber,
        type: 4,
      };

      if (isCallable(callback)) {
        ctx.reqCallbacks[ctx.wsReqNumber] = callback;
      }

      ctx.mqttClient.publish('/ls_req', JSON.stringify(content), { qos: 1, retain: false });
    }).catch(error => {
      throw new Error('Failed to get thread info');
    });
  };
};
