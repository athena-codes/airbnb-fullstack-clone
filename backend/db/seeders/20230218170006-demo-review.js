'use strict'

let options = {}
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'Reviews'

    return queryInterface.bulkInsert(options, [
      {
        userId: 1,
        spotId: 1,
        review: 'Nice stay! :D',
        stars: 5
      },
      {
        userId: 2,
        spotId: 2,
        review: 'Ok stay :$',
        stars: 3
      },
      {
        userId: 3,
        spotId: 3,
        review: 'Awful stay >:[',
        stars: 1
      }
    ])
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Reviews'
    const Op = Sequelize.Op
    return queryInterface.bulkDelete(
      options,
      {
        spotId: { [Op.in]: [1, 2, 3] }
      },
      {}
    )
  }
}
