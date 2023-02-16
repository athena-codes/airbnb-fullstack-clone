'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const spots = [
      {
        ownerId: 1,
        address: '123 Main St',
        city: 'Somecity',
        state: 'MA',
        country: 'USA',
        lat: 37.7749,
        lng: -122.4194,
        name: 'Cozy Cottage',
        price: 150,
        previewImage: 'https://images.pexels.com/photos/1428348/pexels-photo-1428348.jpeg?auto=compress&cs=tinysrgb&w=600',
        description: 'This is a cozy cottage with a lovely garden.',
        avgStarRating: 4,
      },
      {
        ownerId: 2,
        address: '123 Elm St',
        city: 'Someothercity',
        state: 'CA',
        country: 'USA',
        lat: 37.7749,
        lng: -122.4194,
        name: 'Spacious Villa',
        price: 200.0,
        previewImage: 'https://images.pexels.com/photos/4031013/pexels-photo-4031013.jpeg?auto=compress&cs=tinysrgb&w=600',
        description:
          'This is a spacious villa with a pool and a view of the ocean.',
        avgStarRating: 5,
      },
      {
        ownerId: 3,
        address: '789 Oak St',
        city: 'Anothercity',
        state: 'CT',
        country: 'USA',
        lat: 37.7749,
        lng: -122.4194,
        name: 'Luxury Condo',
        price: 399.99,
        previewImage: 'https://images.pexels.com/photos/584399/living-room-couch-interior-room-584399.jpeg?auto=compress&cs=tinysrgb&w=600',
        description:
          'This is a luxury condo with a rooftop deck and a hot tub.',
        avgStarRating: 4,
      }
    ]

    await queryInterface.bulkInsert('Spots', spots, {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Spots', null, {})
  }
}
