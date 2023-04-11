import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { getSpotDetailsThunk } from '../../../../store/spots'
import { getSpotReviewsThunk } from '../../../../store/reviews'

function SpotReviews () {
  const dispatch = useDispatch()

  const sessionUser = useSelector(state => state.session.user)
  const spotDetails = useSelector(state => state.spot.spotDetails)
  const reviews = useSelector(state => state.review.allReviews)
  console.log( 'REVIEWSSSS', reviews)

  if (!reviews || !reviews.length) return null

  return (
    <div>
      <ul>
        {reviews.map(review => {
          return (
            <div className='container' key={review.id}>
              <h3 className='review-user'>{review.User.firstName}</h3>
              <p>Stars : ★{review.stars}</p>
              <div className='desc'>{review.review}</div>
            </div>
          )
        })}
      </ul>
    </div>
  )
}

export default SpotReviews
