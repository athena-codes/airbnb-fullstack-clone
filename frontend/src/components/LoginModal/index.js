import React from 'react'
import './Modal.css'

function LoginModal ({ open, children, onClose }) {
  if (!open) return null

  const handleOverlayClick = e => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div className='modal-overlay' onClick={handleOverlayClick}>
      <div className='modal'>{children}</div>
    </div>
  )
}

export default LoginModal
