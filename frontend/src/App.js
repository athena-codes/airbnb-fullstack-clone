import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Route, Switch } from 'react-router-dom'
import * as sessionActions from './store/session'
import Navigation from './components/Navigation'
import LoginModal from './components/LoginModal'
import SignupModal from './components/SignupModal'


function App () {
  const dispatch = useDispatch()
  const [isLoaded, setIsLoaded] = useState(false)
  useEffect(() => {
    dispatch(sessionActions.restoreUser())
    setIsLoaded(true)
  }, [dispatch])

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && (
        <Switch>
          <Route exact path='/'>
            THIS IS HOME PAGE
          </Route>
          <Route path='/login'>
            <LoginModal />
          </Route>
          <Route path='/signup'>
            <SignupModal />
          </Route>
        </Switch>
      )}
    </>
  )
}

export default App
