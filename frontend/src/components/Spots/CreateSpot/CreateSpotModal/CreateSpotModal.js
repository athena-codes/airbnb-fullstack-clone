import React from 'react'
import './CreateSpotModal.css'
function CreateSpotModal ({ open, children, onClose }) {
  if (!open) return null

  const handleOverlayClick = e => {
    if (e.target === e.currentTarget) {
      // **** CREATE 'x' BUTTON TO DISABLE AUTO CLOSEOUT ON CLICK OUTSIDE OF MODAL
      onClose()
    }
  }

  return (
    <div className='create-modal-overlay' onClick={handleOverlayClick}>
      <div className='create-modal'>{children}</div>
    </div>
  )
}

export default CreateSpotModal
