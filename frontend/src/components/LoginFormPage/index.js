import React, { useState } from 'react'
import * as sessionActions from '../../store/session'
import { useDispatch, useSelector } from 'react-redux'
import { Redirect } from 'react-router-dom'
import './LoginFormPage.css'

function LoginFormPage ({ onSuccess }) {
  const dispatch = useDispatch()
  const sessionUser = useSelector(state => state.session.user)
  const [credential, setCredential] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState([])

  // if user is logged in will be automatically directed to homepage, saves logged in user into session
  if (sessionUser) return <Redirect to='/' />

  const handleSubmit = async e => {
    e.preventDefault()
    setErrors([])
    const success = await dispatch(
      sessionActions.login({ credential, password })
    ).catch(async res => {
      const data = await res.json()
      if (data && data.errors) setErrors(data.errors)
    })

    if (success && onSuccess) {
      onSuccess()
    }
  }

  return (
    <form onSubmit={handleSubmit} className='form'>
      <ul className='ul'>
        {errors.map((error, idx) => (
          <li key={idx} className='li'>
            {error}
          </li>
        ))}
      </ul>
      <label className='label'>
        Username or Email
        <input
          className='input'
          type='text'
          value={credential}
          onChange={e => setCredential(e.target.value)}
          required
        />
      </label>
      <label className='label'>
        Password
        <input
          className='input'
          type='password'
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
      </label>
      <button type='submit' className='button'>
        Log In
      </button>
    </form>
  )
}

export default LoginFormPage
// TEST IN CONSOLE DEV TOOLS:
// window.store.dispatch(
//   window.sessionActions.login({
//     credential: 'Test',
//     password: 'password'
//   })
// )

// LOGOUT
// window.store.dispatch(window.sessionActions.logout())