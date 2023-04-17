'use strict'
const bcrypt = require('bcryptjs')

let options = {}
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'Users'
    // Test data for verification
    return queryInterface.bulkInsert(
      options,
      [
        {
          email: 'newuser2@user.io',
          username: 'Demo-lition',
          firstName: 'Jane',
          lastName: 'Doe',
          hashedPassword: bcrypt.hashSync('password1')
        },
        {
          email: 'newuser3@user.io',
          username: 'FakeUser1',
          firstName: 'Charlie',
          lastName: 'Smith',
          hashedPassword: bcrypt.hashSync('password2')
        },
        {
          email: 'newuser4@user.io',
          username: 'FakeUser2',
          firstName: 'Hannah',
          lastName: 'Montana',
          hashedPassword: bcrypt.hashSync('password3')
        }
      ],
      {}
    )
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Users'
    const Op = Sequelize.Op
    return queryInterface.bulkDelete(
      options,
      {
        username: { [Op.in]: ['Demo-lition', 'FakeUser1', 'FakeUser2'] }
      },
      {}
    )
  }
}
