const Restaurants = require('../models/restaurants.model');
const Reviews = require('../models/reviews.model');
const AppError = require('../utils/appError');
const { catchAsync } = require('../utils/catchAsync');

const getId = req => {
  let { id, restaurantId } = req.params;
  if (!restaurantId) return id;
  return restaurantId;
};

exports.validIfRestaurantExists = catchAsync(async (req, res, next) => {
  //const { id } = req.params;
  const id = getId(req);

  // Buscar el restaurante
  const restaurant = await Restaurants.findOne({
    attributes: { exclude: ['createdAt', 'updatedAt'] },
    where: {
      id,
      status: 'active',
    },
  });

  // Validar si existe el restaurante
  if (!restaurant) {
    return next(new AppError(`The restaurant has not been found`, 404));
  }
  req.restaurant = restaurant;
  next();
});

exports.validIfReviewExists = catchAsync(async (req, res, next) => {
  const { id, restaurantId } = req.params;
  const { sessionUser } = req;
  // Buscar la reseña
  const review = await Reviews.findOne({
    where: {
      id,
      userId: sessionUser.id,
      restaurantId,
    },
  });

  // Validar si la reseña existe
  if (!review) {
    return next(new AppError(`The review was not found`, 404));
  }

  req.review = review;
  next();
});
