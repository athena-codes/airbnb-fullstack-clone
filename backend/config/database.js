const config = require('./index')

module.exports = {
  development: {
    // load the database configuration environment variables from the
    // .env file into the config/index.js (key is dbFile)
    storage: config.dbFile,
    dialect: 'sqlite',
    seederStorage: 'sequelize',
    logQueryParameters: true,
    typeValidation: true
  },
  production: {
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
