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
export const createSpotsThunk =
  (newSpot, previewImage, images) => async dispatch => {
    const spotResponse = await csrfFetch(`/api/spots`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newSpot)
    })

    if (spotResponse.ok) {
      const spotData = await spotResponse.json()

      const imagesWithPreview = [
        {
          url: previewImage.url,
          preview: true
        },
        ...images.map(image => ({
          url: image.url,
          preview: false
        }))
      ]

      const imageResponses = await Promise.all(
        imagesWithPreview.map(image =>
          csrfFetch(`/api/spots/${spotData.id}/images`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(image)
          })
        )
      )

      const imageDatas = await Promise.all(
        imageResponses.map(response => response.json())
      )

      const imageDataWithPreview = imageDatas.find(
        imageData => imageData.preview
      )

      if (imageDataWithPreview) {
        spotData.previewImage = imageDataWithPreview.url
      }

      dispatch(createSpot(spotData))
      return spotData
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
