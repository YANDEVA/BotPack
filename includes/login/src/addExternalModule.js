'use strict';

var utils = require('../utils');

module.exports = function (http, api, ctx) {
  return function addExternalModule(moduleObj) {
    if (utils.getType(moduleObj) == 'Object') {
      for (let name in moduleObj) {
        if (utils.getType(moduleObj[name]) == 'Function') 
          api[name] = moduleObj[name](http, api, ctx);
        else 
          throw new Error(`Item "${name}" in moduleObj must be a function, not ${utils.getType(moduleObj[name])}!`);
      }
    } else
      throw new Error(`moduleObj must be an object, not ` + utils.getType(moduleObj) + `!`);
  }
}