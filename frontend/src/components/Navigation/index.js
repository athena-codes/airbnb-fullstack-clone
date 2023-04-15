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
import CreateSpotModal from '../Spots/CreateSpot/CreateSpotModal'
import logo from './images/MOCK.png'
import './Navigation.css'

function Navigation ({ isLoaded, createdSpotId }) {
  const sessionUser = useSelector(state => state.session.user)
  const [isLoginOpen, setIsLogInOpen] = useState(false)
  const [isSignupOpen, setIsSignupOpen] = useState(false)
  const [isCreateSpotOpen, setIsCreateSpotOpen] = useState(false)
  const [createSpot, setCreateSpot] = useState(false)
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

  const handleCreationSuccess = () => {
    setCreateSpot(false)
    setShowOverlay(false)
    history.push(`/spots/${createdSpotId}`)
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
      <div className='navigation'>

      <li>
        <button className='login' onClick={openLoginModal}>
          <NavLink
            to='/login'
            style={{ textDecoration: 'none', color: 'black'}}
            >
            Log In
          </NavLink>
        </button>
        <button className='signup' onClick={openSignupModal} >
          <NavLink
            to='/signup'
            style={{ textDecoration: 'none', color: 'black' }}
            >
            Sign Up
          </NavLink>
        </button>
      </li>
            </div>
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
          {sessionUser && (
            <li>
              <button className='create-spot-btn' onClick={openCreateSpotForm}>
                Airbnb your home
              </button>
            </li>
          )}
          {isLoaded && sessionLinks}
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
          open={openCreateSpotModal}
          onClose={() => {
            setIsCreateSpotOpen(false)
            setShowOverlay(false)
          }}
          onSuccess = { handleCreationSuccess }
        >
          <CreateSpotForm
          open={setIsCreateSpotOpen}
          />
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
