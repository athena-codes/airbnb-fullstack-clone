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
          }
        })
        let bookingsObj
        //fix ordering
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
          bookingsObj = {
              Bookings: allBookings,
              Spot: spot
          }
        }
        res.status(200).json(bookingsObj)
    } catch (err) {
        next(err)
    }
})

module.exports = router
