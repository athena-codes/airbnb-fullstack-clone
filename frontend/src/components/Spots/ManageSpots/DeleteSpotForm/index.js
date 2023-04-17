import React, { useState } from 'react'

function DeleteSpotForm ({ isOpen, onConfirm, onCancel }) {
  const [isModalOpen, setIsModalOpen] = useState(isOpen)

  const handleConfirm = () => {
    setIsModalOpen(false)
    onConfirm()
  }

  const handleCancel = () => {
    setIsModalOpen(false)
    onCancel()
  }

  return (
    <div
      className={`modal-overlay ${isModalOpen ? 'open' : ''}`}
      onClick={handleCancel}
    >
      <div className='modal'>
        <p>Are you sure you want to delete this spot?</p>
        <div className='modal-buttons'>
          <button className='modal-confirm' onClick={handleConfirm}>
            Delete
          </button>
          <button className='modal-cancel' onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

export default DeleteSpotForm
