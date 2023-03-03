const { Router } = require('express');
const { check } = require('express-validator');
const { restrictTo, protect } = require('../auth/authorization.middleware');
const {
  createRestaurant,
  getRestaurants,
  getRestaurantById,
  updateRestaurant,
  deleteRestaurant,
  createReview,
  updateReview,
  deleteReview,
} = require('../controllers/restaurants.controller');
const {
  validIfRestaurantExists,
  validIfReviewExists,
} = require('../middlewares/restaurants.middleware');
const { validFields } = require('../middlewares/validField.middleware');

const router = Router();

router.get('/', getRestaurants);
router.get('/:id', validIfRestaurantExists, getRestaurantById);
// ----------- Rutas protegidas por token ----------
router.use(protect);

router.post(
  '/',
  [
    check('name', 'The name must be required').not().isEmpty(),
    check('name', 'The name must be a string').isString(),
    check('address', 'The address must be required').not().isEmpty(),
    check('address', 'The address must be a string').isString(),
    check('rating', 'The rating must be required').not().isEmpty(),
    check('rating', 'The rating must be a number').isNumeric(),
    restrictTo('admin'),
    validFields,
  ],
  createRestaurant
);

router.patch(
  '/:id',
  [
    restrictTo('admin'),
    check('name', 'The name must be required').not().isEmpty(),
    check('name', 'The name must be a string').isString(),
    check('address', 'The address must be required').not().isEmpty(),
    check('address', 'The address must be a string').isString(),
    validFields,
    validIfRestaurantExists,
  ],
  updateRestaurant
);

router.delete(
  '/:id',
  restrictTo('admin'),
  validIfRestaurantExists,
  deleteRestaurant
);

router.post(
  '/reviews/:id',
  [
    check('comment', 'The comment must be required').not().isEmpty(),
    check('comment', 'The comment must be a string').isString(),
    check('rating', 'The rating must be required').not().isEmpty(),
    check('rating', 'The rating must be a number').isNumeric(),
    validFields,
    validIfRestaurantExists,
  ],
  createReview
);

router.patch(
  '/reviews/:restaurantId/:id',
  [
    check('comment', 'The comment must be mandatory').not().isEmpty(),
    check('comment', 'The comment must be a string').isString(),
    check('rating', 'The rating must be mandatory').not().isEmpty(),
    check('rating', 'The rating must be a number').isNumeric(),
    validFields,
    validIfRestaurantExists,
    validIfReviewExists,
  ],
  updateReview
);

router.delete(
  '/reviews/:restaurantId/:id',
  validIfRestaurantExists,
  validIfReviewExists,
  deleteReview
);

module.exports = {
  restaurantsRouter: router,
};
