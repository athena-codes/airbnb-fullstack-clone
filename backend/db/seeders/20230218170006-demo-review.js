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
        userId: 3,
        spotId: 1,
        review: 'Nice stay! :D',
        stars: 5
      },
      {
        userId: 1,
        spotId: 2,
        review: 'Ok stay :$',
        stars: 3
      },
      {
        userId: 2,
        spotId: 3,
        review: 'Awful stay >:[',
        stars: 1
      },
      {
        userId: 3,
        spotId: 4,
        review: 'Beautiful space.',
        stars: 5
      },
      {
        userId: 1,
        spotId: 5,
        review: 'Me and my husband had a great experience with the host!',
        stars: 5
      },
      {
        userId: 1,
        spotId: 6,
        review:
          'I had a great time here thank you for the suprise welcoming gifts.',
        stars: 5
      },
      {
        userId: 1,
        spotId: 7,
        review: 'Loved it!!!',
        stars: 5
      },
      {
        userId: 1,
        spotId: 8,
        review: 'Had a great stay in the city.',
        stars: 5
      },
      {
        userId: 1,
        spotId: 9,
        review: 'We will be coming back!!!',
        stars: 5
      }
    ])
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Reviews'
    const Op = Sequelize.Op
    return queryInterface.bulkDelete(
      options,
      {
        spotId: { [Op.in]: [1, 2, 3, 4, 5, 6, 7, 8, 9] }
      },
      {}
    )
  }
}
