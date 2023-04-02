const express = require('express')
const router = express.Router()

const { setTokenCookie, requireAuth } = require('../../utils/auth')
const { User } = require('../../db/models')
const { check } = require('express-validator')
const { handleValidationErrors } = require('../../utils/validation')


const validateSignup = [
  check('email')
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage('Invalid email'),
  check('username')
    .exists({ checkFalsy: true })
    .withMessage('Username is required')
    .bail()
    .isLength({ min: 4 })
    .withMessage('Please provide a username with at least 4 characters.'),
  check('username').not().isEmail().withMessage('Username cannot be an email.'),
  check('password')
    .exists({ checkFalsy: true })
     .withMessage('Password is required')
     .bail()
    .isLength({ min: 6 })
    .withMessage('Password must be 6 characters or more.'),
  check('firstName')
    .exists({ checkFalsy: true })
    .withMessage('First name is required'),
  check('lastName')
    .exists({ checkFalsy: true })
    .withMessage('Last name is required'),

  handleValidationErrors
]

// Sign up
router.post('/', validateSignup, async (req, res, next) => {
  const { email, password, username, firstName, lastName } = req.body

  const existingEmail = await User.findOne({
    where: { email }
  })

  const existingUsername = await User.findOne({
    where: { username }
  })

  if (existingEmail) {
    res.status(403)
    return res.json({
      message: 'User already exists',
      statusCode: 403,
      errors: ['User with that email already exists']
    })
  }

  if (existingUsername) {
    res.status(403)
    return res.json({
      message: 'User already exists',
      statusCode: 403,
      errors: ['User with that username already exists']
    })
  }
  const user = await User.signup({
    firstName,
    lastName,
    email,
    username,
    password
  })

  let token = await setTokenCookie(res, user)

  return res.json({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      username: user.username,
      token: token
  })
})

module.exports = router

// Use http://localhost:8000/api/csrf/restore to make signup requests

// SIGN UP FETCH REQUEST
// fetch('/api/users', {
//   method: 'POST',
//   headers: {
//     'Content-Type': 'application/json',
//     'XSRF-TOKEN': `<value of XSRF-TOKEN cookie>`
//   },
// body: JSON.stringify({
//   email: '<user>@email.com',
//   username: 'username',
//   firstName: 'firstName',
//   lastName: 'lastName',
//   password: 'password'
// })
// })
//   .then(res => res.json())
//   .then(data => console.log(data))
