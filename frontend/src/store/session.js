import { csrfFetch } from './csrf'

// Action Types
const SET_SESSION_USER = 'session/setSessionUser'
const REMOVE_SESSION_USER = 'session/removeSessionUser'

// Action Creators
export const setSessionUser = user => ({
  type: SET_SESSION_USER,
  payload: user
})

export const removeSessionUser = () => ({
  type: REMOVE_SESSION_USER
})

// Thunk Action Creator

// *** SIGN-UP ***
export const signup = user => async dispatch => {
  const { username, firstName, lastName, email, password } = user
  const response = await csrfFetch('/api/users', {
    method: 'POST',
    body: JSON.stringify({
      username,
      firstName,
      lastName,
      email,
      password
    })
  })
  const data = await response.json()
  dispatch(setSessionUser(data))
  return response
}
// *** LOG-IN ***
export const login =
  ({ credential, password }) =>
  async dispatch => {
    const res = await csrfFetch('/api/session', {
      method: 'POST',
      body: JSON.stringify({ credential, password })
    })
    const user = await res.json()
    dispatch(setSessionUser(user))
  }

// *** LOG-OUT ***
export const logout = () => async dispatch => {
  const response = await csrfFetch('/api/session', {
    method: 'DELETE'
  })
  dispatch(removeSessionUser())
  return response
}

// *** RESTORE USER ***
export const restoreUser = () => async dispatch => {
  const response = await csrfFetch('/api/session')
  const data = await response.json()
  dispatch(setSessionUser(data.user))
  return response
}

// Reducer
const initialState = { user: null }

const sessionReducer = (state = initialState, action) => {
  let newState
  switch (action.type) {
    case SET_SESSION_USER:
      newState = Object.assign({}, state)
      newState.user = action.payload
      return newState
    case REMOVE_SESSION_USER:
      newState = Object.assign({}, state)
      newState.user = null
      return newState
    default:
      return state
  }
}

export default sessionReducer
