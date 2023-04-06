'use strict'

let options = {}
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'Spots'

    return queryInterface.bulkInsert(options, [
      {
        ownerId: 1,
        address: '16 Buckalow Ln',
        city: 'Kansas City',
        state: 'MO',
        country: 'USA',
        lat: 37.7749,
        lng: -122.4194,
        name: 'Cozy Cottage',
        price: 150,
        previewImage:
          'https://images.pexels.com/photos/1428348/pexels-photo-1428348.jpeg?auto=compress&cs=tinysrgb&w=600',
        description:
          'A cozy, welcoming stay for couples on a lovely getaway weekend. Get away from the hustle and bustle and delve into nature at this spot.'
      },
      {
        ownerId: 2,
        address: '123 Elm St',
        city: 'Boston',
        state: 'MA',
        country: 'USA',
        lat: 37.7749,
        lng: -122.4194,
        name: 'City view for 2',
        price: 450,
        previewImage:
          'https://images.pexels.com/photos/6077368/pexels-photo-6077368.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        description:
          'A minimalistic and relaxing space located right outside bean town, with walking distance to commuters routes and an enchanting view of the great city of Boston!'
      },
      {
        ownerId: 3,
        address: '789 Oak St',
        city: 'Los Angeles',
        state: 'CA',
        country: 'USA',
        lat: 37.7749,
        lng: -122.4194,
        name: 'Beachfront Mansion',
        price: 1200,
        previewImage:
          'https://images.pexels.com/photos/7902916/pexels-photo-7902916.jpeg?auto=compress&cs=tinysrgb&w=300',
        description:
          'Lovely villa located right on the coast of the Pacific ocean. An exquisite stay.'
      },
      {
        ownerId: 1,
        address: '185 Great Mountain Dr',
        city: 'Brookfield',
        state: 'CT',
        country: 'USA',
        lat: 37.7749,
        lng: -122.4194,
        name: 'Woodland Wonderland',
        price: 200,
        previewImage:
          'https://images.pexels.com/photos/9220877/pexels-photo-9220877.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        description:
          'An incredible, coniferous experience staying in the lovely woods of the Bear Mountain reservation. Hiking trails, wildlife and outdoor adventure awaits!'
      },
      {
        ownerId: 3,
        address: '22 Massachucetts Ave',
        city: 'Cambridge',
        state: 'MA',
        country: 'USA',
        lat: 37.7749,
        lng: -122.4194,
        name: 'City Stay',
        price: 85,
        previewImage:
          'https://images.pexels.com/photos/2724749/pexels-photo-2724749.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        description:
          'Located in the greated Boston area, clean and lots of included ammenities.'
      },
      {
        ownerId: 3,
        address: '122 Rodney Rd',
        city: 'Key West',
        state: 'FL',
        country: 'USA',
        lat: 37.7749,
        lng: -122.4194,
        name: 'Pure Paradise',
        price: 85,
        previewImage:
          'https://images.pexels.com/photos/4603884/pexels-photo-4603884.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        description:
          'Beaches, sun and lots of fun. This beautiful cot can sleep up to 4 people and is located right on the coastline, just feet from the beach!'
      },
      {
        ownerId: 3,
        address: '180 Rodeo Lane',
        city: 'Austin',
        state: 'TX',
        country: 'USA',
        lat: 37.7749,
        lng: -122.4194,
        name: 'Artists Escape',
        price: 85,
        previewImage:
          'https://images.pexels.com/photos/8535625/pexels-photo-8535625.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        description:
          'Industrially styled apartment with paintings by local well known artists, a truly inspiring space!'
      },
      {
        ownerId: 2,
        address: '8 Majesty St',
        city: 'Chicago',
        state: 'MI',
        country: 'USA',
        lat: 37.7749,
        lng: -122.4194,
        name: 'Funky Downtown Apartment',
        price: 85,
        previewImage:
          'https://images.pexels.com/photos/6538940/pexels-photo-6538940.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        description:
          'A centrally located spot with a fun and unique interior, perfect for a funky monkey like yourself!'
      },
      {
        ownerId: 2,
        address: '2222 Madison Ave',
        city: 'Brooklyn',
        state: 'NY',
        country: 'USA',
        lat: 37.7749,
        lng: -122.4194,
        name: 'Upscale Loft',
        price: 85,
        previewImage:
          'https://images.pexels.com/photos/6903251/pexels-photo-6903251.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        description:
          'Located just a 10 min subway ride to Times Square. Enjoy everything the Big Apple has in store with your stay at this Upscale Loft.'
      }
    ])
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Spots'
    const Op = Sequelize.Op
    return queryInterface.bulkDelete(
      options,
      {
        ownerId: { [Op.in]: [1, 2, 3, 4, 5, 6, 7, 8, 9] }
      },
      {}
    )
  }
}
