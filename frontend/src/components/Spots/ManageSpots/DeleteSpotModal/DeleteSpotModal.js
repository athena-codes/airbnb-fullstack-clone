import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { deleteSpotThunk } from '../../../../store/spots'

function DeleteSpotModal ({ isOpen, onCancel, onDelete, onClose }) {
  if (!isOpen) {
    return null
  }

  const handleOverlayClick = e => {
  if (e.target === e.currentTarget) {
    onClose()
  }
}

  return (
    <div className='delete-modal-overlay' onClick={handleOverlayClick}>
      <div className='delete-modal'>
        <p>Are you sure you want to remove this spot from the listings?</p>
        <div className='delete-modal-btns'>
          <button className='yes-btn' onClick={onDelete}>Yes (Delete Spot)</button>
          <button className='no-btn' onClick={onCancel}>No (Keep Spot)</button>
        </div>
      </div>
    </div>
  )
}

export default DeleteSpotModal;
