// backend/routes/api/index.js
const router = require('express').Router()
const { setTokenCookie } = require('../../utils/auth.js')
const { User } = require('../../db/models')

// Test Route:
router.post('/test', function (req, res) {
  res.json({ requestBody: req.body })
})

// GET /api/set-token-cookie
router.get('/set-token-cookie', async (_req, res) => {
  const user = await User.findOne({
    where: {
      username: 'Demo-lition'
    }
  })
  setTokenCookie(res, user)
  return res.json({ user: user })
})


module.exports = router
