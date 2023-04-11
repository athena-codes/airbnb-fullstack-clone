import { csrfFetch } from './csrf'

// Action Types
const GET = 'spots/getSpots'
const SPOT_DETAILS = 'spots/getSpotDetails'
const CREATE = 'spots/createSpot'

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
const createSpot = newSpot => {
  return {
    type: CREATE,
    newSpot
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

// CREATE SPOT
export const createSpotsThunk = (newSpot, previewImage) => async dispatch => {
  const res = await csrfFetch(`/api/spots`, {
    method: 'POST',
    body: JSON.stringify(newSpot)
  })

  if (res.ok) {
    const createdSpot = await res.json()

    const imageResponse = await csrfFetch(
      `/api/spots/${createdSpot.id}/images`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: previewImage.url,
          preview: true
        })
      }
    )

    if (imageResponse.ok) {
      const image = await imageResponse.json()
      createdSpot.previewImage = image.url

      dispatch(createSpot(createdSpot))

      return createdSpot
    }
    dispatch(createSpot(createdSpot))
    return createdSpot
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
      return newState
    case SPOT_DETAILS:
      newState['spotDetails'] = action.spot
      return newState
    case CREATE:
      const createSpot = action.newSpot
      return createSpot
    default:
      return state
  }
}

export default spotReducer
