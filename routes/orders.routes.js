const { Router } = require('express');
const { check } = require('express-validator');
const { protect } = require('../auth/authorization.middleware');
const {
  createOrder,
  getUserOrders,
  updateOrder,
  deleteOrder,
} = require('../controllers/order.controller');
const { validIfMealExists } = require('../middlewares/meals.middleware');
const { validIfOrderExists } = require('../middlewares/orders.middleware');
const { validFields } = require('../middlewares/validField.middleware');

const router = Router();
// ----------- Rutas protegidas por token ----------
router.use(protect);

router.get('/me', getUserOrders);

router.post(
  '/',
  [
    check('quantity', 'The quantity must be mandatory').not().isEmpty(),
    check('quantity', 'The quantity must be a number').isNumeric(),
    check('mealId', 'The mealId must be mandatory').not().isEmpty(),
    check('mealId', 'The mealId must be a number').isNumeric(),
    validFields,
    validIfMealExists,
  ],
  createOrder
);

router.patch('/:id', validIfOrderExists, updateOrder);

router.delete('/:id', validIfOrderExists, deleteOrder);

module.exports = {
  ordersRouter: router,
};
