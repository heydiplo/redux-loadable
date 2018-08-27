import { loadable } from './index'

describe('store/enhancers/loadable', () => {
  const ACTION = {
    START: 'start',
    FAILURE: 'error',
    SUCCESS: 'success'
  }

  const base = (state = {}) => {
    return state
  }

  const options = {
    getData: ({ payload }) => payload && payload.result.data,
    getQuery: ({ payload }) => payload && payload.query,
    getError: ({ payload }) => payload && payload.error
  }

  it('basic', () => {
    const reducer = loadable(ACTION, options)(base)

    let state

    expect(
      state = reducer(state, { type: 'IGNORED ACTION' })
    ).toEqual(
      { data: {}, queries: {}}
    )

    expect(
      state = reducer(state, { type: ACTION.START })
    ).toEqual(
      { data: {}, queries: { default: { loading: true, error: null }}}
    )

    expect(
      state = reducer(state, { type: ACTION.FAILURE, error: 'loading failed' })
    ).toEqual(
      { data: {}, queries: { default: { data: undefined, loading: false, error: 'loading failed' }}}
    )

    expect(
      state = reducer(state, {
        type: ACTION.SUCCESS,
        payload: { result: { data: [{ id: 1 }, { id: 2 }] }}
      })
    ).toEqual(
      {
        data: { 1: { id: 1 }, 2: { id: 2 }},
        queries: { default: { data: [1, 2], loading: false, error: null }}
      }
    )
  })
})
