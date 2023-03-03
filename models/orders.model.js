const { DataTypes } = require('sequelize');
const { db } = require('../database/db');

const Orders = db.define('orders', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  /*
  mealsId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  */
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  totalPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM(['active', 'cancelled', 'completed']),
    allowNull: false,
    defaultValue: 'active',
  },
});

module.exports = Orders;
