'use strict'
const fs = require('fs')
const path = require('path')
const Sequelize = require('sequelize')
const process = require('process')

// Get filename of the current module
const basename = path.basename(__filename)

// Get environment application is running in (defaults to 'development')
const env = process.env.NODE_ENV || 'development'

// Load configuration for the db from the `config/database.js` file
// based on the current environment
const config = require(__dirname + '/../../config/database.js')[env]

// Create an empty object to hold the models for the database
const db = {}

// Create a new Sequelize instance
// based on the configuration loaded from the `config/database.js` file
let sequelize
if (config.use_env_variable) {
  // If a `use_env_variable` property is specified in the configuration,
  // use it to connect to the db
  sequelize = new Sequelize(process.env[config.use_env_variable], config)
} else {
  // Otherwise, use the other properties in the configuration to
  // connect to the db
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  )
}

// Load all the model files from the current directory
fs.readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 && // Exclude hidden files
      file !== basename && // Exclude the current file
      file.slice(-3) === '.js' && // Only include JavaScript files
      file.indexOf('.test.js') === -1 // Exclude any test files
    )
  })
  .forEach(file => {
    // For each model file, require it and add its model to the `db` object
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes
    )
    db[model.name] = model
  })

// Call the `associate` method for each model, if it exists
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db)
  }
})

// Add the Sequelize instance and the Sequelize constructor to the `db` object
db.sequelize = sequelize
db.Sequelize = Sequelize

// Export the `db` object
module.exports = db
