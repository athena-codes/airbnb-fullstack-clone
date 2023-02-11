// backend/routes/index.js
const express = require('express')
const router = express.Router()
const apiRouter = require('./api')

router.use('/api', apiRouter)


// Test Route:
router.get('/hello/world', function (req, res) {
  res.cookie('XSRF-TOKEN', req.csrfToken())
  res.send('Hello World!')
})


router.get('/api/csrf/restore', (req, res) => {
  const csrfToken = req.csrfToken()
  res.cookie('XSRF-TOKEN', csrfToken)
  res.status(200).json({
    'XSRF-Token': csrfToken
  })
})

// Generates new token on refresh:
// {
// "XSRF-Token": "ILViIFhb-nPMHshF3nndb7b0myDlcISsUaNo"
// }





module.exports = router
