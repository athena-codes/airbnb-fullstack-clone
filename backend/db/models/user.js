'use strict'
const bcrypt = require('bcryptjs')

const { Model, Validator } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    // returns an object with only the User instance information that
    // is safe to save to a JWT -->
    toSafeObject () {
      const { id, username, email } = this // context will be the User instance
      return { id, username, email }
    }

    // validate password
    validatePassword (password) {
      return bcrypt.compareSync(password, this.hashedPassword.toString())
    }

    // get current user by id
    static getCurrentUserById (id) {
      return User.scope('currentUser').findByPk(id)
    }

    // login
    static async login ({ credential, password }) {
      const { Op } = require('sequelize')
      const user = await User.scope('loginUser').findOne({
        where: {
          [Op.or]: {
            username: credential,
            email: credential
          }
        }
      })
      if (user && user.validatePassword(password)) {
        return await User.scope('currentUser').findByPk(user.id)
      }
    }

    // signup
    static async signup ({ username, email, password, firstName, lastName }) {
      const hashedPassword = bcrypt.hashSync(password)
      const user = await User.create({
        username,
        email,
        firstName,
        lastName,
        hashedPassword
      })
      return await User.scope('currentUser').findByPk(user.id)
    }

    static associate (models) {
      // define association here
      User.hasMany(models.Spot, { foreignKey: 'ownerId' })
      User.hasMany(models.Booking, { foreignKey: 'userId' })
      User.hasMany(models.Review, { foreignKey: 'userId' })
    }
  }

  User.init(
    {
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          len: [4, 30],
          isNotEmail (value) {
            if (Validator.isEmail(value)) {
              throw new Error('Cannot be an email.')
            }
          }
        }
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
         validate: {
          len: [1, 50],
        }
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
         validate: {
          len: [1, 50],
        }
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [3, 256],
          isEmail: true
        }
      },
      hashedPassword: {
        type: DataTypes.STRING.BINARY,
        allowNull: false,
        validate: {
          len: [60, 60]
        }
      }
    },
    {
      sequelize,
      modelName: 'User',
      defaultScope: {
        attributes: {
          // set a defaultScope on the User model to exclude fields from the default query
          exclude: ['hashedPassword', 'email', 'createdAt', 'updatedAt']
        }
      },
      scopes: {
        // scope for currentUser that will exclude the hashedPassword field
        currentUser: {
          attributes: { exclude: ['hashedPassword'] }
        },
        // scope for including all the fields
        // should only be used when checking the login credentials of a user
        loginUser: {
          attributes: {}
        }
      }
    }
  )
  return User
}
