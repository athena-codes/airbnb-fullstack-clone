'use strict'

let options = {}
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'ReviewImages'

    return queryInterface.bulkInsert(options, [
      {
        url: 'https://images.pexels.com/photos/1428348/pexels-photo-1428348.jpeg?auto=compress&cs=tinysrgb&w=600',
        reviewId: 1
      },
      {
        url: 'https://images.pexels.com/photos/1428348/pexels-photo-1428348.jpeg?auto=compress&cs=tinysrgb&w=600',
        reviewId: 2
      },
   {
        url: 'https://images.pexels.com/photos/1428348/pexels-photo-1428348.jpeg?auto=compress&cs=tinysrgb&w=600',
        reviewId: 3
      }
    ])
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'ReviewImages'
    const Op = Sequelize.Op
    return queryInterface.bulkDelete(
      options,
      {
        reviewId: { [Op.in]: [1, 2, 3] }
      },
      {}
    )
  }
}
