'use strict'

let options = {}
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'Bookings'

    return queryInterface.bulkInsert(options, [
      {
        spotId: 1,
        userId: 1,
        startDate: 'Tue Jul 06 2022',
        endDate: 'Tue Jul 08 2022'
      },
      {
        spotId: 2,
        userId: 2,
        startDate: 'Tue Jul 06 2022',
        endDate: 'Tue Jul 08 2022'
      },
      {
        spotId: 3,
        userId: 3,
        startDate: 'Tue Jul 06 2022',
        endDate: 'Tue Jul 08 2022'
      }
    ])
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Bookings'
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
