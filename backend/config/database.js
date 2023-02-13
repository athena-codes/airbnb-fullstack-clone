// Require the `index.js` module from the same directory and assign it to `config`
const config = require('./index')

// Export an object that defines the configuration for the `development` and `production` environments
module.exports = {
  development: {
    // Set the `storage` option for Sequelize to the `dbFile` property in the `config` object
    // (which is the value of the `DB_FILE` environment variable loaded from the `.env` file)
    storage: config.dbFile,
    dialect: 'sqlite',
    seederStorage: 'sequelize',
    // Enable logging of the parameters for each executed query
    logQueryParameters: true,
    typeValidation: true
  },
  production: {
    // Set the `use_env_variable` option to `DATABASE_URL` to use the URL for the production database
    use_env_variable: 'DATABASE_URL',
    dialect: 'postgres',
    seederStorage: 'sequelize',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    // define the global schema for the project.
    define: {
      schema: process.env.SCHEMA
    }
  }
}
