import { useDispatch, useSelector } from 'react-redux'
import { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { getSpotDetailsThunk } from '../../../../store/spots'
import { getSpotReviewsThunk } from '../../../../store/reviews'
import { deleteReviewThunk } from '../../../../store/reviews'
import DeleteReviewModal from '../CreateReview/DeleteReviewModal/DeleteReviewModal'
import CreateReviewForm from '../CreateReview'
import CreateReviewModal from '../CreateReviewModal/CreateReviewModal'
import './SpotReviews.css'

// *** add session user to detect if be first to post review should show
function SpotReviews ({ createNewReview }) {
  const reviews = useSelector(state => state.review.allReviews)
  const spotDetails = useSelector(state => state.spot.spotDetails)
  const sessionUser = useSelector(state => state.session.user)
  const [showCreateReviewModal, setShowCreateReviewModal] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [reviewToDelete, setReviewToDelete] = useState(null)
  const [showOverlay, setShowOverlay] = useState(false)
  const dispatch = useDispatch()
  const history = useHistory()

  const { avgStarRating } = spotDetails

  const createReviewClick = () => {
    setShowCreateReviewModal(true)
  }

  const handleDelete = reviewId => {
    setReviewToDelete(reviewId)
    setDeleteModalOpen(true)
  }

  const handleDeleteConfirm = reviewId => {
    if (reviewToDelete) {
      dispatch(deleteReviewThunk(reviewToDelete))
      setReviewToDelete(null)
    }
    setDeleteModalOpen(false)
    history.push('/')
  }

  const handleDeleteCancel = () => {
    setReviewToDelete(null)
    setDeleteModalOpen(false)
  }

  if (!reviews) return null

  return (
    <div>
      <div className='reviews-header'>
        <h1 className='stars-rating'>
          ★
          <span className='avg-rating'>
            {Number(avgStarRating) ? Number(avgStarRating).toFixed(1) : 'New'}
          </span>
          {reviews.length > 0 && <span className='dot'>●</span>}
        </h1>
        {reviews.length > 0 && (
          <h1 className='num-reviews'>{spotDetails.numReviews} Reviews</h1>
        )}
      </div>
      {sessionUser &&
        sessionUser.id !== spotDetails.Owner.id &&
        !reviews.some(review => review.userId === sessionUser.id) && (
          <div>
            <button className='post-review-btn' onClick={createReviewClick}>
              Post Your Review
            </button>
          </div>
        )}
      {reviews.length > 0 ? (
        <ul className='reviews-container'>
          {reviews.map(review => {
            const date = new Date(review.updatedAt).toLocaleDateString(
              'en-US',
              {
                month: 'long',
                year: 'numeric'
              }
            )

            return (
              <div className='review-container'>
                <div className='container' key={review.id}>
                  <h3 className='review-user'>{review.User.firstName}</h3>
                  <p className='review-date'>{date}</p>

                  <div className='desc'>{review.review}</div>
                </div>
                {sessionUser && sessionUser.id === review.userId && (
                  <button
                    className='delete-review-btn'
                    onClick={() => handleDelete(review.id)}
                  >
                    Delete Review
                  </button>
                )}
              </div>
            )
          })}
        </ul>
      ) : (
        sessionUser &&
        sessionUser.id !== spotDetails.Owner.id && (
          <button>Be the first to post a Review!</button>
        )
      )}
      <CreateReviewModal
        open={showCreateReviewModal}
        onClose={() => setShowCreateReviewModal(false)}
      >
        <CreateReviewForm
          spotId={spotDetails.id}
          createNewReview={createNewReview}
          closeModal={() => setShowCreateReviewModal(false)}
        />
      </CreateReviewModal>

      {deleteModalOpen && (
        <DeleteReviewModal
          isOpen={deleteModalOpen}
          onDelete={handleDeleteConfirm}
          onCancel={handleDeleteCancel}
          onClose={() => {
            setDeleteModalOpen(false)
            setShowOverlay(false)
          }}
        />
      )}
    </div>
  )
}

export default SpotReviews
