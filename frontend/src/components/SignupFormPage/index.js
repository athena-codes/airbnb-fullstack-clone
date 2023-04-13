import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Redirect } from 'react-router-dom'
import * as sessionActions from '../../store/session'
import './SignupFormPage.css'

function SignupFormPage ({ onSuccess }) {
  const dispatch = useDispatch()
  const sessionUser = useSelector(state => state.session.user)
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState([])

  // when the newly signed up user is successfully logged in, redirect to homepage
  if (sessionUser) {
    return <Redirect to='/' />
  }

  const handleSubmit = e => {
    e.preventDefault()
    if (password === confirmPassword) {
      setErrors([])

      const success = dispatch(
        sessionActions.signup({
          email,
          username,
          firstName,
          lastName,
          password
        })
      ).catch(async res => {
        const data = await res.json()
        if (data && data.errors) {
          let errorMessages = []

          if (Array.isArray(data.errors)) {
            errorMessages = data.errors
          } else {
            for (const key in data.errors) {
              if (data.errors.hasOwnProperty(key)) {
                const errorValue = data.errors[key]
                if (Array.isArray(errorValue)) {
                  errorValue.forEach(errorMsg => {
                    errorMessages.push(`${key}: ${errorMsg}`)
                  })
                } else {
                  errorMessages.push(`${key}: ${errorValue}`)
                }
              }
            }
          }
          setErrors(errorMessages)
        }
      })
      if (success && onSuccess) {
        onSuccess()
      }
    }

    return setErrors([
      'Confirm Password field must be the same as the Password field'
    ])
  }

  return (
    <>
      <h1>Sign Up</h1>
      <form className='signup-form' onSubmit={handleSubmit}>
        {errors && (
          <ul>
            {errors.map((error, idx) => (
              <li key={idx}>{error}</li>
            ))}
          </ul>
        )}
        <div className='signup-input'>
          <input
            type='text'
            placeholder='Email'
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            type='text'
            placeholder='Username'
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
          />
          <input
            type='text'
            placeholder='First Name'
            value={firstName}
            onChange={e => setFirstName(e.target.value)}
            required
          />
          <input
            type='text'
            placeholder='Last Name'
            value={lastName}
            onChange={e => setLastName(e.target.value)}
            required
          />
          <input
            type='password'
            placeholder='Password'
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <input
            type='password'
            placeholder='Confirm Password'
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button type='submit' className='signup-btn'>
          Sign Up
        </button>
      </form>
    </>
  )
}

export default SignupFormPage
