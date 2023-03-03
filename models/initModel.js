const Meals = require('./meals.model');
const Orders = require('./orders.model');
const Restaurants = require('./restaurants.model');
const Reviews = require('./reviews.model');
const Users = require('./users.model');

const initModel = () => {
  // Restaurants - Reviews
  Restaurants.hasMany(Reviews);
  Reviews.belongsTo(Restaurants);

  // Restaurants- Meals
  Restaurants.hasMany(Meals);
  Meals.belongsTo(Restaurants);

  // Meals - Orders
  Meals.hasOne(Orders);
  Orders.belongsTo(Meals);

  // Users - Reviews
  Users.hasMany(Reviews);
  Reviews.belongsTo(Users);

  // Users - Orders
  Users.hasMany(Orders);
  Orders.belongsTo(Users);
};

module.exports = initModel;
