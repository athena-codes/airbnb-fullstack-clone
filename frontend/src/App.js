import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Route, Switch } from 'react-router-dom'
import * as sessionActions from './store/session'
import Navigation from './components/Navigation'
import AllSpots from './components/Spots/AllSpots'
import ManageSpots from './components/Spots/ManageSpots'
import LoginModal from './components/LoginModal'
import SignupModal from './components/SignupModal'
import SpotDetails from './components/Spots/SpotDetails'
import UpdateSpotForm from './components/Spots/UpdateSpot'

function App () {
  const dispatch = useDispatch()
  const [isLoaded, setIsLoaded] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    dispatch(sessionActions.restoreUser())
    setIsLoaded(true)
  }, [dispatch])

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && (
        <Switch>
          <Route exact path={'/'}>
            <AllSpots />
          </Route>
          <Route path='/login'>
            <LoginModal />
          </Route>
          <Route path='/signup'>
            <SignupModal
              open={modalOpen}
              onClose={() => setModalOpen(false)}
              setModalOpen={setModalOpen}
            />
          </Route>
          <Route exact path='/spots/:id'>
            <SpotDetails />
          </Route>
          <Route path='/current'>
            <ManageSpots />
          </Route>
          <Route exact path={'/spots/:spotId/update'}>
          <UpdateSpotForm />
          </Route>
        </Switch>
      )}
    </>
  )
}

export default App
