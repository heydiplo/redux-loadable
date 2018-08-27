'use strict';

exports.__esModule = true;
exports.singularSelector = exports.loadableSelector = exports.loadable = undefined;

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

};var hashify = function hashify(dataArray, id) {
  return (0, _lodash.reduce)(dataArray, function (result, entry) {
    var _extends2;

    return _extends({}, result, (_extends2 = {}, _extends2[entry[id]] = entry, _extends2));
  }, {});
};

var getKey = function getKey(query) {
  return (0, _stableToJson2.default)(query) || 'default';
};

// state

var initial = { data: undefined, loading: false, error: null

  // 

};var loadable = exports.loadable = function loadable(load_action, _options) {
  var options = _extends({}, defaultOptions, _options);

  return function (base) {
    return function (_state, action) {
      var _extends3;

      var state = base(_state, action);
      var getQuery = options.getQuery,
          getData = options.getData,
          getCount = options.getCount,
          getError = options.getError;


      if (options.clearOn && options.clearOn(action)) {
        return _extends({}, state, {
          queries: {}
        });
      }

      var queryKey = getKey(getQuery(action));
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

        newLoadingState = _extends({}, loadingState, {
          data: (0, _lodash.map)(_data, options.id),
          error: null,
          loading: false,
          total: count
        });

        newData = _extends({}, newData, hashify(_data, options.id));
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
        queries: _extends({}, state.queries, (_extends3 = {}, _extends3[queryKey] = newLoadingState, _extends3))
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
    var hash = getKey(query);
    var result = (0, _lodash.get)(state, ['queries', hash]) || initial;

    if (result.data) {
      result = _extends({}, result, {
        data: (0, _lodash.map)(result.data, function (id) {
          return state.data[id];
        })
      });
    }

    return _extends({}, result, {
      total: result.total === undefined ? undefined : result.total,
      pages: result.total === undefined ? undefined : Math.ceil(result.total / query.per_page)
    });
  });
};

var singularSelector = exports.singularSelector = function singularSelector(name) {
  return (0, _reselect.createSelector)(loadableSelector(name), function (result) {
    return _extends({}, result, {
      data: result.data ? result.data[0] : result.data
    });
  });
};