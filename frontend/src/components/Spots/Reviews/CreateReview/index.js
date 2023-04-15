import { useState } from 'react'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { getSpotReviewsThunk } from '../../../../store/reviews'

import './CreateReviewForm.css'

export default function CreateReviewForm ({ spotId, createNewReview }) {
  const dispatch = useDispatch()
  const [review, setReview] = useState('')

  const [errors, setErrors] = useState([])

  const [stars, setStars] = useState('')

  useEffect(() => {
    dispatch(getSpotReviewsThunk(spotId))
  }, [dispatch, spotId])

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
          <input
            className='star-rating'
            type='number'
            min={0}
            max={5}
            value={stars}
            onChange={e => setStars(e.target.value)}
            placeholder='Stars'
            required
          />
          <ul className='errors'>
            {errors.map((error, id) => (
              <li key={id}>{error}</li>
            ))}
          </ul>

          <button
            className='review-btn'
            type='submit'
            onClick={async e => {
              e.preventDefault()
              const res = await createNewReview(e, review, stars)
              if (res && res.errors && res.errors.length) {
                setErrors(res.errors)
              }
            }}
          >
            Submit Your Review
          </button>
        </form>
      </div>
    </div>
  )
}
