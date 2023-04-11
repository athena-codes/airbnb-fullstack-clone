import { csrfFetch } from './csrf'

// Action Types:
const GET = 'reviews/getReviews'

// Action Creators:
const getSpotReviews = reviews => {
  return {
    type: GET,
    reviews
  }
}

// Thunk Action Creators:
export const getSpotReviewsThunk = reviews => async dispatch => {
  const response = await csrfFetch(`/api/spots/${reviews}/reviews`)

  if (response.ok) {
    const spotReviews = await response.json()
    dispatch(getSpotReviews(spotReviews))
    return spotReviews
  }
}

// Reducer
const initialState = {}
const reviewsReducer = (state = initialState, action) => {
  let newState = { ...state }
  switch (action.type) {
    case GET:
      const allReviews = action.reviews.Reviews

      newState['allReviews'] = [...allReviews]
      return newState
    default:
      return state
  }
}

export default reviewsReducer
