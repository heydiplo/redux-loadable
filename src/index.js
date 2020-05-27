// @flow
import type { Action, PureAction, AsyncActionTypes, Query } from './types'
import { isArray, reduce, map, get } from 'lodash'
import { createSelector } from 'reselect'
import stableToJson from './stableToJson'

// options
type Options = {
  id?: string,
  clearOn?: (PureAction) => bool,
  getMeta?: (PureAction) => any,
  getQuery: (PureAction) => Query,
  getData: (PureAction) => any,
  getCount?: (PureAction) => number,
  getError: (PureAction) => any
}
const defaultOptions = {
  id: 'id'
}

// helpers

const hashifyOne = (entry, id) => ({
  [entry[id]]: entry
})

const hashify = (data, id) => (
  isArray(data) ? (
    reduce(data, (result, entry) => ({
      ...result,
      ...hashifyOne(entry, id)
    }), {})
  ) : (
    hashifyOne(data, id)
  )
)

const getKey = (query) => stableToJson(query) || 'default'

// state

type State = {
  data?: { [string]: any },
  queries?: {
    [string]: {
      data: ?((string|number)[]),
      loading: boolean,
      error: ?any,
      total: ?number,
      meta?: any
    }
  }
}

const initial = { data: undefined, loading: false, error: null }

// 

type Base = (state: State, action: Action) => State

export const loadable = (load_action: AsyncActionTypes, _options: ?Options) => {
  const options = { ...defaultOptions, ..._options }

  return (base: Base) => (_state: State, action: PureAction): State => {
    const state = base(_state, action)
    const { getQuery, getData, getCount, getError, getMeta } = options

    if (options.clearOn && options.clearOn(action)) {
      return {
        ...state,
        queries: {}
      }
    }

    const queryKey = getKey(getQuery(action))
    const loadingState = get(state, ['queries', queryKey])

    let newLoadingState = loadingState || initial
    let newData = state.data || {}

    const { START, SUCCESS, FAILURE } = load_action

    if (action.type === START) {
      newLoadingState = {
        ...newLoadingState,
        loading: true
      }
    } else if (action.type === FAILURE) {
      newLoadingState = {
        ...newLoadingState,
        error: action.error || 'Unknown error',
        loading: false
      }
    } else if (action.type === SUCCESS) {
      const data = getData(action)
      const count = getCount ? getCount(action) : undefined

      if (typeof data === 'undefined') { throw new Error('no `data` in the response') }

      const queryData = isArray(data) ? (
        map(data, options.id)
      ) : (
        data[options.id]
      )

      newLoadingState = {
        ...loadingState,
        data: queryData,
        error: null,
        loading: false,
        total: count
      }

      if (getMeta) {
        newLoadingState.meta = getMeta(action)
      }

      newData = {
        ...newData,
        ...hashify(data, options.id)
      }
    } else if (!state.data) {
      return {
        ...state,
        data: {},
        queries: {}
      }
    } else {
      return state
    }

    if (newLoadingState === loadingState && newData === state.data) { return state }

    return {
      ...state,
      data: newData,
      queries: {
        ...state.queries,
        [queryKey]: newLoadingState
      }
    }
  }
}

export const loadableSelector = (name: string) => createSelector(
  [
    (state) => state[name],
    (_, query) => query,
  ],
  (state, query) => {
    const hash = getKey(query)
    let result = get(state, ['queries', hash]) || initial

    if (result.data) {
      const data = isArray(result.data) ? (
        map(result.data, (id) => state.data[id])
      ) : (
        state.data[result.data]
      )

      result = {
        ...result,
        data
      }
    }

    return {
      ...result,
      total: result.total === undefined ? undefined : result.total,
      pages: result.total === undefined ? undefined : Math.ceil(result.total / query.per_page),
      meta: result.meta
    }
  }
)
