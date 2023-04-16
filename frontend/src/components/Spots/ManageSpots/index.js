import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getSpotsThunk } from '../../../store/spots'
import { Link } from 'react-router-dom'
import './ManageSpots.css'

function ManageSpots () {
  const spots = useSelector(state => state.spot.spots)
  const sessionUser = useSelector(state => state.session.user)
  const dispatch = useDispatch()
  const history = useHistory()
  const [showModal, setShowModal] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    dispatch(getSpotsThunk())
    setIsLoaded(true)
  }, [dispatch])

  if (!spots) return null

  const allSpots = Object.values(spots.Spots)

  let currentUserSpots
  if (sessionUser) {
     currentUserSpots = allSpots.filter(
      spot => spot.ownerId === sessionUser.id
    )

  } else {
    history.push('/')
  }
  console.log('CURRENT USER SPOTS --->', currentUserSpots)

  return (
    <>
      <div className='manage-spots'>
        <div className='manage-spots-header'>
          <h2 className='manage-spots-title'>Manage your Spots</h2>
        </div>

        <div className='manage-spots-container'>
          {isLoaded && sessionUser &&
            currentUserSpots.map(spot => (
              <div className='manage-spots-img1' key={spot.id}>
                <Link to={`/spots/${spot.id}`} key={spot.previewImage}>
                  <img src={spot.previewImage} alt='#' className='spot-img' />
                </Link>
                <div className='spot'>
                  <div>
                    {spot.city}, {spot.state}
                  </div>
                  <div>
                    <i class='star-icon'></i>
                    {'\u2605'}
                    {spot.avgRating ? spot.avgRating : 'New'}
                  </div>
                </div>
                <div className='manage-spots-price'>${spot.price} night</div>
              </div>
            ))}
        </div>
      </div>
    </>
  )
}

export default ManageSpots
