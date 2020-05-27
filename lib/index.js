'use strict';

exports.__esModule = true;
exports.loadableSelector = exports.loadable = exports.queryToKey = exports.dataToSet = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _lodash = require('lodash');

var _reselect = require('reselect');

var _stableToJson = require('./stableToJson');

var _stableToJson2 = _interopRequireDefault(_stableToJson);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// options
var defaultOptions = {
  id: 'id'

  // helpers

};var hashifyOne = function hashifyOne(entry, id) {
  var _ref;

  return _ref = {}, _ref[entry[id]] = entry, _ref;
};

var dataToSet = exports.dataToSet = function dataToSet(data, id) {
  return (0, _lodash.isArray)(data) ? (0, _lodash.reduce)(data, function (result, entry) {
    return _extends({}, result, hashifyOne(entry, id));
  }, {}) : hashifyOne(data, id);
};

var queryToKey = exports.queryToKey = function queryToKey(query) {
  return (0, _stableToJson2.default)(query) || 'default';
};

// state

var initial = { data: undefined, loading: false, error: null

  // 

};var loadable = exports.loadable = function loadable(load_action, _options) {
  var options = _extends({}, defaultOptions, _options);

  return function (base) {
    return function (_state, action) {
      var _extends2;

      var state = base(_state, action);
      var getQuery = options.getQuery,
          getData = options.getData,
          getCount = options.getCount,
          getError = options.getError,
          getMeta = options.getMeta;


      if (options.clearOn && options.clearOn(action)) {
        return _extends({}, state, {
          queries: {}
        });
      }

      var queryKey = queryToKey(getQuery(action));
      var loadingState = (0, _lodash.get)(state, ['queries', queryKey]);

      var newLoadingState = loadingState || initial;
      var newData = state.data || {};

      var START = load_action.START,
          SUCCESS = load_action.SUCCESS,
          FAILURE = load_action.FAILURE;


      if (action.type === START) {
        newLoadingState = _extends({}, newLoadingState, {
          loading: true
        });
      } else if (action.type === FAILURE) {
        newLoadingState = _extends({}, newLoadingState, {
          error: action.error || 'Unknown error',
          loading: false
        });
      } else if (action.type === SUCCESS) {
        var _data = getData(action);
        var count = getCount ? getCount(action) : undefined;

        if (typeof _data === 'undefined') {
          throw new Error('no `data` in the response');
        }

        var queryData = (0, _lodash.isArray)(_data) ? (0, _lodash.map)(_data, options.id) : _data[options.id];

        newLoadingState = _extends({}, loadingState, {
          data: queryData,
          error: null,
          loading: false,
          total: count
        });

        if (getMeta) {
          newLoadingState.meta = getMeta(action);
        }

        newData = _extends({}, newData, dataToSet(_data, options.id));
      } else if (!state.data) {
        return _extends({}, state, {
          data: {},
          queries: {}
        });
      } else {
        return state;
      }

      if (newLoadingState === loadingState && newData === state.data) {
        return state;
      }

      return _extends({}, state, {
        data: newData,
        queries: _extends({}, state.queries, (_extends2 = {}, _extends2[queryKey] = newLoadingState, _extends2))
      });
    };
  };
};

var loadableSelector = exports.loadableSelector = function loadableSelector(name) {
  return (0, _reselect.createSelector)([function (state) {
    return state[name];
  }, function (_, query) {
    return query;
  }], function (state, query) {
    var hash = queryToKey(query);
    var result = (0, _lodash.get)(state, ['queries', hash]) || initial;

    if (result.data) {
      var _data2 = (0, _lodash.isArray)(result.data) ? (0, _lodash.map)(result.data, function (id) {
        return state.data[id];
      }) : state.data[result.data];

      result = _extends({}, result, {
        data: _data2
      });
    }

    return _extends({}, result, {
      total: result.total === undefined ? undefined : result.total,
      pages: result.total === undefined ? undefined : Math.ceil(result.total / query.per_page),
      meta: result.meta
    });
  });
};