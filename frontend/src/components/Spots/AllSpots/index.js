import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { getSpotsThunk } from '../../../store/spots'
import './AllSpots.css'

export default function AllSpots () {
  const spots = useSelector(state => state.spot.spots)
  const dispatch = useDispatch()
  const history = useHistory()

  useEffect(() => {
    dispatch(getSpotsThunk())
  }, [dispatch])
  if (!spots) return null

  const allSpots = Object.values(spots)

  const clickHandler = spotId => {
    history.push(`/spots/${spotId}`)
  }

  return (
    <div className='allSpots-container'>
      {allSpots[0].map(spot => {
        return (
          <div
            className='spot tooltip-on-hover'
            key={spot.id}
            onClick={() => clickHandler(spot.id)}
            data-name={spot.name}
          >
              <div className='toolip-on-hover'></div>
            <div className='tooltip' title={spot.name}>{spot.name}
            </div>
            <div className='previewImg'>
              <img
                className='spot-img'
                src={spot.previewImage || null}
                alt={`${spot.name}`}
              />
            </div>
            <div className='spot-container'>
              <div className='location-stars-container'>
                <div className='location'>
                  {spot.city}, {spot.state}
                </div>
                <div className='stars-container'>
                  <span className='stars'>
                    <p className='star-icon'>{'\u2605'}</p>
                    <p>
                      {Number(spot.avgRating)
                        ? Number(spot.avgRating).toFixed(1)
                        : 'New!'}
                    </p>
                  </span>
                </div>
              </div>
              <div className='spot-info'>
                <p className='spot-name'>{spot.name}</p>
                <p className='price'>
                  <span className='spot-price'>${spot.price}</span>
                  <p>/night</p>
                </p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
