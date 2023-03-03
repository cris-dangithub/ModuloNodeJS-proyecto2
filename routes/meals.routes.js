const { Router } = require('express');
const { check } = require('express-validator');
const { restrictTo, protect } = require('../auth/authorization.middleware');
const {
  createMeal,
  getMeals,
  getMealById,
  updateMeal,
  deleteMeal,
} = require('../controllers/meals.controller');
const { validIfMealExists } = require('../middlewares/meals.middleware');
const {
  validIfRestaurantExists,
} = require('../middlewares/restaurants.middleware');
const { validFields } = require('../middlewares/validField.middleware');

const router = Router();

router.get('/', getMeals);
router.get('/:id', validIfMealExists, getMealById);
// ----------- Rutas protegidas por token ----------
router.use(protect);

router.post(
  '/:id',
  [
    restrictTo('admin'),
    check('name', 'The name must be required').not().isEmpty(),
    check('name', 'The name must be a string').isString(),
    check('price', 'The price must be required').not().isEmpty(),
    check('price', 'The price must be a number').isNumeric(),
    validFields,
    validIfRestaurantExists,
  ],
  createMeal
);

router.patch(
  '/:id',
  [
    restrictTo('admin'),
    check('name', 'The name must be mandatory').not().isEmpty(),
    check('name', 'The name must be a string').isString(),
    check('price', 'The price must be mandatory').not().isEmpty(),
    check('price', 'The price must be a number').isNumeric(),
    validFields,
    validIfMealExists,
  ],
  updateMeal
);

router.delete('/:id', restrictTo('admin'), validIfMealExists, deleteMeal);

module.exports = {
  mealsRouter: router,
};
