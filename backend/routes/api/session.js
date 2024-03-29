const express = require('express')
const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth')
const { User } = require('../../db/models')
const { check } = require('express-validator')
const { handleValidationErrors } = require('../../utils/validation')
const router = express.Router()

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

// LOG IN
router.post('/', validateLogin, async (req, res, next) => {
  const { credential, password } = req.body
  const user = await User.login({ credential, password })
  if (!user) {
    const err = new Error('Login failed')
    res.status(401).json(
      (err.errors = {
        message: 'Invalid credentials',
        statusCode: 401
      })
    )

    return next(err)
  }
  await setTokenCookie(res, user)
  const { id, firstName, lastName, email, username } = user
  return res.json({
    user: { id, firstName, lastName, email, username }
  })
})

// RESTORE CURRENT USER
router.get('/', restoreUser, requireAuth, (req, res) => {
  const { user } = req
  if (user) {
    return res.json({
      user: user.toSafeObject()
    })
  } else return res.json({})
})

// LOG OUT
router.delete('/', (_req, res) => {
  res.clearCookie('token')
  return res.json({ message: 'success' })
})

// DEMO LOG IN
router.post('/demo', async (req, res, next) => {
  try {
    const demoUser = await User.findOne({ where: { username: 'Demo-lition' } })
    if (!demoUser) throw new Error('Demo user not found')
    await setTokenCookie(res, demoUser)
    const { id, firstName, lastName, email, username } = demoUser
    return res.json({
      user: { id, firstName, lastName, email, username }
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({
      errors: [{ message: 'Server error', statusCode: 500 }]
    })
    next(err)
  }
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
