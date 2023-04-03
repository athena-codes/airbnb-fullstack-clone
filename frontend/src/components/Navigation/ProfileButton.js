import React, { useState, useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'
import * as sessionActions from '../../store/session'

function ProfileButton ({ user }) {
  const dispatch = useDispatch()
  const [showMenu, setShowMenu] = useState(false)
  const ulRef = useRef()

  const logout = e => {
    e.preventDefault()
    dispatch(sessionActions.logout())
  }

  // OPEN MENU FUNCTIONALITY
  const openMenu = () => {
    if (showMenu) return
    setShowMenu(true)
  }

  // sets the showMenu state variable to false to trigger the dropdown menu to close
  // make sure to include showMenu in dependency array
  useEffect(() => {
    if (!showMenu) return

    // change showMenu to false only if the target of the click event does NOT
    // contain the HTML element of the dropdown menu
    const closeMenu = e => {
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false)
      }
    }

    document.addEventListener('click', closeMenu)

    return () => document.removeEventListener('click', closeMenu)
  }, [showMenu])

  const ulClassName = 'profile-dropdown' + (showMenu ? '' : ' hidden')

  // had to add showMenu && inside of return for drop down effect
  return (
    <>
      <button onClick={openMenu}>
        <i className='fas fa-user-circle' />
      </button>
      {showMenu && (
        <ul className={ulClassName} ref={ulRef}>
          <li>{user.username}</li>
          <li>
            {user.firstName} {user.lastName}
          </li>
          <li>{user.email}</li>
          <li>
            <button onClick={logout}>Log Out</button>
          </li>
        </ul>
      )}
    </>
  )
}

export default ProfileButton
