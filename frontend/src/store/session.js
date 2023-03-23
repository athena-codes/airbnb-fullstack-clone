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

// Reducer
const initialState = { user: null }

const sessionReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_SESSION_USER:
      return { ...state, user: action.payload }
    case REMOVE_SESSION_USER:
      return { ...state, user: null }
    default:
      return state
  }
}

export default sessionReducer
