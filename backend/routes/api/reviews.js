// Import modules
const express = require('express')
const router = express.Router()

const { Sequelize } = require('sequelize')
const {
  setTokenCookie,
  requireAuth,
  restoreUser,
  authMiddleware
} = require('../../utils/auth')
const { check } = require('express-validator')
const { handleValidationErrors } = require('../../utils/validation')
const {
  User,
  Spot,
  SpotImage,
  Booking,
  Review,
  ReviewImage
} = require('../../db/models')


// ******** Get all Reviews of the Current User *********
router.get('/current', requireAuth, async (req, res, next) => {
  try {
    const currentUser = req.user
    const user = User.findOne({
      where: {
        id: currentUser.id
      }
    })

    const allReviews = []
    if (user) {
      const reviews = await Review.findAll({
        where: {
          userId: req.user.id
        }
      })
      for (let rev of reviews) {
        const { id, spotId, userId, review, stars, createdAt, updatedAt } = rev

        const user = await User.findOne({
          where: {
            id: rev.userId
          },
          attributes: ['id', 'firstName', 'lastName']
        })

        const spot = await Spot.findOne({
          where: {
            id: rev.spotId
          },
          attributes: [
            'id',
            'ownerId',
            'address',
            'city',
            'state',
            'country',
            'lat',
            'lng',
            'name',
            'price',
            'previewImage'
          ]
        })

        const reviewImage = await ReviewImage.findOne({
          where: {
            reviewId: id
          },
          attributes: ['id', 'url']
        })

        const reviewsList = {
          id,
          spotId,
          userId,
          review,
          stars,
          createdAt,
          updatedAt,
          User: user,
          Spot: spot,
          ReviewImages: reviewImage
        }

        allReviews.push(reviewsList)
      }

      return res.status(200).json({ Reviews: allReviews })
    }
  } catch (err) {
    next(err)
  }
})



module.exports = router
