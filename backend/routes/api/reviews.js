// Import modules
const express = require('express')
const router = express.Router()

const { Sequelize } = require('sequelize')
const {
  setTokenCookie,
  requireAuth,
  restoreUser,
  authMiddlewareReview
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

        const reviewImage = await ReviewImage.findAll({
          where: {
            reviewId: id
          },
          attributes: ['id', 'url']
        })

        const reviewsObj = {
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
        allReviews.push(reviewsObj)
      }

      return res.status(200).json({ Reviews: allReviews })
    }
  } catch (err) {
    next(err)
  }
})

// ***** Add an Image to a Review based on reviewId ***
// Require Authentication: true
router.post('/:reviewId/images', requireAuth, authMiddlewareReview, async (req, res, next) => {
  try {
    const imageURL = req.body.url
    const reviewId = req.params.reviewId
    const review = await Review.findByPk(reviewId, {
      attributes: ['userId']
    })

    if (req.user.id === review.dataValues.userId) {
      const reviewImages = await ReviewImage.findAll({
        where: {
          reviewId: reviewId
        }
      })
    //   console.log(reviewImages.length)

      if (reviewImages.length >= 10) {
        return res.status(403).json({
          message: 'Maximum number of images for this resource was reached',
          statusCode: 403
        })
      }

      const newReviewImage = await ReviewImage.create({
        reviewId: reviewId,
        url: imageURL
      })

      return res.status(200).json({newReviewImage})
    }
  } catch (err) {
    next(err)
  }
})


// ******* Edit a Review *******



module.exports = router
