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
  return function forwardMessage(messageID, threadID, callback) {
    if (!ctx.mqttClient) {
      throw new Error('Not connected to MQTT');
    }

    ctx.wsReqNumber += 1;
    ctx.wsTaskNumber += 1;

    const taskPayload = {
      thread_id: threadID,
      otid: parseInt(generateOfflineThreadingID()),
      source: 65544,
      send_type: 5,
      sync_group: 1,
      forwarded_msg_id: messageID,
      strip_forwarded_msg_caption: 0,
      initiating_source: 1,
    };

    const task = {
      failure_count: null,
      label: '46',
      payload: JSON.stringify(taskPayload),
      queue_name: `${threadID}`,
      task_id: ctx.wsTaskNumber,
    };

    const content = {
      app_id: '2220391788200892',
      payload: JSON.stringify({
        data_trace_id: null,
        epoch_id: parseInt(generateOfflineThreadingID()),
        tasks: [task],
        version_id: '25095469420099952',
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
