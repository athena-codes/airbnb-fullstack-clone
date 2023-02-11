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
    .withMessage('Please provide a valid email or username.'),
  check('password')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a password.'),
  handleValidationErrors
]


// Log in
router.post('/', validateLogin, async (req, res, next) => {
  const { credential, password } = req.body

  const user = await User.login({ credential, password })

  if (!user) {
    const err = new Error('Login failed')
    err.status = 401
    err.title = 'Login failed'
    err.errors = ['The provided credentials were invalid.']
    return next(err)
  }

  await setTokenCookie(res, user)
  // can also do this instead of await
  //     }).then(() => {
  //   setTokenCookie(res, user)
  // })

  return res.json({
    user: user
  })
})


// Log out
router.delete('/', (_req, res) => {
  res.clearCookie('token')
  return res.json({ message: 'success' })
})

// Restore session user
router.get('/', restoreUser, (req, res) => {
  const { user } = req
  if (user) {
    return res.json({
      user: user.toSafeObject()
    })
  } else return res.json({ user: null })
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