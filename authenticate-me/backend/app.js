// Import Packages
const express = require('express')
require('express-async-errors')
const morgan = require('morgan')
const cors = require('cors')
const csurf = require('csurf')
const helmet = require('helmet')
const cookieParser = require('cookie-parser')

// variable will be true if the environment is in production or not
// by checking the environment key in the configuration file -->
const { environment } = require('./config')
const isProduction = environment === 'production'

// Initialize application
const app = express()

// Connect morgan middleware for logging information about requests and responses
app.use(morgan('dev'))

// Add cookie-parser middleware for parsing cookies and express.json middleware
// for parsing JSON request bodies with Content-Type of "application/json" -->
app.use(cookieParser())
app.use(express.json())


// Security Middleware
if (!isProduction) {
  // enable cors only in development
  app.use(cors())
}

// helmet helps set a variety of headers to better secure your app
app.use(
  helmet.crossOriginResourcePolicy({
    policy: 'cross-origin'
  })
)

// Set the _csrf token and create req.csrfToken method
// cokie is HTTP-only, cannot be read by JS
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
