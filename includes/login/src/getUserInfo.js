"use strict";

var utils = require("../utils");
var log = require("npmlog");

function formatData(data) {
  var retObj = {};

  for (var prop in data) {
    // eslint-disable-next-line no-prototype-builtins
    if (data.hasOwnProperty(prop)) {
      var innerObj = data[prop];
      retObj[prop] = {
        name: innerObj.name,
        firstName: innerObj.firstName,
        vanity: innerObj.vanity,
        thumbSrc: innerObj.thumbSrc,
        profileUrl: innerObj.uri,
        gender: innerObj.gender,
        type: innerObj.type,
        isFriend: innerObj.is_friend,
        isBirthday: !!innerObj.is_birthday,
				searchTokens: innerObj.searchTokens,
				alternateName: innerObj.alternateName,
        isBlocked: innerObj.is_blocked
      };
    }
  }

  return retObj;
}

function formatDataGraph(userData, userIDs) {
  var Obj = {};

  userIDs.map(function (c, i) {
    var res = userData[i];
    return !res.data ? Obj[c] = {
      id: c,
      name: res.name,
      shortName: res.short_name || null,
      verified: res.is_verified,
      email: res.email || null,
      website: res.website || null,
      follower: !!res.subscribers ? res.subscribers.summary.total_count : null,
      lover: res.significant_other || null,
      cover: !!res.cover ? res.cover.source : null,
      first_name: res.first_name || null,
      middle_name: res.middle_name || null,
      last_name: res.last_name || null,
      about: res.about || null,
      birthday: res.birthday || null,
      locale: res.locale,
      languages: res.languages || [],
      gender: res.gender || null,
      hometown: !!res.hometown ? res.hometown.name : null,
      profileUrl: res.link || null,
      location: !!res.location ? res.location.name : null,
      username: res.username || null,
      avatar: !!res.picture ? res.picture.data.url : null,
      relationship_status: !!res.relationship_status ? res.relationship_status : null,
      subscribers: !!res.subscribers ? res.subscribers.data : null,
      favorite_athletes: !!res.favorite_athletes ? res.favorite_athletes.map(function (v) {
        return {
          name: v.name
        }
      }) : [],
      education: !!res.education ? res.education.map(function(v) {
        return {
          type: v.type,
          school: v.school.name
        }
      }) : [],
      work: !!res.work ? res.work : []
    } : null;
  });
  
  return Obj;
}

module.exports = function (http, api, ctx) {
  function handleGetData(userIDs) {
    var cb;
    var uploads = [];
    var rtPromise = new Promise(function (resolve, reject) {
      cb = (error, data) => data ? resolve(data) : reject(error);
    });

    // Getting User Data From GraphAPI In The Loop
    userIDs.map(function (c) {
      var mainPromise = utils
        .get('https://graph.facebook.com/' + c, ctx.jar, {
          fields: 'name,is_verified,cover,first_name,email,about,birthday,gender,website,hometown,link,location,quotes,relationship_status,significant_other,username,subscribers.limite(0),short_name,last_name,middle_name,education,picture,work,languages,favorite_athletes,locale',
          access_token: ctx.access_token
        }, ctx.globalOptions)
        .then(function (res) {
          return res.body.indexOf('<') < 0 ? JSON.parse(res.body) : { data: 404 };
        })
        .catch(cb);
      return uploads.push(mainPromise);
    });

    // resolve all promise
    Promise
      .all(uploads)
      .then(function (userData) {
        return cb(null, formatDataGraph(userData, userIDs));
      })
      .catch(function (err) {
        return cb(err);
      });
 
    return rtPromise;
  }
  
  return function getUserInfo(userIDs, useGraph, callback) {
    var cb;
    var rtPromise = new Promise(function (resolve, reject) {
      cb = (error, data) => data ? resolve(data) : reject(error);
    });

    if (typeof useGraph == 'function') {
      callback = useGraph;
      useGraph = false;
    }
    if (typeof callback == 'function') cb = callback;
    if (Array.isArray(userIDs) == false) userIDs = [userIDs];

    if (useGraph) {
      if (!ctx.access_token) {
        var err = 'Cant get access_token, please let the "useGraph" feature is false';
        log.error('getUserInfo', err);
        return cb(err);
      }
      handleGetData(userIDs)
        .then(function (res) {
          return cb(null, res);
        })
        .catch(function (err) {
          log.error('getUserInfo', err);
          return cb(err);
        });
    } else {
      var form = {};
      userIDs.map(function(v, i) {
        form["ids[" + i + "]"] = v;
      });
      http
        .post("https://www.facebook.com/chat/user_info/", ctx.jar, form)
        .then(utils.parseAndCheckLogin(ctx, http))
        .then(function(res) {
          if (res.error || res.errors) throw res;
          return cb(null, formatData(res.payload.profiles));
        })
        .catch(function(err) {
          log.error("getUserInfo", err);
          return cb(err);
        });
    }

    return rtPromise;
  }
}