import React, { useState } from 'react'
import { NavLink, useHistory } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import ProfileButton from './ProfileButton'
import * as sessionActions from '../../store/session'
import './Navigation.css'
import LoginModal from '../LoginModal'
import SignupModal from '../SignupModal'
import LoginFormPage from '../LoginFormPage'
import SignupFormPage from '../SignupFormPage'

function Navigation ({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user)
  const [isLoginOpen, setIsLogInOpen] = useState(false)
  const [isSignupOpen, setIsSignupOpen] = useState(false)

  const history = useHistory()

  const dispatch = useDispatch()

  const logout = e => {
    e.preventDefault()
    dispatch(sessionActions.logout())
  }

  const openLoginModal = () => {
    setIsLogInOpen(true)
    setIsSignupOpen(false)
    history.push('/')
  }

  const openSignupModal = () => {
    setIsSignupOpen(true)
    setIsLogInOpen(false)
    history.push('/')
  }

  const handleLoginSuccess = () => {
    setIsLogInOpen(false)
  }

  const handleSignupSuccess = () => {
    setIsSignupOpen(false)
  }

  let sessionLinks
  if (sessionUser) {
    sessionLinks = (
      <li>
        <ProfileButton user={sessionUser} />
        <button onClick={logout}>Log Out</button>
      </li>
    )
  } else {
    sessionLinks = (
      <li>
        <button onClick={openLoginModal}>
          <NavLink to='/login'>Log In</NavLink>
        </button>
        <button onClick={openSignupModal}>
          <NavLink to='/signup'>Sign Up</NavLink>
        </button>
      </li>
    )
  }

  return (
    <div>
      <ul>
        <li>
          <NavLink exact to='/'>
            Home
          </NavLink>
        </li>
        {isLoaded && sessionLinks}
      </ul>

      <LoginModal open={isLoginOpen} onClose={() => setIsLogInOpen(false)}>
        <LoginFormPage onSuccess={handleLoginSuccess} />
      </LoginModal>

      <SignupModal open={isSignupOpen} onClose={() => setIsSignupOpen(false)}>
        <SignupFormPage onSuccess={handleSignupSuccess} />
      </SignupModal>
    </div>
  )
}

export default Navigation
