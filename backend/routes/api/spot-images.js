const express = require('express')
const { SpotImage, Spot } = require('../../db/models')
const { requireAuth } = require('../../utils/auth')

const router = express.Router()

// Delete a Spot Image
// Require Authentication: true
router.delete('/:imageId', requireAuth, async (req, res, next) => {
  try {
    const imageId = req.params.imageId
    const spotImage = await SpotImage.findByPk(imageId)
    const spot = await SpotImage.findByPk(imageId, {
      attributes: ['spotId']
    })
    const user = await Spot.findByPk(spot.dataValues.spotId, {
      attributes: ['ownerId']
    })

    if (user.ownerId !== req.user.id) {
      return res.status(403).json({
        message: 'Forbidden',
        statusCode: 403
      })
    } else {
      await spotImage.destroy()

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
