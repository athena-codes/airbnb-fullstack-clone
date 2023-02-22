const express = require('express')
const router = express.Router()

const { setTokenCookie, restoreUser } = require('../../utils/auth')
const { User } = require('../../db/models')
const { check } = require('express-validator')
const { handleValidationErrors } = require('../../utils/validation')

const validateLogin = [
  check('credential')
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage('Email or username is required'),
  check('password')
    .exists({ checkFalsy: true })
    .withMessage('Password is required'),
  handleValidationErrors
]

// Get the current user
router.get('/', restoreUser, (req, res) => {
  const { user } = req

  if (user) {
    return res.json({
      user: user.toSafeObject()
    })
  } else return res.json({ user: null })
})

// Log in
router.post('/', validateLogin, async (req, res, next) => {
  // API login route will be hit with a request body holding a valid
  // credential (either username or email) and password combo
  const { credential, password } = req.body

  // login handler will look for a User with the input credential
  const user = await User.login({ credential, password })

  if (!user) {
    return res.status(400).json({
      message: 'Invalid credentials',
      statusCode: 401
    })
  }

  // the login route should send back a JWT in an
  // HTTP-only cookie and a response body
  const token = await setTokenCookie(res, user)
  // user.token = token

  console.log(req.user)
  return res.json({
    user: user.toSafeObject(),
    token
  })
  // can also do this instead of await
  //     }).then(() => {
  //   setTokenCookie(res, user)
  // })
})

// Log out
router.delete('/', (_req, res) => {
  // The API logout handler will remove the JWT cookie set by the
  // login or signup API routes and return a JSON success message
  res.clearCookie('token')
  return res.json({ message: 'success' })
})

module.exports = router

// Use http://localhost:8000/api/csrf/restore to make login/out requests

// LOGIN FETCH REQUEST
// fetch('/api/session', {
//   method: 'POST',
//   headers: {
//     'Content-Type': 'application/json',
//     'XSRF-TOKEN': 'XSRF token goes here'
//   },
//   body: JSON.stringify({ credential: 'username', password: 'password' })
// })
//   .then(res => res.json())
//   .then(data => console.log(data))

// LOGOUT FETCH REQUEST
// fetch('/api/session', {
//   method: 'DELETE',
//   headers: {
//     'Content-Type': 'application/json',
//     'XSRF-TOKEN': `<value of XSRF-TOKEN cookie>`
//   }
// })
//   .then(res => res.json())
//   .then(data => console.log(data))
// --> in http://localhost:8000/api/restore-user, we get
// user object if they are logged in or null if logged out
