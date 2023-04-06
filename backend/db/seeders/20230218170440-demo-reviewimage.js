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
        url: "https://images.pexels.com/photos/7579042/pexels-photo-7579042.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        reviewId: 1
      },
         {
        url: "https://images.pexels.com/photos/7579042/pexels-photo-7579042.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        reviewId: 2
      },
         {
        url: "https://images.pexels.com/photos/7579042/pexels-photo-7579042.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        reviewId: 3
      },
       {
        url: "https://images.pexels.com/photos/7579042/pexels-photo-7579042.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        reviewId: 4
      },
       {
        url: "https://images.pexels.com/photos/7579042/pexels-photo-7579042.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        reviewId: 5
      },
       {
        url: "https://images.pexels.com/photos/7579042/pexels-photo-7579042.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        reviewId: 6
      },
       {
        url: "https://images.pexels.com/photos/7579042/pexels-photo-7579042.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        reviewId: 7
      },
       {
        url: "https://images.pexels.com/photos/7579042/pexels-photo-7579042.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        reviewId: 8
      },
       {
        url: "https://images.pexels.com/photos/7579042/pexels-photo-7579042.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        reviewId: 9
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
