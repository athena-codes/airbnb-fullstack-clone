'use strict'

let options = {}
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'SpotImages'

    return queryInterface.bulkInsert(options, [
      {
        url: 'https://images.pexels.com/photos/1428348/pexels-photo-1428348.jpeg?auto=compress&cs=tinysrgb&w=600',
        preview: true,
        spotId: 1
      },
      {
        url: 'https://images.pexels.com/photos/6077368/pexels-photo-6077368.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        preview: true,
        spotId: 2
      },
      {
        url: 'https://images.pexels.com/photos/7902916/pexels-photo-7902916.jpeg?auto=compress&cs=tinysrgb&w=300',
        preview: true,
        spotId: 3
      },
      {
        url: 'https://images.pexels.com/photos/9220877/pexels-photo-9220877.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        preview: true,
        spotId: 4
      },
      {
        url: 'https://images.pexels.com/photos/2724749/pexels-photo-2724749.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        preview: true,
        spotId: 5
      },
      {
        url: 'https://images.pexels.com/photos/4603884/pexels-photo-4603884.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        preview: true,
        spotId: 6
      },
      {
        url: 'https://images.pexels.com/photos/8535625/pexels-photo-8535625.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        preview: true,
        spotId: 7
      },
      {
        url: 'https://images.pexels.com/photos/6538940/pexels-photo-6538940.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        preview: true,
        spotId: 8
      },
      {
        url: 'https://images.pexels.com/photos/6903251/pexels-photo-6903251.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        preview: true,
        spotId: 9
      }
    ])
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'SpotImages'
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
