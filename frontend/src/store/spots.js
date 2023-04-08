import { csrfFetch } from './csrf'

// Action Types
const GET = 'spots/getSpots'
const SPOT_DETAILS = 'spots/getSpotDetails'

// Action Creators

const getSpots = spots => {
  return {
    type: GET,
    payload: spots
  }
}

const getSpotDetails = spot => {
  return {
    type: SPOT_DETAILS,
    spot
  }
}


// Thunk Functions

// GET ALL SPOTS
export const getSpotsThunk = () => async dispatch => {
  const response = await csrfFetch(`/api/spots`)

  if (response.ok) {
    const allSpots = await response.json()
    dispatch(getSpots(allSpots))
    return allSpots
  }
}

// GET SPOT DETAILS
export const getSpotDetailsThunk = spotId => async dispatch => {
  const response = await csrfFetch(`/api/spots/${spotId}`)
  if (response.ok) {
    const spotDetails = await response.json()
    dispatch(getSpotDetails(spotDetails))
    return spotDetails
  }
}

// REDUCER
const initialState = {}

const spotReducer = (state = initialState, action) => {
  let newState = { ...state }
  switch (action.type) {
    case GET:
      newState = Object.assign({}, state)
      newState.spots = action.payload
      return newState;
 case SPOT_DETAILS:
      newState["spotDetails"] = action.spot;
      return newState;
    default:
      return state
  }
}

export default spotReducer
