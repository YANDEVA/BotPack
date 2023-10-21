'use strict';

var utils = require('../utils');
var log = require('npmlog');

module.exports = function (http, api, ctx) {
  return function changeAvatar(image, caption = '', timestamp = null, callback) {
    var cb;
    var rt = new Promise(function (resolve, reject) {
      cb = (error, url) => error ? reject(error) : resolve(url);
    });

    if (typeof image == 'function') {
      callback = image;
      image = null;
    }
    if (typeof caption == 'function') {
      callback = caption;
      caption = '';
    }
    if (typeof caption == 'number') {
      timestamp = caption;
      caption = '';
    }
    if (typeof timestamp == 'function') {
      callback = timestamp;
      timestamp = null;
    }
    if (typeof callback == 'function') cb = callback;

    if (!utils.isReadableStream(image)) {
      var error = 'image should be a readable stream, not ' + utils.getType(image);
      log.error('changeAvatar', error);
      cb(error);
    } else {
      http
        .postFormData('https://www.facebook.com/profile/picture/upload/', ctx.jar, {
          profile_id: ctx.userID,
          photo_source: 57,
          av: ctx.userID,
          file: image
        })
        .then(utils.parseAndCheckLogin(ctx, http))
        .then(function (res) {
          if (res.error || res.errors || !res.payload) 
            throw res;

          var vari = {
            input: {
              caption,
              existing_photo_id: res.payload.fbid,
              expiration_time: timestamp,
              profile_id: ctx.userID,
              profile_pic_method: "EXISTING",
              profile_pic_source: "TIMELINE",
              scaled_crop_rect: {
                height: 1,
                width: 1,
                x: 0,
                y: 0
              },
              skip_cropping: true,
              actor_id: ctx.userID,
              client_mutation_id: Math.round(Math.random() * 19).toString()
            },
            isPage: false,
            isProfile: true,
            scale: 3
          }
          return http
            .post('https://www.facebook.com/api/graphql', ctx.jar, {
              doc_id: 5066134240065849,
              server_timestamps: true,
              fb_api_req_friendly_name: 'ProfileCometProfilePictureSetMutation',
              variables: JSON.stringify(vari)
            })
            .then(utils.parseAndCheckLogin(ctx, http));
        })
        .then(function (res) {
          if (res.errors)
            throw res;

          return cb(null, (res[0] || res).data.profile_picture_set.profile);
        })
        .catch(function (err) {
          log.error('changeAvatar', err);
          return cb(err);
        });
    }

    return rt;
  }
}