import { useEffect, useState, useRef } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getSpotDetailsThunk } from '../../../store/spots'
import { getSpotReviewsThunk } from '../../../store/reviews'
import { createReviewThunk } from '../../../store/reviews'
import { deleteReviewThunk } from '../../../store/reviews'
import SpotReviews from '../Reviews/SpotReviews'
import './SpotDetails.css'
import reviewIcon from './images/review-icon.avif'

function SpotDetails () {
  const { id } = useParams()
  const spotDetails = useSelector(state => state.spot.spotDetails)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoaded, setIsLoaded] = useState(false)

  const dispatch = useDispatch()
  const history = useHistory()
  const reservationBoxRef = useRef(null)

  useEffect(() => {
    async function fetchSpotDetails () {
      setIsLoading(true)
      await dispatch(getSpotDetailsThunk(id))
      setIsLoading(false)
      await dispatch(getSpotReviewsThunk(id))
      setIsLoading(false)
    }
    fetchSpotDetails()
  }, [dispatch, id])

  if (!spotDetails) return null

  const {
    name,
    city,
    state,
    country,
    description,
    price,
    avgStarRating,
    numReviews
  } = spotDetails

  const previewImage = spotDetails.SpotImages.find(img => img.preview)
  const otherImages = spotDetails.SpotImages.filter(img => !img.preview)


  const createNewReview = async (e, review, stars) => {
    e.preventDefault()

    await dispatch(createReviewThunk({ review, stars }, id)).catch(
      async res => {
        const errors = []
        const data = await res.json()

        if (data && data.errors) {
          errors = data.errors
        }
      }
    )

    await dispatch(getSpotDetailsThunk(id)).then(() =>
      dispatch(getSpotReviewsThunk(id))
    )

    setIsLoaded(true)
  }

  return (
    <div className='spot-details-container'>
      <div className='spot-details'>
        <div className='spot-header'>
          <h1 className='spot-title'>{name}</h1>
          <div className='spot-location'>
            {city}, {state} {country}
          </div>
        </div>
        <div className='grid-container'>
          <div className='spot-images'>
            <img
              src={previewImage.url}
              key={previewImage.id}
              alt={previewImage.altText}
              className='preview-image'
            />
          </div>
          <div className='other-images-grid'>
            {otherImages.map(img => (
              <img
                src={img.url}
                key={img.id}
                alt={img.altText}
                className='other-image'
              />
            ))}
          </div>
        </div>
        <h2 className='hosted-by'>
          Hosted by {spotDetails.Owner.firstName} {spotDetails.Owner.lastName}
        </h2>
        <div className='description-container'>
          <div className='spot-description'>{description}</div>
          <div className='reservation-container'>
            <div ref={reservationBoxRef} className='reservation-box'>
              <div className='spot-price-box'>
                <div className='spot-price'>${price}/night</div>
                <div className='stars-reviews-box'>
                  {Number(avgStarRating) ? (
                    <>
                      <div className='spot-stars'>
                        <p>★</p>
                        <div>{Number(avgStarRating).toFixed(1)}</div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className='spot-stars-new'>
                        <p>★</p>
                        <div className='new-stars'>New</div>
                      </div>
                    </>
                  )}
                  {numReviews > 0 ? (
                    <p className='dot'>·</p>
                  ) : (
                    <p className='white-space'></p>
                  )}
                  <div className='num-reviews'>
                    {numReviews > 0 ? (
                      <div className='num-reviews'>
                        {numReviews === 1
                          ? '1 Review'
                          : `${numReviews} Reviews`}
                      </div>
                    ) : (
                      <br></br>
                    )}
                  </div>
                </div>
              </div>
              <div className='spot-reserve'>
                <button
                  className='reserve-btn'
                  onClick={() => alert('Feature coming soon!')}
                >
                  Reserve
                </button>
              </div>
            </div>
          </div>
        </div>
        <div>
          <SpotReviews createNewReview={createNewReview} />
        </div>
      </div>
    </div>
  )
}

export default SpotDetails
