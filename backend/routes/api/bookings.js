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

// ****** Validate a Booking ********
const validateBooking = [
  check('startDate')
    .exists({ checkFalsy: true })
    .notEmpty()
    .isISO8601()
    .withMessage('The start date is not a valid date.'),
  check('endDate')
    .exists({ checkFalsy: true })
    .notEmpty()
    .isISO8601()
    .withMessage('The end date is not a valid date.'),
  handleValidationErrors
]

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

// Edit a Booking
// Require Authentication: true
router.put(
  '/:bookingId',
  requireAuth,
  validateBooking,
  async (req, res, next) => {
    try {
      let { startDate, endDate } = req.body
      startDate = new Date(startDate)
      endDate = new Date(endDate)
      const bookingId = req.params.bookingId
      let bookingToUpdate = await Booking.findByPk(bookingId)
      const userId = await Booking.findByPk(bookingId, {
        attributes: ['userId']
      })

      if (bookingToUpdate.userId !== req.user.id) {
        return res.status(403).json({
          message: 'Cannot edit booking you do not own',
          statusCode: 403
        })
      }

      if (!bookingToUpdate) {
        return res.status(404).json({
          message: 'Booking not found',
          statusCode: 404
        })
      }

      if (req.user.id === userId.dataValues.userId) {
        if (endDate <= startDate) {
          return res.status(400).json({
            message: 'Validation error',
            statusCode: 400,
            errors: {
              endDate: 'endDate cannot be on or before startDate'
            }
          })
        }

        // find the booking where...
        // -- id matches input
        // -- the startDate + endDate's being input by user are between (including)
        // the start + end dates of an existing booking
        // -- if start date being input is <= to start date of existing booking
        // -- if end date being input is <= to start date of existing booking

        const conflictingBooking = await Booking.findOne({
          where: {
            id: bookingId,
            [Op.or]: [
              { startDate: { [Op.between]: [startDate, endDate] } },
              { endDate: { [Op.between]: [startDate, endDate] } },
              {
                startDate: { [Op.lte]: startDate },
                endDate: { [Op.gte]: endDate }
              }
            ]
          }
        })

        if (conflictingBooking) {
          const errors = {}

          if (
            startDate >= new Date(conflictingBooking.startDate) &&
            startDate <= new Date(conflictingBooking.endDate)
          ) {
            errors.startDate = 'Start date conflicts with an existing booking'
          }

          if (
            endDate >= new Date(conflictingBooking.startDate) &&
            endDate <= new Date(conflictingBooking.endDate)
          ) {
            errors.endDate = 'End date conflicts with an existing booking'
          }

          return res.status(403).json({
            message:
              'Sorry, this spot is already booked for the specified dates',
            statusCode: 403,
            errors: errors
          })
        }

        bookingToUpdate.update({
          startDate,
          endDate
        })
      }
      return res.status(200).json(bookingToUpdate)
    } catch (err) {
      next(err)
    }
  }
)

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
      return res.status(403).json({
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
