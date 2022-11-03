module.exports = (connection, DataTypes) => {
  const schema = {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: {
          args: true,
          msg: 'The email is in incorrect format.'
        }
      }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [8, 40],
          msg: 'The password length should be between 8 and 40 characters.'
        }
      }
    }
  }
  const RemoveTimeStamp = {
    defaultScope: {
      attributes: { exclude: ['createdAt', 'updatedAt'] }
    },
    timestamps: false
  }
  const ReaderModel = connection.define('Reader', schema, RemoveTimeStamp)
  return ReaderModel
}
