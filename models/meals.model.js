const { DataTypes } = require('sequelize');
const { db } = require('../database/db');

const Meals = db.define('meals', {
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
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  /*
  restaurantsId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  */
  status: {
    type: DataTypes.ENUM(['active', 'disabled']),
    allowNull: false,
    defaultValue: 'active',
  },
});

module.exports = Meals;
