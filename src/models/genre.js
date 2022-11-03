module.exports = (connection, DataTypes) => {
  const schema = {
    genre: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: 'We need a genre name'
        },
        notEmpty: {
          args: true,
          msg: 'Insert genre name'
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
  const GenreModel = connection.define('Genre', schema, RemoveTimeStamp)
  return GenreModel
}
