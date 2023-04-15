import { useDispatch, useSelector} from 'react-redux'
import { useState } from 'react'
import { getSpotDetailsThunk } from '../../../../store/spots'
import { getSpotReviewsThunk } from '../../../../store/reviews'
import './SpotReviews.css'
import CreateReviewForm from '../CreateReview'
import CreateReviewModal from '../CreateReviewModal/CreateReviewModal'

// *** add session user to detect if be first to post review should show
function SpotReviews () {
  const reviews = useSelector(state => state.review.allReviews)
  const spotDetails = useSelector(state => state.spot.spotDetails)
  const [showCreateReviewModal, setShowCreateReviewModal] = useState(false)

  // console.log('REVIEWS ---> ', reviews)

  const { avgStarRating } = spotDetails

  const handleCreateReviewClick = () => {
    setShowCreateReviewModal(true)
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
          <span className='dot'>●</span>
        </h1>
        <h1 className='num-reviews'>{spotDetails.numReviews} Reviews</h1>
      </div>
      <button className='post-review-btn' onClick={handleCreateReviewClick}>
        Post Your Review
      </button>
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
              <div className='container' key={review.id}>
                <h3 className='review-user'>{review.User.firstName}</h3>
                <p className='review-date'>{date}</p>
                <p>Stars: ★{review.stars}</p>
                <div className='desc'>{review.review}</div>
              </div>
            )
          })}
        </ul>
      ) : (
        <button>Be the first to post a Review!</button>
      )}
      <CreateReviewModal
        open={showCreateReviewModal}
        onClose={() => setShowCreateReviewModal(false)}
      >
        <CreateReviewForm spotId={spotDetails.id} />
      </CreateReviewModal>
    </div>
  )
}

export default SpotReviews
