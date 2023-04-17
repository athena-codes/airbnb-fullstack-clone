import { csrfFetch } from './csrf'

// Action Types:
const GET = 'reviews/getReviews'
const CREATE = 'reviews/createReviews'
const DELETE = 'reviews/deleteReview'

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

const deleteReview = deleteReview => {
  return {
    type: DELETE,
    deleteReview
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

// ****** CREATE REVIEW *******
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
    case DELETE:
      const deletedReview = action.deleteReview
      newState.allReviews = state.allReviews.filter(
        review => review.id === deletedReview
      )
      return newState
    default:
      return state
  }
}

export default reviewsReducer
