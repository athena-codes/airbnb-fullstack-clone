const router = require('express').Router()
// Import route handlers for routes
const sessionRouter = require('./session.js')
const usersRouter = require('./users.js')
const spotRouter = require('./spots.js')
const reviewsRouter = require('./reviews.js')
const bookingsRouter = require('./bookings.js')
const spotImagesRouter = require('./spot-images.js')
const reviewImagesRouter = require('./review-images.js')

const { requireAuth, restoreUser } = require('../../utils/auth.js')

router.use(restoreUser)
router.use('/session', sessionRouter)
router.use('/users', usersRouter)
router.use('/spots', spotRouter)
router.use('/reviews', reviewsRouter)
router.use('/bookings', bookingsRouter)
router.use('/spot-images', spotImagesRouter)
router.use('/review-images', reviewImagesRouter)



module.exports = router

// Test Route:
// router.get('/test', requireAuth, (req, res) => {
//   res.json({ message: 'success' })
// })

// router.post('/test', function (req, res) {
//   res.json({ requestBody: req.body })
// })

// Other test routes:

// const { restoreUser } = require('../../utils/auth.js')
// router.use(restoreUser);

// router.get(
//   '/restore-user',
//   restoreUser,
//   (req, res) => {
//     return res.json(req.user);
//   }
// );

// const { setTokenCookie } = require('../../utils/auth.js')
// const { User } = require('../../db/models')
// // GET /api/set-token-cookie
// router.get('/set-token-cookie', async (_req, res) => {
//   const user = await User.findOne({
//     where: {
//       username: 'Demo-lition'
//     }
//   })
//   setTokenCookie(res, user)
//   return res.json({ user: user })
// })
