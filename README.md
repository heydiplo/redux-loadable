```js
const LOAD_USERS = {
  START: 'LOAD_USERS',
  SUCCESS: 'LOAD_USERS_SUCCESS',
  FAILURE: 'LOAD_USERS_FAILURE'
}

const fetchUsers = ({ per_page, page }) =>
  fetch(`https://example.com/users?per_page=${per_page}&page=${page}`)
    .then(response => response.json())

const getUsers = ({ per_page, page }) => (dispatch) => {
  const query = { per_page, page }

  dispatch({
    type: LOAD_USERS.START,
    payload: { query }
  })

  return fetchUsers(query)
    .then((json) => {
      dispatch({
        type: LOAD_USERS.SUCCESS,
        payload: {
          data: json.data,
          count: json.total,
          query
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: LOAD_USERS.FAILURE,
        payload: {
          error,
          query
        }
      })
    })
}

const dummyStore = (store = {}, action) => store
export const reducer = loadable(LOAD_USERS, {
  getQuery: ({ payload }) => payload && payload.query,
  getData: ({ payload }) => payload && payload.data,
  getCount: ({ payload }) => payload && payload.count,
  getError: ({ payload }) => payload && payload.error
})(dummyStore)

export const selector = loadableSelector('users')
```
