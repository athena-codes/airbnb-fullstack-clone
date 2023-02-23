// Import modules
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

// ********** Validate a Review **********
const validateReviews = [
  check('stars')
    .exists({ checkFalsy: true })
    .isInt({ min: 1, max: 5 })
    .withMessage('Stars must be an integer from 1 to 5'),
  check('review')
    .exists({ checkFalsy: true })
    .withMessage('Review text is required'),
  handleValidationErrors
]

// ********** Validate a Spot **********
const validateSpot = [
  check('address')
    .exists({ checkFalsy: true })
    .withMessage('Street address is required'),
  check('city').exists({ checkFalsy: true }).withMessage('City is required'),
  check('state').exists({ checkFalsy: true }).withMessage('State is required'),
  check('country')
    .exists({ checkFalsy: true })
    .withMessage('Country is required'),
  check('lat')
    .exists({ checkFalsy: true })
    .withMessage('Latitude is required')
    .bail()
    .isNumeric()
    .withMessage('Latitude must be a number'),
  check('lng')
    .exists({ checkFalsy: true })
    .withMessage('Longitude is required')
    .bail()
    .isNumeric()
    .withMessage('Longitude must be a number'),
  check('name')
    .exists({ checkFalsy: true })
    .withMessage('Name is required')
    .bail()
    .isLength({ max: 49 })
    .withMessage('Name must be less than 50 characters'),
  check('description')
    .exists({ checkFalsy: true })
    .withMessage('Description is required'),
  check('price')
    .exists({ checkFalsy: true })
    .withMessage('Price per day is required')
    .bail()
    .isNumeric()
    .withMessage('Price must be a number'),
  handleValidationErrors
]

// ******** Get all spots *********
// Require auth: false
router.get('/', async (req, res, next) => {
  try {
    const spots = await Spot.findAll()

    const allSpots = []
    for (let spot of spots) {
      // -- extract properties from the spot object
      const {
        ownerId,
        id,
        name,
        description,
        address,
        lat,
        lng,
        city,
        state,
        country,
        price,
        createdAt,
        updatedAt
      } = spot

      // -- get avg review star rating and assign column name for it avgRating
      const review = await Review.findOne({
        where: {
          spotId: id
        },
        attributes: [[Sequelize.fn('AVG', Sequelize.col('stars')), 'avgRating']]
      })

      // -- find preview image and include the url if the preview attribute is set to true
      const previewImage = await SpotImage.findOne({
        where: {
          preview: true,
          spotId: id
        },
        attributes: ['url']
      })
      // -- create an object with the spot's details and the avgRating & previewImage
      const spotsObj = {
        id,
        ownerId,
        name,
        description,
        address,
        city,
        state,
        country,
        lat,
        lng,
        price,
        createdAt,
        updatedAt,
        avgRating: review.dataValues.avgRating,
        previewImage: previewImage
      }
      allSpots.push(spotsObj)
    }
    return res.json({
      Spots: allSpots
    })
  } catch (err) {
    next(err)
  }
})

// ********** Create a Spot **********
// Require auth: true
router.post('/', requireAuth, validateSpot, async (req, res, next) => {
  try {
    const {
      address,
      city,
      state,
      country,
      name,
      lat,
      lng,
      description,
      price
    } = req.body
    const ownerId = req.user.id

    const newSpot = await Spot.create({
      ownerId,
      address,
      city,
      state,
      country,
      lat,
      lng,
      name,
      description,
      price
    })
    res.status(201).json(newSpot)
  } catch (err) {
    next(err)
  }
})

// ****** Get all spots owned by Current User ******
// Require auth: true
router.get('/current', requireAuth, async (req, res, next) => {
  try {
    let spots = await Spot.findAll({
      where: {
        ownerId: req.user.id
      }
    })

    const allSpots = []

    for (let spot of spots) {
      const {
        id,
        ownerId,
        address,
        city,
        state,
        country,
        name,
        lat,
        lng,
        description,
        price,
        createdAt,
        updatedAt
      } = spot.dataValues

      const review = await Review.findAll({
        where: {
          spotId: spot.id
        },
        attributes: [[Sequelize.fn('AVG', Sequelize.col('stars')), 'avgRating']]
      })

      const previewImage = await SpotImage.findOne({
        where: {
          preview: true,
          spotId: spot.id
        },
        attributes: ['url']
      })

      const spotsObj = {
        id,
        ownerId,
        address,
        city,
        state,
        country,
        lat,
        lng,
        name,
        description,
        price,
        createdAt,
        updatedAt,
        avgRating: review[0].dataValues.avgRating,
        previewImage: previewImage
      }
      allSpots.push(spotsObj)
    }
    return res.status(200).json({ Spots: allSpots })
  } catch (err) {
    next(err)
  }
})

// ******* Get details of a spot based on spotId *******
// Require authentication: false
router.get('/:spotId', async (req, res, next) => {
  try {
    const spotId = req.params.spotId
    const spot = await Spot.findByPk(spotId)

    const reviews = await Review.findAll({
      where: {
        spotId: spotId
      },
      attributes: ['stars']
    })

    // numReviews/avgStarRating
    const numReviews = reviews.length
    let sum = 0
    for (let review of reviews) {
      sum += review.stars
    }
    const avgStarRating = sum / numReviews

    const spotImages = await SpotImage.findAll({
      where: {
        preview: true,
        spotId: spotId
      },
      attributes: ['id', 'url', 'preview']
    })

    const owner = await User.findOne({
      where: {
        id: spot.ownerId
      },
      attributes: ['id', 'firstName', 'lastName']
    })

    res.status(200).json({
      id: spot.id,
      ownerId: spot.ownerId,
      address: spot.address,
      city: spot.city,
      state: spot.state,
      country: spot.country,
      lat: spot.lat,
      lng: spot.lng,
      name: spot.name,
      description: spot.description,
      price: spot.price,
      createdAt: spot.createdAt,
      updatedAt: spot.updatedAt,
      numReviews: numReviews,
      avgStarRating: avgStarRating,
      SpotImages: spotImages,
      Owner: owner
    })
  } catch (err) {
    const spot = await Spot.findByPk(req.params.spotId)

    if (!spot) {
      return res.status(404).json({
        message: 'Spot not found',
        statusCode: 404
      })
    }
  }
})

// ******* Add an image to a spot based on spotId ********
// --> Created new instance of a SpotImage in the DB
// Require authentication: true
router.post(
  '/:spotId/images',
  requireAuth,
  authMiddlewareSpot,
  async (req, res, next) => {
    try {
      const spotId = req.params.spotId
      const spot = await Spot.findByPk(spotId)
      const { url, preview } = req.body

      const newSpotImage = await SpotImage.create({
        spotId: spotId,
        url: url,
        preview: preview
      })

      res.status(200).json({
        id: newSpotImage.id,
        url: newSpotImage.url,
        preview: newSpotImage.preview
      })
    } catch (err) {
      next(err)
    }
  }
)

// ******** Edit a Spot ********
// Require Authentication: true
router.put(
  '/:spotId',
  requireAuth,
  validateSpot,
  authMiddlewareSpot,
  async (req, res) => {
    try {
      const {
        address,
        city,
        state,
        country,
        lat,
        lng,
        name,
        description,
        price
      } = req.body
      const spotId = req.params.spotId

      const spot = await Spot.findByPk(spotId)

      spot.update({
        address,
        city,
        state,
        country,
        lat,
        lng,
        name,
        description,
        price
      })
      return res.status(200).json(spot)
    } catch (err) {
      next(err)
    }
  }
)

// ********* Delete a Spot ***********
// Require Authentication: true
router.delete(
  '/:spotId',
  requireAuth,
  authMiddlewareSpot,
  async (req, res, next) => {
    try {
      const spotId = req.params.spotId
      const spot = await Spot.findByPk(spotId)

      await spot.destroy()
      return res.status(200).json({
        message: 'Successfully deleted',
        statusCode: 200
      })
    } catch (err) {
      next(err)
    }
  }
)

// ****** Create a Review **********
router.post(
  '/:spotId/reviews',
  requireAuth,
  validateReviews,
  async (req, res, next) => {
    try {
      const spotId = req.params.spotId
      const spot = await Spot.findByPk(spotId)
      const { review, stars } = req.body

      if (!spot) {
        return res.status(404).json({
          message: 'Spot not found',
          statusCode: 404
        })
      }

      const reviews = await Review.findAll({
        where: {
          spotId: spotId
        }
      })

      for (let review of reviews) {
        if (review.userId === req.user.id) {
          return res.status(403).json({
            message: 'User already has a review for this spot',
            statusCode: 403
          })
        }
      }

      const newReview = await Review.create({
        userId: req.user.id,
        spotId: spotId,
        review: review,
        stars: stars
      })
      return res.status(201).json(newReview)
    } catch (err) {
      next(err)
    }
  }
)

// ***** Get all Reviews by a Spot's id *******
// Require Authentication: false
router.get('/:spotId/reviews', async (req, res, next) => {
  try {
    const spotId = req.params.spotId
    const spot = await Spot.findByPk(spotId)

    const allReviews = []

    if (spot) {
      const reviews = await Review.findAll({
        where: {
          spotId: spotId
        },
        attributes: [
          'id',
          'userId',
          'spotId',
          'review',
          'stars',
          'createdAt',
          'updatedAt'
        ]
      })
      for (let rev of reviews) {
        const { id, spotId, userId, review, stars, createdAt, updatedAt } = rev

        const user = await User.findOne({
          where: {
            id: rev.userId
          },
          attributes: ['id', 'firstName', 'lastName']
        })

        const reviewImage = await ReviewImage.findAll({
          where: {
            reviewId: id
          },
          attributes: ['id', 'url']
        })

        const reviewsObj = {
          id,
          userId,
          spotId,
          review,
          stars,
          createdAt,
          updatedAt,
          User: user,
          ReviewImages: reviewImage
        }

        allReviews.push(reviewsObj)
      }
      return res.status(200).json({ Reviews: allReviews })
    } else {
      return res.status(404).json({
        message: 'Spot not found',
        statusCode: 404
      })
    }
  } catch (err) {
    next(err)
  }
})

// Create a Booking from a Spot based on the Spot's id
// Require Authentication: true
router.post(
  '/:spotId/bookings',
  requireAuth,
  validateBooking,
  async (req, res, next) => {
    try {
      const spotId = req.params.spotId
      const spot = await Spot.findByPk(spotId)
      const userId = req.user.id
      const { startDate, endDate } = req.body

      // spot not found
      if (!spot) {
        return res.status(404).json({
          message: "Spot couldn't be found",
          statusCode: 404
        })
      }

      // spot belongs to owner
      if (spot.ownerId === userId) {
        return res.status(403).json({
          message: 'Cannot create booking for a spot you own',
          statusCode: 403
        })
      }

      // endDate before or on startDate
      if (startDate >= endDate) {
        return res.status(400).json({
          message: 'Validation error',
          statusCode: 400,
          errors: {
            endDate: 'endDate cannot be on or before startDate'
          }
        })
      }

      // booking with same startDate or endDate
      const conflictingBooking = await Booking.findOne({
        where: {
          spotId,
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

      // if exits, create appropiate errors
      if (conflictingBooking) {
        const errors = {}

        if (
          new Date(startDate) >= new Date(conflictingBooking.startDate) &&
          new Date(startDate) <= new Date(conflictingBooking.endDate)
        ) {
          errors.startDate = 'Start date conflicts with an existing booking'
        }

        if (
          new Date(endDate) >= new Date(conflictingBooking.startDate) &&
          new Date(endDate) <= new Date(conflictingBooking.endDate)
        ) {
          errors.endDate = 'End date conflicts with an existing booking'
        }

        return res.status(403).json({
          message: 'Sorry, this spot is already booked for the specified dates',
          statusCode: 403,
          errors: errors
        })
      }

      // booking cannot be made in the past
      const currentDate = new Date()
      if (
        new Date(startDate) <= new Date(currentDate) &&
        new Date(endDate) <= new Date(currentDate)
      ) {
        return res.status(400).json({
          message: 'Booking cannot be made for dates in the past',
          statusCode: 400
        })
      }

      // create booking
      const newBooking = await Booking.create({
        spotId,
        userId,
        startDate,
        endDate
      })

      // return new booking
      return res.status(200).json(newBooking)
    } catch (err) {
      return next(err)
    }
  }
)

// Get all Bookings for a Spot based on the Spot's id
// Require Authentication: true
router.get('/:spotId/bookings', requireAuth, async (req, res, next) => {
  try {
    const spotId = req.params.spotId
    const spot = await Spot.findByPk(spotId)

    if (!spot) {
      return res.status(404).json({
        message: "Spot couldn't be found",
        statusCode: 404
      })
    }

    if (req.user.id === spot.ownerId) {
      const bookings = await Booking.findAll({
        //fix ordering
        include: [
          {
            model: User,
            attributes: ['id', 'firstName', 'lastName']
          }
        ],
        where: {
          spotId: req.params.spotId
        }
      })
      res.json({ Booking: bookings })
    } else {
      const bookings = await Booking.findAll({
        where: {
          spotId: spotId
        },
        attributes: ['spotId', 'startDate', 'endDate']
      })
      const user = await User.findAll({
        where: {
          id: spot.ownerId
        },
        attributes: ['id', 'firstName', 'lastName']
      })

      const response = {
        Bookings: bookings,
        User: user
      }

      res.status(200).json(response)
    }
  } catch (err) {
    next(err)
  }
})

module.exports = router
