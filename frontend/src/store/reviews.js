import { csrfFetch } from './csrf'

// Action Types:
const GET = 'reviews/getReviews'
const CREATE = 'reviews/createReviews'

// Action Creators:
const getSpotReviews = reviews => {
  return {
    type: GET,
    reviews
  }
}

const createReview = review => {
  return {
    type: CREATE,
    review
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

// **** Create a Review Thunk *******
export const createReviewThunk = (review, spotId) => async dispatch => {
  const response = await csrfFetch(`/api/spots/${spotId}/reviews`, {
    method: 'POST',
    body: JSON.stringify(review)
  })

  if (response.ok) {
    const createdReview = await response.json()
    dispatch(createReview(createdReview, spotId))
    return createdReview
  }
}
export const deleteReviewThunk = deleteReview => async dispatch => {
  const response = await csrfFetch(`/api/reviews/${deleteReview}`, {
    method: 'DELETE'
  })

  if (response.ok) {
    const deleted = await response.json()
    dispatch(deleteReview(deleteReview))
    return deleted
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
    case CREATE:
      const createdReview = action.review
      return createdReview
    default:
      return state
  }
}

export default reviewsReducer
