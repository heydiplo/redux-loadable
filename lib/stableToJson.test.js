'use strict';

var _stableToJson = require('./stableToJson');

var _stableToJson2 = _interopRequireDefault(_stableToJson);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('utils/stableToJson', function () {
  it('works', function () {
    expect((0, _stableToJson2.default)({ a: 1, b: 2 })).toEqual('{"a": 1,"b": 2}');

    expect((0, _stableToJson2.default)({ b: 2, a: 1 })).toEqual('{"a": 1,"b": 2}');

    expect((0, _stableToJson2.default)({ a: 1, b: [2, 3, 4] })).toEqual('{"a": 1,"b": [2,3,4]}');

    expect((0, _stableToJson2.default)({ a: 1, b: undefined })).toEqual('{"a": 1}');

    expect((0, _stableToJson2.default)({ a: 1, b: { c: 1, d: 2 } })).toEqual('{"a": 1,"b": {"c": 1,"d": 2}}');

    expect((0, _stableToJson2.default)({ a: 1, b: { d: 2, c: 1 } })).toEqual('{"a": 1,"b": {"c": 1,"d": 2}}');
  });
});