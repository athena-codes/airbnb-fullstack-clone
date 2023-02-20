// Import modules
const express = require('express')
const router = express.Router()

const { Sequelize } = require('sequelize')
const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth')
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

// ******* Authentication Middleware Function ********
const authMiddleware = async (req, res, next) => {
  try {
    const spot = await Spot.findByPk(req.params.spotId)
    if (!spot) {
      return res.status(404).json({
        message: 'Spot not found',
        statusCode: 404
      })
    }
    if (spot.ownerId !== req.user.id) {
      return res.status(403).json({
        message: 'Forbidden',
        statusCode: 403
      })
    }
    next()
  } catch (err) {
    err.status = err.status || 500
    next(err)
  }
}

// ******** Get all spots *********
// Require auth: false
router.get('/', async (req, res, next) => {
  try {
    const spots = await Spot.findAll()

    const allSpots = []
    for (let spot of spots) {
      // -- extract properties from the spot object
      const { id, name, description, address, latitude, longitude, price } =
        spot

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

      // create an object with the spot's details and the avgRating & previewImage
      const spotList = {
        id,
        name,
        description,
        address,
        latitude,
        longitude,
        price,
        avgRating: review.dataValues.avgRating,
        previewImage: previewImage
      }
      allSpots.push(spotList)
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

      const spotList = {
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
      allSpots.push(spotList)
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
      previewImage: spot.previewImage,
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
      const err = new Error()
      err.title = 'Not found'
      err.status = 404
      err.message = [{ message: "Spot couldn't be found", statusCode: 404 }]
      return next(err)
    }
  }
})

// ******* Add an image to a spot based on spotId ********
router.post(
  '/:spotId/images',
  requireAuth,
  authMiddleware,
  async (req, res, next) => {
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
  }
)

// ******** Edit a Spot ********
router.put(
  '/:spotId',
  requireAuth,
  validateSpot,
  authMiddleware,
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

module.exports = router
