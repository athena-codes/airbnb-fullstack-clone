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
        url: 'https://www.pexels.com/photo/brown-wooden-center-table-584399/',
        preview: false,
        spotId: 1
      },
          {
        url: 'https://images.pexels.com/photos/7635919/pexels-photo-7635919.jpeg?auto=compress&cs=tinysrgb&w=400',
        preview: false,
        spotId: 1
      },
          {
        url: 'https://images.pexels.com/photos/1428348/pexels-photo-1428348.jpeg?auto=compress&cs=tinysrgb&w=400',
        preview: false,
        spotId: 1
      },
          {
        url: 'https://images.pexels.com/photos/9582420/pexels-photo-9582420.jpeg?auto=compress&cs=tinysrgb&w=400',
        preview: false,
        spotId: 1
      },
      {
        url: 'https://images.pexels.com/photos/6077368/pexels-photo-6077368.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        preview: true,
        spotId: 2
      },
             {
        url: 'https://images.pexels.com/photos/9130978/pexels-photo-9130978.jpeg?auto=compress&cs=tinysrgb&w=400',
        preview: false,
        spotId: 2
      },
          {
        url: 'https://images.pexels.com/photos/10511470/pexels-photo-10511470.jpeg?auto=compress&cs=tinysrgb&w=400',
        preview: false,
        spotId: 2
      },
          {
        url: 'https://images.pexels.com/photos/2724749/pexels-photo-2724749.jpeg?auto=compress&cs=tinysrgb&w=1600',
        preview: false,
        spotId: 2
      },

      {
        url: 'https://images.pexels.com/photos/7902916/pexels-photo-7902916.jpeg?auto=compress&cs=tinysrgb&w=300',
        preview: true,
        spotId: 3
      },
      {
        url: 'https://images.pexels.com/photos/3337209/pexels-photo-3337209.jpeg?auto=compress&cs=tinysrgb&w=400',
        preview: false,
        spotId: 3
      },
 {
        url: 'https://images.pexels.com/photos/1115804/pexels-photo-1115804.jpeg?auto=compress&cs=tinysrgb&w=1600',
        preview: false,
        spotId: 3
      },
       {
        url: 'https://images.pexels.com/photos/667838/pexels-photo-667838.jpeg?auto=compress&cs=tinysrgb&w=400',
        preview: false,
        spotId: 3
      },
       {
        url: 'https://images.pexels.com/photos/1571463/pexels-photo-1571463.jpeg?auto=compress&cs=tinysrgb&w=1600',
        preview: false,
        spotId: 3
      },
      {
        url: 'https://images.pexels.com/photos/9220877/pexels-photo-9220877.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        preview: true,
        spotId: 4
      },
       {
        url: 'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=400',
        preview: false,
        spotId: 4
      },
        {
        url: 'https://images.pexels.com/photos/1820770/pexels-photo-1820770.jpeg?auto=compress&cs=tinysrgb&w=400',
        preview: false,
        spotId: 4
      },
        {
        url: 'https://images.pexels.com/photos/1571458/pexels-photo-1571458.jpeg?auto=compress&cs=tinysrgb&w=400',
        preview: false,
        spotId: 4
      },
        {
        url: 'https://images.pexels.com/photos/1571459/pexels-photo-1571459.jpeg?auto=compress&cs=tinysrgb&w=400',
        preview: false,
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
