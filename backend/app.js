// Import Packages
const express = require('express')
require('express-async-errors')
const morgan = require('morgan')
const cors = require('cors')
const csurf = require('csurf')
const helmet = require('helmet')
const cookieParser = require('cookie-parser')
const routes = require('./routes')

// Variable will be true if the environment is in production
// by checking the environment key in the config file
const { environment } = require('./config')
const isProduction = environment === 'production'

// Initialize app
const app = express()

// ********* GLOBAL MIDDLEWARE ********
// Connect morgan middleware for logging info about requests and responses in terminal
app.use(morgan('dev'))

// Add cookie-parser middleware for parsing cookies and express.json middleware
// For parsing JSON request bodies with Content-Type of "application/json" -->
app.use(cookieParser())
app.use(express.json())
// **************************************

// ********* WEB SECURITY MIDDLEWARE **********

// Enable cors only in development
if (!isProduction) {
  app.use(cors())
}

// Helmet helps set a variety of headers to better secure your app
app.use(
  helmet.crossOriginResourcePolicy({
    policy: 'cross-origin'
  })
)

// Set the _csrf token and create req.csrfToken method
// cookie is HTTP-only, cannot be read by JS
// req.csrfToken will be set to another cookie (XSRF-TOKEN) later on
app.use(
  csurf({
    cookie: {
      secure: isProduction,
      sameSite: isProduction && 'Lax',
      httpOnly: true
    }
  })
)

// These two cookies work together to provide CSRF (Cross-Site Request Forgery) protection
// The XSRF-TOKEN cookie value needs to be sent in the header of any request with all HTTP
// verbs besides GET. This header will be used to validate the _csrf cookie to confirm that
// the request comes from your site and not an unauthorized site.

// Connect all the routes
app.use(routes)
// **************************************


// ****** ERROR HANDLING MIDDLEWWARE *******

// Catch unhandled requests and forward to error handler.
app.use((_req, _res, next) => {
  const err = new Error("The requested resource couldn't be found.")
  err.title = 'Resource Not Found'
  err.errors = ["The requested resource couldn't be found."]
  err.status = 404
  next(err)
})

const { ValidationError } = require('sequelize')

// Process sequelize errors
app.use((err, _req, _res, next) => {
  // check if error is a Sequelize error:
  if (err instanceof ValidationError) {
    err.errors = err.errors.map(e => e.message)
    err.title = 'Validation error'
  }
  next(err)
})

// Error formatter
app.use((err, _req, res, _next) => {
  res.status(err.status || 500)
  console.error(err)
  res.json({
    title: err.title || 'Server Error',
    message: err.message,
    errors: err.errors,
    stack: isProduction ? null : err.stack
  })
})
// **************************************




module.exports = app
