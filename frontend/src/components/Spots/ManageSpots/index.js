import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom'
import CreateSpotModal from '../CreateSpot/CreateSpotModal'
import CreateSpotForm from '../CreateSpot'
import UpdateSpotForm from '../UpdateSpot'
import UpdateSpotModal from '../UpdateSpot/UpdateSpotModal/UpdateSpotModal'
import { getSpotsThunk } from '../../../store/spots'
import { updateSpotsThunk } from '../../../store/spots'
import './ManageSpots.css'

function ManageSpots ({ createdSpotId }) {
  const spots = useSelector(state => state.spot.spots)
  const sessionUser = useSelector(state => state.session.user)
  const dispatch = useDispatch()
  const history = useHistory()
  // *** use later for delete + update modals
  const [showModal, setShowModal] = useState(false)
  const [isCreateSpotOpen, setIsCreateSpotOpen] = useState(false)
  const [isUpdateSpotOpen, setIsUpdateSpotOpen] = useState(false)
  const [updateSpot, setUpdateSpot] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [createSpot, setCreateSpot] = useState(false)
  const [showOverlay, setShowOverlay] = useState(false)

  useEffect(() => {
    dispatch(getSpotsThunk())
    setIsLoaded(true)
  }, [dispatch])

  if (!spots) return null

  const allSpots = Object.values(spots.Spots)

  let currentUserSpots
  if (sessionUser) {
    currentUserSpots = allSpots.filter(spot => spot.ownerId === sessionUser.id)
  } else {
    history.push('/')
  }

  const handleCreateSpotClick = () => {
    setIsCreateSpotOpen(true)
  }

  const handleUpdateSpotClick = () => {
    setIsUpdateSpotOpen(true)
  }

  const openCreateSpotModal = () => {
    setIsCreateSpotOpen(true)
    history.push('/')
  }

  const openUpdateSpotModal = () => {
    setIsUpdateSpotOpen(true)
    history.push('/')
  }

  const handleUpdateSuccess = () => {
    setUpdateSpot(false)
    setShowOverlay(false)
    history.push(`/spots/${createdSpotId}`)
  }

  const handleCreationSuccess = () => {
    setCreateSpot(false)
    setShowOverlay(false)
    history.push(`/spots/${createdSpotId}`)
  }

  return (
    <>
      {isLoaded && sessionUser && currentUserSpots.length > 0 ? (
        <div className='manage-spots-heading'>
          <h2 className='manage-spots-title'>Manage Your Spots</h2>
          {sessionUser && (
            <button
              className='create-spot-btn manage'
              onClick={handleCreateSpotClick}
            >
              Create a New Spot
            </button>
          )}
          {isCreateSpotOpen && (
            <CreateSpotModal
              open={openCreateSpotModal}
              // TEMPORARY DONT ALLOW CREATE SPOT TO CLOSE
              onClose={() => {
                setIsCreateSpotOpen(false)
              }}
              onSuccess={handleCreationSuccess}
            >
              <CreateSpotForm open={setIsCreateSpotOpen} />
            </CreateSpotModal>
          )}
        </div>
      ) : (
        <div className='manage-spots-heading'>
          {sessionUser && currentUserSpots.length === 0 && (
            <div>
              <h2 className='manage-spots-title'>
                Manage your hosted spots here!
              </h2>
              <button
                className='create-spot-btn manage'
                onClick={handleCreateSpotClick}
              >
                Create a New Spot
              </button>
            </div>
          )}
          {isCreateSpotOpen && (
            <CreateSpotModal
              open={openCreateSpotModal}
              // TEMPORARY DONT ALLOW CREATE SPOT TO CLOSE
              onClose={() => {
                setIsCreateSpotOpen(false)
              }}
              onSuccess={handleCreationSuccess}
            >
              <CreateSpotForm open={setIsCreateSpotOpen} />
            </CreateSpotModal>
          )}
        </div>
      )}

      <div className='manage-spots'>
        {isLoaded &&
          sessionUser &&
          currentUserSpots.map(spot => (
            <div className='manage-spot'>
              <div className='manage-spots-img1' key={spot.id}>
                <NavLink to={`/spots/${spot.id}`} key={spot.previewImage}>
                  <img src={spot.previewImage} alt='#' className='spot-img' />
                </NavLink>
                <div className='location-stars-price'>
                  <div className='location'>
                    {spot.city}, {spot.state}
                  </div>
                  <div>
                    <i className='star-icon'></i>
                    {'\u2605'}
                    {spot.avgRating ? spot.avgRating : 'New'}
                  </div>
                </div>
                <div className='manage-spots-price'>${spot.price} night</div>
                <div className='update-delete-btns'>
                  <button
                    className='update-delete-btn'
                    onClick={() => handleUpdateSpotClick(spot.id)}
                  >
                    Update
                  </button>

                  <button
                    className='update-delete-btn'
                    onClick={() => alert('Working on')}
                    >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
                    {isUpdateSpotOpen && (
                      <UpdateSpotModal
                        open={openUpdateSpotModal}
                        // TEMPORARY DONT ALLOW CREATE SPOT TO CLOSE
                        onClose={() => {
                          setIsUpdateSpotOpen(false)
                        }}
                        onSuccess={handleUpdateSuccess}
                      >
                        <UpdateSpotForm open={setIsUpdateSpotOpen} />
                      </UpdateSpotModal>
                    )}
      </div>
    </>
  )
}

export default ManageSpots
