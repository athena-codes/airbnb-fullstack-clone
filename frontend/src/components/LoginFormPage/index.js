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
  const [loginFailed, setLoginFailed] = useState(false)

  if (sessionUser) return <Redirect to='/' />

  const handleSubmit = async e => {
    e.preventDefault()
    setErrors([])
    setLoginFailed(false)

    const success = await dispatch(
      sessionActions.login({ credential, password, setErrors })
    ).catch(async res => {
      const data = await res.json()

      if (data && data.errors) {
        setErrors(data.errors)
      }
    })

    if (success && onSuccess) {
      onSuccess()
    }

    if (!success) {
      setLoginFailed(true)
    }
  }

  return (
    <div className='login-form'>
      {loginFailed && <div className='error-message'>The provided credentials were invalid.</div>}
      <form onSubmit={handleSubmit} className='form'>
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
        <ul className='ul'>
          {errors.map((error, idx) => (
            <li key={idx} className='li'>
              {error}
            </li>
          ))}
        </ul>
      </form>
    </div>
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
