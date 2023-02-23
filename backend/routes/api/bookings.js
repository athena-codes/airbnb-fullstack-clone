const express = require('express')
const router = express.Router()

const { Sequelize, Op } = require('sequelize')
const {
  setTokenCookie,
  requireAuth,
  restoreUser,
  authMiddlewareSpot
} = require('../../utils/auth')
const { check, validationResult } = require('express-validator')
const { handleValidationErrors } = require('../../utils/validation')
const {
  User,
  Spot,
  SpotImage,
  Booking,
  Review,
  ReviewImage
} = require('../../db/models')

// ****** Get all of the Current User's Bookings *******
// Require Authentication: true
router.get('/current', requireAuth, async (req, res, next) => {
  try {
    const currentUserId = req.user.id

    const allBookings = await Booking.findAll({
      where: {
        userId: currentUserId
      },
      attributes: [
        'id',
        'spotId',
        'userId',
        'startDate',
        'endDate',
        'createdAt',
        'updatedAt'
      ]
    })

    for (let booking of allBookings) {
      const spot = await Spot.findOne({
        where: {
          ownerId: currentUserId
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
      booking.dataValues.Spot = spot
    }
    return res.status(200).json({ Bookings: allBookings })
  } catch (err) {
    next(err)
  }
})

// ****** Delete a Booking *******
// Require Authentication: true
router.delete('/:bookingId', requireAuth, async (req, res, next) => {
  try {
    const bookingId = req.params.bookingId
    const booking = await Booking.findByPk(bookingId)
    console.log(booking)

    if (!booking) {
      return res.status(404).json({
        message: 'Booking not found',
        statusCode: 404
      })
    }

    const startDate = booking.startDate
    const currentDate = new Date()
    if (new Date(startDate) <= currentDate) {
      return res.status(404).json({
        message: 'Bookings that have been started can not be deleted',
        statusCode: 403
      })
    }

    await booking.destroy()
    return res.status(200).json({
      message: 'Successfully deleted',
      statusCode: 200
    })
  } catch (err) {
    next(err)
  }
})

module.exports = router
