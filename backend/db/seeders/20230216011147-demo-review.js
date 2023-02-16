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
        review: 'It was great!',
        stars: 5
      },
      {
        userId: 2,
        spotId: 2,
        review: 'Meh',
        stars: 1
      },
      {
        userId: 3,
        spotId: 3,
        review: 'Could have been better',
        stars: 3
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
