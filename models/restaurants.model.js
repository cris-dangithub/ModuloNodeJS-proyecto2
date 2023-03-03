const { DataTypes } = require('sequelize');
const { db } = require('../database/db');

const Restaurants = db.define('restaurants', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false,
  },
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

module.exports = Restaurants;
