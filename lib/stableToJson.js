'use strict';

exports.__esModule = true;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _lodash = require('lodash');

exports.default = function (object) {
  var seen = [];

  var stringify = function stringify(node) {
    if (node === undefined) {
      return;
    }

    if ((typeof node === 'undefined' ? 'undefined' : _typeof(node)) !== 'object' || node === null) {
      return JSON.stringify(node);
    }

    if ((0, _lodash.isArray)(node)) {
      var values = (0, _lodash.map)(node, function (value) {
        return stringify(value) || JSON.stringify(null);
      });

      return '[' + values.join(',') + ']';
    }

    if (seen.indexOf(node) !== -1) {
      throw new TypeError('Converting circular structure to JSON');
    } else {
      seen.push(node);
    }

    var out = (0, _lodash.compact)((0, _lodash.map)((0, _lodash.keys)(node).sort(), function (key) {
      var value = stringify(node[key]);

      if (!value) return null;

      return JSON.stringify(key) + ': ' + value;
    }));

    seen.splice(seen.indexOf(node), 1);
    return '{' + out.join(',') + '}';
  };

  return stringify(object);
};