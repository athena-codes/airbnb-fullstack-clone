import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { deleteSpotThunk } from '../../../../store/spots'

function DeleteSpotModal ({ isOpen, onCancel, onDelete }) {
  if (!isOpen) {
    return null
  }

  return (
    <div className='delete-modal-overlay'>
      <div className='delete-modal'>
        <p>Are you sure you want to remove this spot from the listings?</p>
        <div className='delete-modal-buttons'>
          <button onClick={onDelete}>Yes</button>
          <button onClick={onCancel}>No</button>
        </div>
      </div>
    </div>
  )
}

export default DeleteSpotModal;
