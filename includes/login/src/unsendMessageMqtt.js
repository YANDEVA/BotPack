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
  return function unsendMessageMqtt(messageID, threadID, callback) {
    if (!ctx.mqttClient) {
      throw new Error('Not connected to MQTT');
    }

    ctx.wsReqNumber += 1;
    ctx.wsTaskNumber += 1;

    const label = '33';

    const taskPayload = {
      message_id: messageID,
      thread_key: threadID,
      sync_group: 1,
    };

    const payload = JSON.stringify(taskPayload);
    const version = '25393437286970779';

    const task = {
      failure_count: null,
      label: label,
      payload: payload,
      queue_name: 'unsend_message',
      task_id: ctx.wsTaskNumber,
    };

    const content = {
      app_id: '2220391788200892',
      payload: JSON.stringify({
        tasks: [task],
        epoch_id: parseInt(generateOfflineThreadingID()),
        version_id: version,
      }),
      request_id: ctx.wsReqNumber,
      type: 3,
    };

    if (isCallable(callback)) {
      ctx.reqCallbacks[ctx.wsReqNumber] = callback;
    }

    ctx.mqttClient.publish('/ls_req', JSON.stringify(content), { qos: 1, retain: false });
  };
};
