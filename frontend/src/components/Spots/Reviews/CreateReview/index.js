import { useState } from 'react'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { getSpotReviewsThunk } from '../../../../store/reviews'

import './CreateReviewForm.css'

export default function CreateReviewForm ({ spotId, createNewReview, closeModal}) {
  const dispatch = useDispatch()
  const [review, setReview] = useState('')
  const [errors, setErrors] = useState([])
  const [stars, setStars] = useState('')
  const [showCreateReviewModal, setShowCreateReviewModal] = useState(false)

  useEffect(() => {
    dispatch(getSpotReviewsThunk(spotId))
  }, [dispatch, spotId])

  const handleStarClick = rating => {
    setStars(rating)
  }

  const handleSubmitReview = async e => {
    e.preventDefault()
    const res = await createNewReview(e, review, stars)
    if (res && res.errors && res.errors.length) {
      setErrors(res.errors)
    } else {
      closeModal() // close the modal after successful review submission
    }
  }

  return (
    <div className='post-review-container'>
      <div className='heading'>
        <p>How was your stay?</p>
      </div>
      <div className='form'>
        <form className='post-review-form'>
          <textarea
            className='review-desc'
            value={review}
            onChange={e => setReview(e.target.value)}
            placeholder='Leave your review here...'
            required
          />
          <div className='star-rating'>
            {[1, 2, 3, 4, 5].map(rating => (
              <span
                key={rating}
                className={rating <= stars ? 'filled' : ''}
                onClick={() => handleStarClick(rating)}
              >
                {rating <= stars ? '✭' : '☆'}
              </span>
            ))}
          </div>
          <ul className='errors'>
            {errors.map((error, id) => (
              <li key={id}>{error}</li>
            ))}
          </ul>

          <button
            className='review-btn'
            type='submit'
            onClick={handleSubmitReview}
          >
            Submit Your Review
          </button>
        </form>
      </div>
    </div>
  )
}
