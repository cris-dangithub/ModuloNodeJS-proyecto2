const Restaurants = require('../models/restaurants.model');
const Reviews = require('../models/reviews.model');
const AppError = require('../utils/appError');
const { appSuccess } = require('../utils/appSuccess');
const { catchAsync } = require('../utils/catchAsync');

const createRestaurant = catchAsync(async (req, res, next) => {
  const { name, address, rating } = req.body;

  const newRestaurant = await Restaurants.create({
    name,
    address,
    rating,
  });

  // Mandar respuesta al cliente
  appSuccess(res, 200, `The restaurant has ben created successfully`, {
    newRestaurant,
  });
});

const getRestaurants = catchAsync(async (req, res, next) => {
  const restaurants = await Restaurants.findAll({
    attributes: { exclude: ['createdAt', 'updatedAt'] },
    where: {
      status: 'active',
    },
  });

  appSuccess(res, 200, `Active restaurants obtained successfully`, {
    restaurants,
  });
});

const getRestaurantById = catchAsync(async (req, res, next) => {
  const { restaurant } = req;

  // Mandar respuesta al cliente
  appSuccess(res, 200, `Restaurant obtained successfully`, { restaurant });
});

const updateRestaurant = catchAsync(async (req, res, next) => {
  const { name, address } = req.body;
  const { restaurant } = req;
  const updatedRestaurant = await restaurant.update({ name, address });
  // Mandar la respuesta al cliente
  appSuccess(res, 200, `Restaurant updated successfully`, {
    updatedRestaurant,
  });
});

const deleteRestaurant = catchAsync(async (req, res, next) => {
  const { restaurant } = req;
  await restaurant.update({ status: 'deleted' });
  // Mandar la respuesta al cliente
  appSuccess(res, 200, `Restaurant deleted successfully`);
});

const createReview = catchAsync(async (req, res, next) => {
  const { comment, rating } = req.body;
  const { sessionUser, restaurant } = req;

  const newReview = await Reviews.create({
    userId: sessionUser.id,
    comment,
    restaurantId: restaurant.id,
    rating,
  });

  // Enviar respuesta al cliente
  appSuccess(res, 200, `The review was created successfully`, { newReview });
});

const updateReview = catchAsync(async (req, res, next) => {
  const { comment, rating } = req.body;
  const { review } = req;

  const updatedReview = await review.update({ comment, rating });

  // Mandar respuesta al cliente
  appSuccess(res, 200, `Review updated successfully`, { updatedReview });
});

const deleteReview = catchAsync(async (req, res, next) => {
  const { review } = req;
  // Actualizar estado de la review a "deleted"
  await review.update({ status: 'deleted' });
  // Mandar respuesta al cliente
  appSuccess(res, 200, `The review was deleted successfully`);
});

module.exports = {
  createRestaurant,
  getRestaurants,
  getRestaurantById,
  updateRestaurant,
  deleteRestaurant,
  createReview,
  updateReview,
  deleteReview,
};
