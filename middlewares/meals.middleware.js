const Meals = require('../models/meals.model');
const AppError = require('../utils/appError');
const { catchAsync } = require('../utils/catchAsync');

const getId = req => {
  const { id } = req.params;
  const { mealId } = req.body;
  if (!id) {
    return mealId;
  }
  return id;
};

exports.validIfMealExists = catchAsync(async (req, res, next) => {
  const id = getId(req);

  const meal = await Meals.findOne({
    where: {
      id,
      status: 'active',
    },
  });
  console.log(meal);
  if (!meal) {
    return next(new AppError(`Meal not found`, 404));
  }
  req.meal = meal;
  next();
});
