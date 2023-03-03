const Meals = require('../models/meals.model');
const AppError = require('../utils/appError');
const { appSuccess } = require('../utils/appSuccess');
const { catchAsync } = require('../utils/catchAsync');

const createMeal = catchAsync(async (req, res, next) => {
  const { name, price } = req.body;
  const { id } = req.params;

  // Crear el nuevo registro
  const newMeal = await Meals.create({ name, price, restaurantId: id });

  // Mandar respuesta al cliente
  appSuccess(res, 200, `Meal created succcessfully`, { newMeal });
});

const getMeals = catchAsync(async (req, res, next) => {
  // Buscar las comidas con estatus active
  const meals = await Meals.findAll({
    attributes: { exclude: ['createdAt', 'updatedAt'] },
    where: {
      status: 'active',
    },
  });

  // Mandar respuesta al cliente
  appSuccess(res, 200, `Meals obtained successfully`, { meals });
});

const getMealById = catchAsync(async (req, res, next) => {
  const { meal } = req;
  // Mandar respuesta al cliente
  appSuccess(res, 200, `Meal obtained successfully`, { meal });
});

const updateMeal = catchAsync(async (req, res, next) => {
  const { name, price } = req.body;
  const { meal } = req;
  const updatedMeal = await meal.update({ name, price });

  // Mandar respuesta al cliente
  appSuccess(res, 200, `The meal was updated successfully`, { updatedMeal });
});

const deleteMeal = catchAsync(async (req, res, next) => {
  const { meal } = req;
  await meal.update({ status: 'disabled' });

  // Mandar respuesta al cliente
  appSuccess(res, 200, `The meal was deleted successfully`);
});

module.exports = {
  createMeal,
  getMeals,
  getMealById,
  updateMeal,
  deleteMeal,
};
