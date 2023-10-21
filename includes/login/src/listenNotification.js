'use strict';

var utils = require('../utils.js');
var log = require('npmlog');

function formatGraphResponse(data) {
  var Obj = [];
  var convertMS = function (ms, date) {
    var time = (date - ms) / 1000;
    return time;
  };
  var edges = data.viewer.notifications_page.edges;

  for (let res of edges) {
    res = res.node;
    if (res.row_type !== 'NOTIFICATION') continue;
    var timestamp = res.notif.creation_time.timestamp * 1000;
    if (convertMS(timestamp, Date.now()) > 60) break;
    var data = {
      id: res.notif.id,
      noti_id: res.notif.notif_id,
      type: res.notif.notif_type,
      body: res.notif.body,
      url: res.notif.url,
      timestamp
    }
    Obj.push(data);
  }
  
  return Obj;
}

module.exports = function (http, api, ctx) {
  function listen(callback) {
    var interval = setInterval(function (form) {
      return http
        .post('https://www.facebook.com/api/graphql/', ctx.jar, form)
        .then(utils.parseAndCheckLogin(ctx, http))
        .then(function (res) {
          if (res.error) throw res;
          return http
            .post('https://www.facebook.com/ajax/navigation/', ctx.jar, {
              client_previous_actor_id: '',
              route_url: '/notifications',
              routing_namespace: 'fb_comet'
            })
            .then(utils.parseAndCheckLogin(ctx, http))
            .then(function () {
              return callback(null, formatGraphResponse(res.data));
            });
        })
        .catch(function (err) {
          log.error('listenNotification', err);
          return callback(err);
        });
    }, 60000, {
      fb_api_req_friendly_name: "CometNotificationsRootQuery",
      doc_id: "6663491207045267",
      variables: JSON.stringify({
        count: 15,
        environment: "MAIN_SURFACE",
        filter_tokens: ["Cg8CZnQPA2FsbAE="],
        scale: 1
      }),
      server_timestamps: !0
    });

    return function stopListen() {
      return clearInterval(interval);
    }
  }
  
  return function GraphNoti(callback) {
    if (typeof callback != 'function') {
      var error = new Error('callback is not a function');
      log.error('listenNotification', error);
      return error;
    }

    try {
      var rCb = listen(callback);
      return rCb;
    } catch (err) {
      log.error('listenNotification', err);
      return err;
    }
  }
}
