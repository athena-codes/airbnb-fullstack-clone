import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom'
import { getSpotsThunk } from '../../../store/spots'
import { getSpotDetailsThunk } from '../../../store/spots'
import { deleteSpotThunk } from '../../../store/spots'
import CreateSpotForm from '../CreateSpot'
import CreateSpotModal from '../CreateSpot/CreateSpotModal'
import DeleteSpotModal from './DeleteSpotModal/DeleteSpotModal'
import './ManageSpots.css'

function ManageSpots ({ createdSpotId }) {
  const spots = useSelector(state => state.spot.spots)
  console.log('SPOTS  ', spots)
  const sessionUser = useSelector(state => state.session.user)
  // *** use later for delete + update modals
  const [createSpot, setCreateSpot] = useState(false)
  const [isCreateSpotOpen, setIsCreateSpotOpen] = useState(false)
  const [spotToDelete, setSpotToDelete] = useState(null)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [showOverlay, setShowOverlay] = useState(false)

  const dispatch = useDispatch()
  const history = useHistory()

  const allSpots = spots?.Spots ? Object.values(spots.Spots) : []

  let currentUserSpots
  if (sessionUser) {
    currentUserSpots = allSpots.filter(spot => spot.ownerId === sessionUser.id)
  } else {
    history.push('/')
  }
  useEffect(() => {
    dispatch(getSpotsThunk())
    setIsLoaded(true)
  }, [dispatch])

  const handleCreateSpotClick = () => {
    setIsCreateSpotOpen(true)
  }

  const handleUpdateSpotClick = async (e, spotId) => {
    e.preventDefault()
    await dispatch(getSpotDetailsThunk(spotId)).then(() =>
      history.push(`/spots/${spotId}/update`)
    )
  }

  const openCreateSpotModal = () => {
    setIsCreateSpotOpen(true)
    history.push('/')
  }

  const handleCreationSuccess = () => {
    setCreateSpot(false)
    setShowOverlay(false)
    history.push(`/spots/${createdSpotId}`)
  }

  const handleDelete = spotId => {
    setSpotToDelete(spotId)
    setDeleteModalOpen(true)
  }

  const handleDeleteConfirm = () => {
    if (spotToDelete) {
      dispatch(deleteSpotThunk(spotToDelete))
      setSpotToDelete(null)
    }
    setDeleteModalOpen(false)
    history.push('/')
  }

  const handleDeleteCancel = () => {
    setSpotToDelete(null)
    setDeleteModalOpen(false)
  }

  if (!spots) return null

  return (
    currentUserSpots && (
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
                      onClick={e => handleUpdateSpotClick(e, spot.id)}
                    >
                      Update
                    </button>

                    <button
                      className='update-delete-btn'
                      onClick={() => handleDelete(spot.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
        {deleteModalOpen && (
          <DeleteSpotModal
            isOpen={deleteModalOpen}
            onDelete={handleDeleteConfirm}
            onCancel={handleDeleteCancel}
          />
        )}
      </>
    )
  )
}

export default ManageSpots
