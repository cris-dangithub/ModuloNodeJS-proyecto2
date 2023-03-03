const { DataTypes } = require('sequelize');
const { db } = require('../database/db');

const Reviews = db.define('reviews', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  /*
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  */
  comment: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  /*
  restaurantsId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  */
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      isInt: true,
      min: 1,
      max: 5,
    },
  },
  status: {
    type: DataTypes.ENUM(['active', 'deleted']),
    allowNull: false,
    defaultValue: 'active',
  },
});

module.exports = Reviews;
