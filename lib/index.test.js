'use strict';

var _index = require('./index');

describe('store/enhancers/loadable', function () {
  var ACTION = {
    START: 'start',
    FAILURE: 'error',
    SUCCESS: 'success'
  };

  var base = function base() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    return state;
  };

  var options = {
    getData: function getData(_ref) {
      var payload = _ref.payload;
      return payload && payload.result.data;
    },
    getQuery: function getQuery(_ref2) {
      var payload = _ref2.payload;
      return payload && payload.query;
    },
    getError: function getError(_ref3) {
      var payload = _ref3.payload;
      return payload && payload.error;
    }
  };

  it('basic', function () {
    var reducer = (0, _index.loadable)(ACTION, options)(base);

    var state = void 0;

    expect(state = reducer(state, { type: 'IGNORED ACTION' })).toEqual({ data: {}, queries: {} });

    expect(state = reducer(state, { type: ACTION.START })).toEqual({ data: {}, queries: { default: { loading: true, error: null } } });

    expect(state = reducer(state, { type: ACTION.FAILURE, error: 'loading failed' })).toEqual({ data: {}, queries: { default: { data: undefined, loading: false, error: 'loading failed' } } });

    expect(state = reducer(state, {
      type: ACTION.SUCCESS,
      payload: { result: { data: [{ id: 1 }, { id: 2 }] } }
    })).toEqual({
      data: { 1: { id: 1 }, 2: { id: 2 } },
      queries: { default: { data: [1, 2], loading: false, error: null } }
    });
  });
});