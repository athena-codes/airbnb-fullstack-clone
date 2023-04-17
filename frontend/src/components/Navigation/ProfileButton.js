import React, { useState, useEffect, useRef } from 'react'
import { NavLink } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import * as sessionActions from '../../store/session'

function ProfileButton () {
  const dispatch = useDispatch()
  const [showMenu, setShowMenu] = useState(false)
  const ulRef = useRef()

  const user = useSelector(state => state.session.user)

  useEffect(() => {
    if (user) {
      setShowMenu(false)
    }
  }, [user])

  const logout = e => {
    e.preventDefault()
    dispatch(sessionActions.logout())
  }

  const openMenu = () => {
    setShowMenu(true)
  }

  useEffect(() => {
    if (!showMenu) return

    const closeMenu = e => {
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false)
      }
    }

    document.addEventListener('click', closeMenu)

    return () => {
      document.removeEventListener('click', closeMenu)
    }
  }, [showMenu])

  return (
    <>
      <button onClick={openMenu}>
        <i className='fas fa-user-circle hp' />
      </button>
      {showMenu && (
        <div className='dropdown-menu loggedin'>
          <ul className='profile-dropdown-loggedin open' ref={ulRef}>
            <div className='dropdown-greeting'>
              <li>Hello, {user.firstName}</li>
              <li>{user.email}</li>
            </div>

            <div className='manage-logout-btns'>
              <li>
                <NavLink className='manage-spots-nav' to='/current'>
                  Manage Spots
                </NavLink>
              </li>
              <li className='logout-btn'>
                <button className='logout' onClick={logout}>Log Out</button>
              </li>
            </div>
          </ul>
        </div>
      )}
    </>
  )
}

export default ProfileButton
