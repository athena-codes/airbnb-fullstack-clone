const express = require('express')
const { Review, ReviewImage, Spot } = require('../../db/models')
const { requireAuth } = require('../../utils/auth')

const router = express.Router()

// Delete a Review Image
// Require Authentication: true
router.delete('/:imageId', requireAuth, async (req, res, next) => {
  try {
    const imageId = req.params.imageId
    const reviewImage = await ReviewImage.findOne({
      where: {
        id: imageId
      }
    })

    if (!reviewImage) {
      res.status(404).json({
        message: 'Review Image not found',
        statusCode: 404
      })
    }

    const reviewId = await ReviewImage.findByPk(reviewImage.id, {
      attributes: ['reviewId']
    })
    const review = await Review.findByPk(reviewId.reviewId, {
      attributes: ['userId']
    })

    if (review.userId !== req.user.id) {
      return res.status(403).json({
        message: 'Forbidden',
        statusCode: 403
      })
    } else {
      await reviewImage.destroy()

      res.status(200).json({
        message: 'Successfully deleted',
        statusCode: 200
      })
    }
  } catch (err) {
    next(err)
  }
})

module.exports = router
