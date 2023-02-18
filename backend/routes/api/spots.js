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
  check('name')
    .exists({ checkFalsy: true })
    .withMessage('Name must be less than 50 characters')
    .isLength({ max: 49 })
    .withMessage('Longitude is required'),
  check('description')
    .exists({ checkFalsy: true })
    .withMessage('Description is required'),
  check('price')
    .exists({ checkFalsy: true })
    .withMessage('Price per day is required'),
  handleValidationErrors
]

// ******** Get all spots *********
// Require auth: false
router.get('/', async (req, res, next) => {
    console.log(req.user)
  const spots = await Spot.findAll()

  const allSpots = []
  for (let i = 0; i < spots.length; i++) {
    const spot = spots[i]
    // extract properties from the spot object
    const { id, name, description, address, latitude, longitude, price } = spot

    // get avg review star rating and assign column name for it avgRating
    const review = await Review.findAll({
      where: {
        spotId: spot.id
      },
      attributes: [[Sequelize.fn('AVG', Sequelize.col('stars')), 'avgRating']],
      raw: true
    })

    // find preview image and include the url if the preview attribute is set to true
    const previewImage = await SpotImage.findOne({
      where: {
        preview: true,
        spotId: spot.id
      },
      attributes: ['url'],
      raw: true
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
      // convert the avgRating value into number
      avgRating: Number(review[0].avgRating),
      previewImage: previewImage
    }
    allSpots.push(spotList)
  }

  return res.json({
    Spots: allSpots
  })
})

// ********** Create a Spot **********
router.post('/', validateSpot, async (req, res) => {
  const { address, city, state, country, name, lat, lng, description, price } = req.body
//   console.log(req.user.id)
//   const ownerId = req.user.id

  const newSpot = await Spot.create({
    ownerId: "1",
    address: address,
    city: city,
    state: state,
    country: country,
    lat: lat,
    lng: lng,
    name: name,
    description: description,
    price: price
  })

  if (newSpot) {
    res.status(201).json({ newSpot })
  }
//   res.json({message: 'test'})
})

module.exports = router
