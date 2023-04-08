import { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getSpotDetailsThunk } from '../../../store/spots'
import './SpotDetails.css'
import reviewIcon from './images/review-icon.avif'

function SpotDetails () {
  const { id } = useParams()
  const dispatch = useDispatch()
  const spotDetails = useSelector(state => state.spot.spotDetails)
  const [isLoading, setIsLoading] = useState(true)
  const reservationBoxRef = useRef(null)

  useEffect(() => {
    async function fetchSpotDetails () {
      setIsLoading(true)
      await dispatch(getSpotDetailsThunk(id))
      setIsLoading(false)
    }
    fetchSpotDetails()
  }, [dispatch, id])

  useEffect(() => {
    const reservationBox = reservationBoxRef.current

    const handleScroll = () => {
      if (reservationBox) {
        const reservationBoxRect = reservationBox.getBoundingClientRect()
        const reservationBoxTop = reservationBoxRect.top
        const reservationBoxHeight = reservationBoxRect.height
        const reservationBoxBottom = reservationBoxTop + reservationBoxHeight

        if (
          reservationBoxTop < 0 &&
          reservationBoxBottom > window.innerHeight
        ) {
          reservationBox.style.position = 'fixed'
          reservationBox.style.top = '0'
        } else {
          reservationBox.style.position = 'static'
        }
      }
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  if (isLoading) return <div>Loading...</div>
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

  return (
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
              <div className='spot-price'>${price} per night</div>
              <div className='spot-stars'>
                {Number(avgStarRating) ? Number(avgStarRating).toFixed(1) : '0'}{' '}
                ⭐️
              </div>
              <div className='num-reviews'>
                {numReviews}
                <img
                  className='review-logo'
                  src={reviewIcon}
                  alt='review thread'
                ></img>
              </div>
            </div>
            <div className='spot-reserve'>
              <button className='reserve-btn'>Reserve</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SpotDetails
