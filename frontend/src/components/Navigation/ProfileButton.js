import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import * as sessionActions from '../../store/session'

function ProfileButton ({ user }) {
  const dispatch = useDispatch()

  const logout = e => {
    e.preventDefault()
    dispatch(sessionActions.logout())
  }

  const ulClassName = 'profile-dropdown'

  return (
    <>
      <button>
        <i className='fas fa-user-circle' />
      </button>
      <ul className={ulClassName}>
        <li>{user.username}</li>
        <li>
          {user.firstName} {user.lastName}
        </li>
        <li>{user.email}</li>
      </ul>
    </>
  )
}

export default ProfileButton
