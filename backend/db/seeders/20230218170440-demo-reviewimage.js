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
        url: "https://images.pexels.com/photos/9582419/pexels-photo-9582419.jpeg?auto=compress&cs=tinysrgb&w=400",
        reviewId: 1
      },
         {
        url: "https://images.pexels.com/photos/8349961/pexels-photo-8349961.jpeg?auto=compress&cs=tinysrgb&w=400",
        reviewId: 2
      },
         {
        url: "https://images.pexels.com/photos/11535806/pexels-photo-11535806.jpeg?auto=compress&cs=tinysrgb&w=400",
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
