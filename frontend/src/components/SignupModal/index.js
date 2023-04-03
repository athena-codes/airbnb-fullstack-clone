import React from 'react'

function SignupModal ({ open, children, onClose }) {
  if (!open) return null

  const handleOverlayClick = e => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }
  return (
    <div onClick={handleOverlayClick}>
      <div> {children} </div>
    </div>
  )
}

export default SignupModal
