// **** HANDLE VALIDATIONS MIDDLEWARE ****
// format custom errors from express-validator middleware
const { validationResult } = require('express-validator')

// middleware for formatting errors from express-validator middleware
// (to customize, see express-validator's documentation)
const handleValidationErrors = (req, res, next) => {
  const validationErrors = validationResult(req)

  if (!validationErrors.isEmpty()) {
    const errors = {}
    validationErrors.array().forEach(error => (errors[error.param] = error.msg))

    return res.status(403).json({
      message: 'Validation error',
      statusCode: 400,
      errors: errors
    })
  }
  next()
}

module.exports = {
  handleValidationErrors
}
