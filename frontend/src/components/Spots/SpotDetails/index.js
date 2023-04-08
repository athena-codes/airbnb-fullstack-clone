import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getSpotDetailsThunk } from '../../../store/spots'
import './SpotDetails.css'
import reviewIcon from './images/review-icon.avif'

function SpotDetails () {
  const { id } = useParams()
  const dispatch = useDispatch()
  const spotDetails = useSelector(state => state.spot.spotDetails)
  console.log('DETAILS', spotDetails)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchSpotDetails () {
      setIsLoading(true)
      await dispatch(getSpotDetailsThunk(id))
      setIsLoading(false)
    }
    fetchSpotDetails()
  }, [dispatch, id])

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

  // filter the SpotImages array to get the preview image
  const previewImage = spotDetails.SpotImages.find(img => img.preview)

  // filter the SpotImages array to get the other images
  const otherImages = spotDetails.SpotImages.filter(img => !img.preview)

  return (
    <div className='spot-details'>
      <div className='spot-header'>
        <h1>{name}</h1>
        <div className='spot-location'>
          {city}, {state} {country}
        </div>
      </div>
      <div className='grid-container'>
        <div className='spot-images'>
          {/* render the preview image */}
          <img
            src={previewImage.url}
            key={previewImage.id}
            alt={previewImage.altText}
            className='preview-image'
          />
        </div>

        {/* render the other images in a grid */}
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
      <h2>
        Hosted by {spotDetails.Owner.firstName} {spotDetails.Owner.lastName}
      </h2>
      <div className='spot-description'>{description}</div>
      <div className='spot-info'>
        <div className='reservation-box'>
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
  )
}

export default SpotDetails
