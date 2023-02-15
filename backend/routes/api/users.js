const express = require('express')
const router = express.Router()

const { setTokenCookie, requireAuth } = require('../../utils/auth')
const { User } = require('../../db/models')
const { check } = require('express-validator')
const { handleValidationErrors } = require('../../utils/validation')

const validateSignup = [
  // require email
  // - email exists and is a valid email,
  check('email')
  .exists({ checkFalsy: true })
  .isEmail()
  .withMessage('Please provide a valid email.'),
  // require username
  // - username is a minimum length of 4 and is not an email
  check('username')
  .exists({ checkFalsy: true })
  .isLength({ min: 4 })
  .withMessage('Please provide a username with at least 4 characters.'),
  check('username').not().isEmail().withMessage('Username cannot be an email.'),
  // require password
  // - password is not empty and has a min length of 6.
  check('password')
    .exists({ checkFalsy: true })
    .isLength({ min: 6 })
    .withMessage('Password must be 6 characters or more.'),
  handleValidationErrors
]

// Sign up
router.post('/', validateSignup, async (req, res) => {
  // The API signup route will be hit with a request body
  // holding a username, email, and password
  const { email, password, username, firstName, lastName } = req.body
  const user = await User.signup({ email, username, password, firstName, lastName })

  // If the creation is successful, the API signup route should send back
  // a JWT in an HTTP-only cookie and a response body
  await setTokenCookie(res, user)

  return res.json({
    user: user
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
