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
          `Welcome to our cozy and stylish apartment, located in the heart of downtown! Our space features modern amenities including a fully equipped kitchen, comfortable bedding, and high-speed internet access. Relax in our spacious living room or step out onto the balcony to take in the city views. Our prime location puts you just steps away from some of the citys top attractions, including museums, restaurants, and shops. Whether youre visiting for business or pleasure, our apartment provides the perfect home base for your stay in the city. Book now and make yourself at home!`
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
          `Stay in our spacious and chic flat, situated in the trendy district of the city! Our recently refurbished space boasts state-of-the-art facilities such as a fully fitted kitchen, plush bedding, and speedy internet access. Chill out in our large lounge or take in the panoramic vistas from our balcony. Our unbeatable location places you within easy reach of top-rated restaurants, museums, and shops. Whatever your reason for visiting, our flat is the ultimate destination for a memorable stay in the city. Reserve your spot now and settle in!`
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
          `Welcome to our comfortable and fashionable apartment, conveniently located in the heart of the city! Our newly updated space boasts all the latest conveniences, including a fully equipped kitchen, cozy bedding, and lightning-fast internet. Unwind in our roomy living room or venture out onto the balcony to soak up the sights and sounds of the city. Our prime location puts you within walking distance of some of the most popular tourist spots, such as museums, eateries, and boutiques. Whether you're in town for work or play, our apartment is the perfect choice for your stay. Book now and enjoy your stay!`
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
         `Enjoy a luxurious stay in our stunning apartment, nestled in the heart of downtown! Our space boasts cutting-edge amenities, including a fully furnished kitchen, soft bedding, and ultra-fast internet connectivity. Relax in our spacious living room or take in the beautiful city skyline from our balcony. Our convenient location puts you just moments away from the citys top attractions, such as art galleries, restaurants, and shopping destinations. Whether you're here for business or pleasure, our apartment is the ultimate choice for a comfortable and unforgettable stay. Reserve now and make yourself at home!`
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
        `Experience the ultimate in style and comfort in our beautiful apartment, located in the heart of the city! Our newly renovated space boasts all the latest amenities, including a fully equipped kitchen, plush bedding, and high-speed internet. Lounge in our expansive living room or bask in the panoramic city views from our balcony. Our central location puts you within easy reach of some of the citys top attractions, such as museums, restaurants, and boutique stores. Whether you're in town for business or leisure, our apartment is the ideal choice for your stay. Book now and immerse yourself in luxury!`
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
