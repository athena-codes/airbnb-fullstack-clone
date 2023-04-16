import React from 'react'
import './UpdateSpotModal.css'

function UpdateSpotModal ({ open, children, onClose }) {
  if (!open) return null

  const handleOverlayClick = e => {
    if (e.target.classList.contains('update-modal-close')) {
      onClose()
    }
  }

  return (
    <div className='update-modal-overlay' onClick={handleOverlayClick}>
      <div className='update-modal'>
        <button className='update-modal-close' onClick={onClose}>
          X
        </button>
        {children}
      </div>
    </div>
  )
}

export default UpdateSpotModal
