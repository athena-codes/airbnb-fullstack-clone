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
    .withMessage('Latitude is not valid')
    .bail()
    .isNumeric()
    .withMessage('Latitude must be a number'),
  check('lng')
    .exists({ checkFalsy: true })
    .withMessage('Longitude is not valid ')
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
// let { page, size, minPrice, maxPrice } = req.query
// maxPrice = +maxPrice
// minPrice = +minPrice
// const pagination = {}

// page = +page
// size = +size

// if (!page) page = 1
// if (!size) size = 20
// if (size > 20) size = 20
// if (page > 10) page = 10

// if (!page > 0) {
//   return res
//     .json({
//       message: 'Page must be greater than or equal to 1',
//       statusCode: 400
//     })
//     .status(400)
// }

// if (!size > 0) {
//   return res
//     .json({
//       message: 'Size must be greater than or equal to 1',
//       statusCode: 400
//     })
//     .status(400)
// }

// if (page > 0 && size > 0) {
//   pagination.limit = size
//   pagination.offset = size * (page - 1)
// }

// let query = {
//   where: {},
//   include: []
// }

// let errors = {}

//     if (req.query.minPrice < 0 && req.query.maxPrice < 0) {
//     if (+req.query.minPrice && +req.query.maxPrice) {
//       errors.minPrice = 'Minimum price must be greater than or equal to 0'
//       errors.maxPrice = 'Minimum price must be greater than or equal to 0'
//     } else {
//       query.where.price = {
//            [Op.or]: [
//           { minPrice: { [Op.lte]: maxPrice } },
//           { maxPrice: { [Op.gte]: minPrice } }
//         ]
//       }
//     }
//   }

// if (req.query.maxPrice < 0) {
//   if (+req.query.maxPrice) {
//     errors.maxPrice = 'Maximum price must be greater than or equal to 0'
//   } else {
//     query.where.price = {
//       [Op.lte]: req.query.maxPrice
//     }
//   }
// }

// if (req.query.minPrice < 0) {
//   if (+req.query.minPrice) {
//     errors.minPrice = 'Minimum price must be greater than or equal to 0'
//   } else {
//     query.where.price = {
//       [Op.gte]: req.query.minPrice
//     }
//   }
// }

// if (Object.keys(errors).length !== 0) {
//   const err = new Error('Validation Error')
//   err.status = 400
//   err.errors = errors
//   return next(err)
// }

// const spots = await Spot.findAll({
//   ...pagination,
//   query
// })
router.get('/', async (req, res, next) => {
  try {
    let { page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice } =
      req.query

    if (!page) page = 1
    if (!size) size = 20
    if (size > 20) size = 20
    if (page > 10) page = 10

    let pagination = {}

    page = parseInt(page)
    size = parseInt(size)
    // minLat = parseFloat(minLat)
    // maxLat = parseFloat(maxLat)
    // minLng = parseFloat(minLng)
    // maxLng = parseFloat(maxLng)
    // minPrice = parseFloat(minPrice)
    // maxPrice = parseFloat(maxPrice)

    let errors = {}

    if (isNaN(page) || !Number.isInteger(page) || page < 1) {
      errors.page = 'Page must be greater than or equal to 1'
    }

    if (isNaN(size) || !Number.isInteger(size) || size < 1) {
      errors.size = 'Page must be greater than or equal to 1'
    }

    if (minLat && isNaN(parseFloat(minLat))) {
      minLat = parseFloat(minLat)
      errors.minLat = 'Minimum latitude is invalid'
      if (minLat < -90 || minLat > 90) {
        errors.minLat = 'Minimum latitude is invalid'
      }
    }

    if (maxLat && isNaN(parseFloat(maxLat))) {
      maxLat = parseFloat(maxLat)
      errors.maxLat = 'Maximum latitude is invalid'
      if (maxLat < -90 || maxLat > 90) {
        errors.maxLat = 'Maximum latitude is invalid'
      }
    }

    if (minLng && isNaN(parseFloat(minLng))) {
      minLng = parseFloat(minLng)
      errors.minLng = 'Minimum longitude is invalid'
      if (minLng < -180 || minLng > 180) {
        errors.minLng = 'Minimum longitude is invalid'
      }
    }

    if (maxLng && isNaN(parseFloat(maxLng))) {
      maxLng = parseFloat(maxLng)
      errors.maxLng = 'Maximum longitude is invalid'

      if (maxLng < -180 || maxLng > 180) {
        errors.maxLng = 'Maximum longitude is invalid'
      }
    }

    if (minPrice && isNaN(parseFloat(minPrice))) {
      errors.minPrice = 'Minimum price must be greater than or equal to 0'
    } else {
      minPrice = parseFloat(minPrice)
      if (minPrice < 0) {
        errors.minPrice = 'Minimum price must be greater than or equal to 0'
      }
    }

    if (maxPrice && isNaN(parseFloat(maxPrice))) {
      errors.maxPrice = 'Maximum price must be greater than or equal to 0'
    } else {
      maxPrice = parseFloat(maxPrice)
      if (maxPrice < 0) {
        errors.maxPrice = 'Maximum price must be greater than or equal to 0'
      }
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        message: 'Validation Error',
        statusCode: 400,
        errors
      })
    }

    if (page && size) {
      pagination.limit = size
      pagination.offset = size * (page - 1)
    }

    let where = {}

    if (minLat && maxLat && minLng && maxLng) {
      where = {
        lat: { [Op.between]: [minLat, maxLat] },
        lng: { [Op.between]: [minLng, maxLng] }
      }
    } else {
      if (minLat) {
        where.lat = { [Op.gte]: minLat }
      }
      if (maxLat) {
        where.lat = { ...where.lat, [Op.lte]: maxLat }
      }
      if (minLng) {
        where.lng = { [Op.gte]: minLng }
      }
      if (maxLng) {
        where.lng = { ...where.lng, [Op.lte]: maxLng }
      }
    }

    if (minPrice && maxPrice) {
      where.price = { [Op.between]: [minPrice, maxPrice] }
    } else if (minPrice) {
      where.price = { [Op.gte]: minPrice }
    } else if (maxPrice) {
      where.price = { [Op.lte]: maxPrice }
    }

    let spots = await Spot.findAll({
      ...pagination,
      where
    })

    if (spots) {
      let allSpots = []
      for (let spot of spots) {
        // -- extract properties from the spot object
        let {
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
        let review = await Review.findOne({
          where: {
            spotId: id
          },
          attributes: [
            // [Sequelize.fn('AVG', Sequelize.col('stars')), 'avgRating']
            [
              Sequelize.fn(
                'ROUND',
                Sequelize.fn('AVG', Sequelize.col('stars')),
                2
              ),
              'avgRating'
            ]
          ]
        })

        // -- find preview image and include the url if the preview attribute is set to true
        let previewImage = await SpotImage.findOne({
          where: {
            preview: true,
            spotId: id
          },
          attributes: ['url']
        })

        let spotsObj = {}

        // -- create an object with the spot's details and the avgRating & previewImage
        spotsObj = {
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
          avgRating: review.dataValues.avgRating
        }
        if (previewImage) {
          spotsObj.previewImage = previewImage.dataValues.url
        } else {
          spotsObj.previewImage = null
        }

        allSpots.push(spotsObj)
      }
      return res.status(200).json({
        Spots: allSpots,
        page,
        size
      })
    }
  } catch (err) {
    next(err)
  }
})
// ********** Create a Spot **********
// Require auth: true
router.post('/', requireAuth, validateSpot, async (req, res, next) => {
  try {
    let { address, city, state, country, name, lat, lng, description, price } =
      req.body
    let ownerId = req.user.id

    let newSpot = await Spot.create({
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

    res.status(201).json({
      id: newSpot.id,
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
      createdAt: newSpot.createdAt,
      updatedAt: newSpot.updatedAt
    })
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

    let allSpots = []

    for (let spot of spots) {
      let {
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

      let review = await Review.findAll({
        where: {
          spotId: spot.id
        },
        attributes: [[Sequelize.fn('AVG', Sequelize.col('stars')), 'avgRating']]
      })

      let previewImage = await SpotImage.findOne({
        where: {
          preview: true,
          spotId: spot.id
        },
        attributes: ['url']
      })

      let spotsObj = {
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
        avgRating: review[0].dataValues.avgRating
      }

      if (previewImage) {
        spotsObj.previewImage = previewImage.dataValues.url
      } else {
        spotsObj.previewImage = null
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

    if (!spot) {
      return res.status(404).json({
        message: 'Spot not found',
        statusCode: 404
      })
    }
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
      return res.status(200).json({
        id: spot.id,
        ownerId: spot.ownerId,
        address,
        city,
        state,
        country,
        lat,
        lng,
        name,
        description,
        price,
        createdAt: spot.createdAt,
        updatedAt: spot.updatedAt
      })
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
      const spotId = parseInt(req.params.spotId)
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
          message: 'Forbidden',
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
      return res.status(200).json({ Bookings: bookings })
    } else {
      const bookings = await Booking.findAll({
        where: {
          spotId: spotId
        },
        attributes: ['spotId', 'startDate', 'endDate']
      })
      const response = {
        Bookings: bookings
      }
      return res.status(200).json(response)
    }
  } catch (err) {
    next(err)
  }
})

module.exports = router
