const jwt = require('jsonwebtoken')
const { jwtConfig } = require('../config')
const { User, Spot, Review } = require('../db/models')

const { secret, expiresIn } = jwtConfig

// Sends a JWT Cookie
const setTokenCookie = (res, user) => {
  // Create the token
  const token = jwt.sign(
    { data: user.toSafeObject() },
    secret,
    { expiresIn: parseInt(expiresIn) } // 604,800 seconds = 1 week
  )

  const isProduction = process.env.NODE_ENV === 'production'

  // Set the token cookie
  res.cookie('token', token, {
    maxAge: expiresIn * 1000, // maxAge in milliseconds
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction && 'Lax'
  })

  return token
}

// middleware function that will verify and parse the JWT's payload
// and search the database for a User with the id in the payload
const restoreUser = (req, res, next) => {
  // token parsed from cookies
  const { token } = req.cookies
  req.user = null

  return jwt.verify(token, secret, null, async (err, jwtPayload) => {
    if (err) {
      return next()
    }

    try {
      const { id } = jwtPayload.data
      req.user = await User.scope('currentUser').findByPk(id)
    } catch (e) {
      res.clearCookie('token')
      return next()
    }

    if (!req.user) res.clearCookie('token')

    return next()
  })
}

// ******* Authentication Middleware Function ********
// If there is no current user, return an error
// Protects route from user who is not logged in
const requireAuth = function (req, res, next) {
  if (req.user) {
    return
  }

  const err = {
    message: 'Authentication required',
    statusCode: 401
  }

  return res.status(401).json(err)
}


// ******* Authorization Middleware Function ********
const authMiddlewareSpot = async (req, res, next) => {
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

const authMiddlewareReview = async (req, res, next) => {
  try {
    const review = await Review.findByPk(req.params.reviewId)
    if (!review) {
      return res.status(404).json({
        message: 'Review not found',
        statusCode: 404
      })
    }
    if (review.userId !== req.user.id) {
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



module.exports = { setTokenCookie, restoreUser, requireAuth, authMiddlewareSpot, authMiddlewareReview }
