import React, { useState } from 'react'
import { NavLink, useHistory } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import * as sessionActions from '../../store/session'
import ProfileButton from './ProfileButton'
import LoginModal from '../LoginModal'
import SignupModal from '../SignupModal'
import LoginFormPage from '../LoginFormPage'
import SignupFormPage from '../SignupFormPage'
import CreateSpotForm from '../Spots/CreateSpot'
import CreateSpotModal from '../Spots/CreateSpot/CreateSpotModal/CreateSpotModal'
import logo from './images/MOCK.png'
import './Navigation.css'

function Navigation ({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user)
  const [isLoginOpen, setIsLogInOpen] = useState(false)
  const [isSignupOpen, setIsSignupOpen] = useState(false)
  const [isCreateSpotOpen, setIsCreateSpotOpen] = useState(false)
  const [showOverlay, setShowOverlay] = useState(false)

  const history = useHistory()
  const dispatch = useDispatch()

  const logout = e => {
    e.preventDefault()
    dispatch(sessionActions.logout())
  }

  const openLoginModal = () => {
    setIsLogInOpen(true)
    setIsSignupOpen(false)
    setShowOverlay(true)
    history.push('/')
  }

  const openSignupModal = () => {
    setIsSignupOpen(true)
    setIsLogInOpen(false)
    setShowOverlay(true)
    history.push('/')
  }

  const handleLoginSuccess = () => {
    setIsLogInOpen(false)
    setShowOverlay(false)
  }

  const handleSignupSuccess = () => {
    setIsSignupOpen(false)
    setShowOverlay(false)
  }

  const openCreateSpotForm = () => {
    setIsCreateSpotOpen(!isCreateSpotOpen)
  }

  const openCreateSpotModal = () => {
    setIsCreateSpotOpen(true)
    history.push('/')
  }

  let sessionLinks
  if (sessionUser) {
    sessionLinks = (
      <li>
        <ProfileButton user={sessionUser} />
        {/* <button onClick={logout}></button> */}
      </li>
    )
  } else {
    sessionLinks = (
      <li>
        <button className='login' onClick={openLoginModal}>
          <NavLink
            to='/login'
            style={{ textDecoration: 'none', color:'black'}}
          >
            Log In
          </NavLink>
        </button>
        <button className='logout' onClick={openSignupModal}>
          <NavLink
            to='/signup'
            style={{ textDecoration: 'none', color:'black' }}
          >
            Sign Up
          </NavLink>
        </button>
      </li>
    )
  }

  return (
    <div className='navigation-container'>
      <ul className='navigation-list'>
        <li>
          <NavLink exact to='/' className='navigation-logo'>
            <img className='logo' src={logo} alt='logo' />
          </NavLink>
        </li>
        <div className='nav-list-items'>
          {isLoaded && sessionLinks}
          {sessionUser && (
            <li>
              <button className='create-spot-btn' onClick={openCreateSpotForm}>
                Create Spot
              </button>
            </li>
          )}
        </div>
      </ul>

      {showOverlay && (
        <div
          className='overlay'
          onClick={() => {
            setIsLogInOpen(false)
            setIsSignupOpen(false)
            setShowOverlay(false)
          }}
        ></div>
      )}

      {isCreateSpotOpen && (
        <CreateSpotModal
          open={isCreateSpotOpen}
          onClose={() => {
            setIsCreateSpotOpen(false)
            setShowOverlay(false)
          }}
        >
          <CreateSpotForm onSuccess={openCreateSpotForm} />
        </CreateSpotModal>
      )}

      <LoginModal
        open={isLoginOpen}
        onClose={() => {
          setIsLogInOpen(false)
          setShowOverlay(false)
        }}
      >
        <LoginFormPage onSuccess={handleLoginSuccess} />
      </LoginModal>

      <SignupModal
        open={isSignupOpen}
        onClose={() => {
          setIsSignupOpen(false)
          setShowOverlay(false)
        }}
      >
        <SignupFormPage onSuccess={handleSignupSuccess} />
      </SignupModal>
    </div>
  )
}

export default Navigation
